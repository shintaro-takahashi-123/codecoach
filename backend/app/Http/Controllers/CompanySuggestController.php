<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class CompanySuggestController extends Controller
{
    /** POST /api/companies/suggest */
    public function suggest(Request $request)
    {
        /* ===== 1. 入力 ===== */
        $income  = $request->input('income');
        $jobType = $request->input('jobType');
        $skills  = $request->input('skills', []);

        $skillStr = implode(', ', array_map(
            fn($k, $v) => "$k:レベル$v", array_keys($skills), $skills
        ));

        /* ===== 2. プロンプト ===== */
        $prompt = <<<PROMPT
あなたは日本のIT転職エージェントです。
下記条件に『少しでも当てはまる』IT企業を **必ず10社** 生成し、
**[ で始まる JSON 配列のみ** で返してください（文章は禁止）。

■ 条件
- 年収 : {$income}
- 職種 : {$jobType}
- スキル : {$skillStr}

■ 厳守
- 要素キー : id,name,description,matchRate,techStack,location,salaryRange
- id=1〜10 連番 / matchRate=80〜100 (整数)
- 架空企業可
PROMPT;

        /* ===== 3. ChatGPT 呼び出し ===== */
        $raw = $this->askGPT($prompt, 'call');

        /* ===== 4. デコード & 必要なら修正 ===== */
        $companies = $this->safeDecode($raw);

        if (count($companies) !== 10) {
            $fixPrompt = "次の内容を『必ず 10 件の JSON 配列』に修正し返してください：\n{$raw}";
            $raw  = $this->askGPT($fixPrompt, 'fix');
            $companies = $this->safeDecode($raw);
        }

        /* ===== 5. フォールバック ===== */
        if (!is_array($companies) || count($companies) === 0) {
            $companies = [];
        }

        return response()->json([
            'status' => 'success',
            'data'   => $companies,
        ]);
    }

    /* ---------- ChatGPT 共通 ---------- */
    private function askGPT(string $content, string $tag): string
    {
        $res = OpenAI::chat()->create([
            'model' => env('OPENAI_MODEL', 'gpt-4o'),
            'messages' => [
                ['role'=>'system','content'=>'JSON 配列のみ返してください。文章は禁止。'],
                ['role'=>'user',  'content'=>$content],
            ],
            // ★ response_format を外す → 配列そのまま返して OK
            'max_tokens'  => 1800,
            'temperature' => 0.8,
        ]);

        $raw = $res['choices'][0]['message']['content'] ?? '[]';
        Log::info("AI raw response ({$tag})", ['raw'=>$raw]);
        return $raw;
    }

    /* ---------- JSON デコード補助 ---------- */
    private function safeDecode(string $json)
    {
        // --- ★ここから 追加：コードブロック除去 ---
        $json = trim($json);
        // 先頭の```jsonや```を削除
        $json = preg_replace('/^```json\s*/', '', $json);
        $json = preg_replace('/^```\s*/', '', $json);
        // 末尾の```を削除
        $json = preg_replace('/```$/', '', $json);
        // 全角スペース→半角
        $json = preg_replace('/\x{3000}/u', ' ', $json);
        // 末尾カンマ除去
        $json = preg_replace('/,\s*([\]\}])/', '$1', $json);
        $json = trim($json);

        $decoded = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('CompanySuggest: json_decode error', [
                'error' => json_last_error_msg(),
                'raw'   => mb_strimwidth($json, 0, 300, '…'),
            ]);
            return [];
        }
        // 1件のみオブジェクトだった場合
        if (isset($decoded['id'])) {
            return [$decoded];
        }
        return $decoded;
    }
}
