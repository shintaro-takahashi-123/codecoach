<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class HintController extends Controller
{
    /** POST /api/hints/generate */
    public function generate(Request $request)
    {
        /* ---------- 1. バリデーション ---------- */
        $request->validate([
            'prompt'          => 'required|string',
            'history'         => 'array',
            'history.*.role'  => 'in:user,assistant',
            'history.*.text'  => 'string',
            'shown_step'      => 'integer|min:0',
        ]);

        $shownStep = (int) $request->input('shown_step', 0);
        $prompt    = $request->input('prompt');

        /* ---------- 2. system プロンプト ---------- */
        $sys = <<<PROMPT
あなたは優秀なプログラミング講師です。
回答は **必ず日本語** で行い、**有効な JSON のみ** を返してください。
コードブロックや前後の余計な文字列は禁止です。

出力スキーマ (shown_step = %d):

{
  "algorithm":     "アルゴリズム名 (不明なら \"unknown\")",
  "overall_steps": ["手順1", "手順2", ...],
  "feedback":      "今回ユーザーが送った内容へのフィードバック (shown_step が 0 のときは空文字列)",
  "next_hint":     { "step": %d, "text": "ヒントを 1 文だけ" },
  "solved":        <true|false>   // ユーザーが完成コードを提出 or 「解けた」と明言したときのみ true
}
PROMPT;
        $sys = sprintf($sys, $shownStep, $shownStep + 1);

        /* ---------- 3. 会話履歴 ---------- */
        $messages   = [['role' => 'system', 'content' => $sys]];
        foreach ($request->input('history', []) as $h) {
            $messages[] = [
                'role'    => $h['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => $h['text'],
            ];
        }
        $messages[] = ['role' => 'user', 'content' => $prompt];

        /* ---------- 4. OpenAI 呼び出し ---------- */
        $res = OpenAI::chat()->create([
            'model'           => env('OPENAI_MODEL', 'gpt-4o'),
            'messages'        => $messages,
            'response_format' => ['type' => 'json_object'],
            'max_tokens'      => 900,
            'temperature'     => 0.4,
        ]);

        $raw  = $res['choices'][0]['message']['content'] ?? '{}';
        $data = json_decode($raw, true);

        /* ---------- 5. JSON 修復（1 回） ---------- */
        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('JSON parse fail – retry', ['raw' => $raw]);

            $fix = OpenAI::chat()->create([
                'model'           => env('OPENAI_MODEL', 'gpt-4o'),
                'messages'        => [
                    ['role' => 'system', 'content' => '次の文字列を**純粋な JSON** に直して返してください。'],
                    ['role' => 'user',   'content' => $raw],
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature'     => 0,
                'max_tokens'      => 2000,
            ]);

            $raw  = $fix['choices'][0]['message']['content'] ?? '{}';
            $data = json_decode($raw, true);
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'AI が正しい JSON を返しませんでした。',
                'raw'     => $raw,
            ], 500);
        }

        /* ---------- 6. フィードバック & solved のサニタイズ ---------- */
        if ($shownStep === 0) {
            $data['feedback'] = '';          // 初回は空文字列に
        }
        if (!$this->userClaimsSolved($prompt) && $shownStep === 0) {
            $data['solved'] = false;         // 早期 solved=true を抑止
        }

        /* ---------- 7. 正常レス ---------- */
        return response()->json([
            'status' => 'success',
            'data'   => $data,
        ]);
    }

    private function userClaimsSolved(string $t): bool
    {
        return (bool) preg_match('/(解決|解けた|ac|accepted|pass|passed|done)/iu', $t);
    }
}
