<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\OpenAIService;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Log;

class GPTController extends Controller
{
    protected $openai;

    public function __construct(OpenAIService $openai)
    {
        $this->openai = $openai;
    }

    /**
     * スキル診断とGPT分析
     */
    public function analyzeSkills(Request $request)
    {
        $validated = $request->validate([
            'annualIncome' => 'required|string',
            'jobType' => 'required|string',
            'skills' => 'required|array',
        ]);

        // プロンプト構築
        $prompt = $this->openai->buildSkillAnalysisPrompt($validated);

        $messages = [
            ['role' => 'system', 'content' => 'あなたはプロのキャリアアドバイザーです。'],
            ['role' => 'user', 'content' => $prompt],
        ];

        try {
            $result = $this->openai->chat($messages);
            Log::info("GPT出力: " . $result);

            $parsed = json_decode($result, true);

            if ($parsed === null) {
                Log::error("GPT出力のJSONパースに失敗: " . json_last_error_msg());
                return response()->json(['error' => 'GPT出力の形式が不正です'], 500);
            }

            // DBに保存
            $profile = UserProfile::create([
                'annual_income' => $validated['annualIncome'],
                'job_type' => $validated['jobType'],
                'skills' => $validated['skills'],
                'gpt_result' => $parsed,
            ]);

            return response()->json([
                'result' => $parsed,
                'profileId' => $profile->id,
            ]);
        } catch (\Exception $e) {
            Log::error("GPT通信エラー: " . $e->getMessage());
            return response()->json(['error' => '分析に失敗しました'], 500);
        }
    }

    /**
     * 分析結果の取得（履歴表示用）
     */
    public function showProfile($id)
    {
        $profile = UserProfile::findOrFail($id);
        return response()->json($profile);
    }
}
