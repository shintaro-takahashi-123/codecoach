<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class ModelAnswerController extends Controller
{
    /**
     * 1 つの質問（ prompt ）を受け取り、模範解答と解説を JSON で返す。
     * 返却スキーマ:
     * {
     *   "answer_text": "…",
     *   "explanation": "…"
     * }
     */
    public function generate(Request $request)
    {
        // 1) 入力チェック
        $request->validate([
            'prompt' => 'required|string',
        ]);

        // 2) メッセージ準備（JSON 強制）
        $messages = [
            [
                'role'    => 'system',
                'content' => <<<SYS
あなたは優秀なプログラミング講師です。
必ず **有効な JSON オブジェクトのみ** を返してください（コードブロック禁止）。
スキーマ:
{
  "answer_text": "最終的な模範解答のコードまたはアルゴリズム手順",
  "explanation": "なぜその解法になるのかを日本語で詳しく解説"
}
SYS
            ],
            [
                'role'    => 'user',
                'content' => $request->input('prompt'),
            ],
        ];

        // 3) OpenAI 呼び出し
        $res = OpenAI::chat()->create([
            'model'           => env('OPENAI_MODEL', 'gpt-4o'),
            'messages'        => $messages,
            'response_format' => ['type' => 'json_object'],
            'temperature'     => 0.3,
            'max_tokens'      => 1500,
        ]);

        $raw  = $res['choices'][0]['message']['content'] ?? '{}';
        $json = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('ModelAnswer JSON parse error', ['raw' => $raw]);

            return response()->json([
                'status'  => 'fail',
                'message' => 'AI が正しい JSON を返しませんでした。',
                'raw'     => $raw,
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $json,
        ]);
    }
}
