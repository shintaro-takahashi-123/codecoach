<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenAIService
{
    public function chat(array $messages, string $model = 'gpt-4'): string
    {
        $response = Http::withToken(config('services.openai.key'))
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $model,
                'messages' => $messages,
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            throw new \Exception('OpenAI APIエラー: ' . $response->body());
        }

        return $response->json('choices.0.message.content');
    }

    public function buildSkillAnalysisPrompt(array $data): string
    {
        $prompt = "あなたはプロのキャリアアドバイザーです。\n";
        $prompt .= "ユーザーは「{$data['jobType']}」を目指しており、希望年収は「{$data['annualIncome']}」です。\n";
        $prompt .= "以下のスキルレベルに基づいて、必要スキルとのギャップを分析し、学習アドバイスと10週間のロードマップを提案してください。\n";
        $prompt .= "出力は以下のJSON形式で返してください：\n";
        $prompt .= <<<EOT
    {
    "matchRate": 数値（例: 68）,
    "skills": {
        "React": { "current": 数値, "required": 数値 },
        ...
    },
    "advice": "簡潔なアドバイス文",
    "roadmap": {
        "Week 1–2": "学習内容",
        ...
    }
    }
    EOT;
        $prompt .= "\n\nスキルレベル:\n";
        foreach ($data['skills'] as $skill => $level) {
            $prompt .= "- {$skill}: レベル{$level}\n";
        }

        return $prompt;
    }

//     public function suggestCompaniesPrompt(array $data): string
//     {
//         return <<<EOT
//     ユーザーは「{$data['jobType']}」を希望しており、希望年収は「{$data['annualIncome']}」です。
//     この条件に合致する日本国内の企業を5社提案してください。
//     出力は"必ず"JSON配列のみで返してください。前後に説明文は不要です。


//     [
//     {
//         "name": "企業名",
//         "type": "企業タイプ（例：自社開発、スタートアップ、外資系など）",
//         "tech": "主な技術スタック（例：React, Go, AWSなど）",
//         "reason": "この条件に合っている理由（簡潔に）"
//     },
//     ...
//     ]
// EOT;
//     }
}
