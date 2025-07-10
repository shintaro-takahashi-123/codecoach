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
            'prompt'               => 'required|string',
            'history'              => 'array',
            'history.*.role'       => 'in:user,assistant',
            // text でも content でも良いように
            'history.*.text'       => 'sometimes|string',
            'history.*.content'    => 'sometimes|string',
            'shown_step'           => 'integer|min:0',
        ]);

        $shownStep = (int) $request->input('shown_step', 0);
        $prompt    = $request->input('prompt');

        /* ---------- 2. system プロンプト ---------- */
        $sys = <<<PROMPT
あなたは優秀なプログラミング講師です。
回答は **必ず日本語** で行い、**純粋な JSON** だけを返してください。
コードブロックや前後の余計な文字列は禁止です。

出力スキーマ (shown_step = %d):

{
  "algorithm":     "アルゴリズム名 (不明なら \"unknown\")",
  "overall_steps": ["手順1", "手順2", ...],
  "feedback":      "今回ユーザーが送った内容に対するフィードバック (初回は空文字列)",
  "next_hint":     { "step": %d, "text": "ヒントを 1 文だけ" },
  "solved":        <true|false>   // ユーザーが完成コード提出 or 「解けた」と言ったら true
}
PROMPT;

        $sys = sprintf($sys, $shownStep, $shownStep + 1);

        /* ---------- 3. 会話履歴 ---------- */
        $messages = [['role' => 'system', 'content' => $sys]];

        foreach ($request->input('history', []) as $h) {
            $content = $h['text'] ?? $h['content'] ?? null;
            if ($content === null || $content === '') {
                continue; // 無い場合はスキップ
            }
            $messages[] = [
                'role'    => ($h['role'] ?? 'user') === 'assistant' ? 'assistant' : 'user',
                'content' => $content,
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

        /* ---------- 5. JSON 修正リトライ (1 回だけ) ---------- */
        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('JSON parse fail – retry', ['raw' => $raw]);

            $retry = OpenAI::chat()->create([
                'model'           => env('OPENAI_MODEL', 'gpt-4o'),
                'messages'        => [
                    ['role' => 'system', 'content' => '次のテキストを**純粋な JSON** に変換して返してください。'],
                    ['role' => 'user',   'content' => $raw],
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature'     => 0,
                'max_tokens'      => 1500,
            ]);

            $raw  = $retry['choices'][0]['message']['content'] ?? '{}';
            $data = json_decode($raw, true);
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'AI が正しい JSON を返しませんでした。',
                'raw'     => $raw,
            ], 500);
        }

        /* ---------- 6. サニタイズ ---------- */
     // 初回（shown_step=0）はフィードバックを空にするが、
     // ２回目以降は AI が返したフィードバックをそのまま通す
     if ($shownStep === 0) {
         $data['feedback'] = '';
     }
 
     // solved フラグの早とちり防止
     if (!$this->userClaimsSolved($prompt) && $shownStep === 0) {       


            $data['solved'] = false;
        }

        /* ---------- 7. 正常レス ---------- */
        return response()->json([
            'status' => 'success',
            'data'   => $data,
        ]);
    }

    /** ユーザーが「解けた」と主張しているか簡易判定 */
    private function userClaimsSolved(string $t): bool
    {
        return (bool) preg_match('/(解決|解けた|ac|accepted|pass|passed|done)/iu', $t);
    }
}
