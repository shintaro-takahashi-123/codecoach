<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $validated = $request->validate([
            'income' => 'required|string',
            'jobType' => 'required|string',
            'company' => 'required|array',
            'company.name' => 'required|string',
            'company.type' => 'required|string',
            'company.tech' => 'required|string',
            'skills' => 'required|array',
        ]);

        $skillsText = collect($validated['skills'])
            ->map(fn($level, $skill) => "$skill: $level")
            ->implode(', ');

        $prompt = <<<EOT
以下のユーザー情報をもとに、目標と現在のスキルのギャップを分析してください。

- 希望年収: {$validated['income']}
- 希望職種: {$validated['jobType']}
- 希望企業タイプ: {$validated['company']['type']}
- 技術スタック: {$validated['company']['tech']}
- 現在のスキル: {$skillsText}

出力形式は以下のJSON形式でお願いします：

{
  "matchRate": 数値（0〜100）,
  "skills": {
    "React": 数値（0〜4）,
    "Docker": 数値（0〜4）,
    ...
  },
  "advice": "文字列",
  "roadmap": {
    "Week 1": "内容",
    "Week 2": "内容",
    ...
  }
}
EOT;

        try {
            $response = Http::withToken(env('OPENAI_API_KEY'))
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4',
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => 0.7,
                ]);

            $content = $response->json('choices.0.message.content');

            $parsed = json_decode($content, true, 512, JSON_THROW_ON_ERROR);

            return response()->json([
                'status' => 'success',
                'data' => $parsed,
            ]);
        } catch (\JsonException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'GPTからの出力が不正です。',
                'raw' => $content ?? null,
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => '分析に失敗しました。',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
