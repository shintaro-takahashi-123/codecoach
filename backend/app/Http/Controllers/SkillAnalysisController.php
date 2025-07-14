<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SkillAnalysisController extends Controller
{
    public function analyze(Request $request)
{
    $userSkills = $request->input('skills', []);
    $targetLevel = 4;
    $maxPerSkill = $targetLevel;
    $totalSkills = count($userSkills);
    
    if ($totalSkills === 0) {
        return response()->json([
            'status' => 'error',
            'message' => 'スキル情報が不足しています。',
        ]);
    }

    // 現在の合計スキルレベル
    $currentTotal = array_sum(array_map('intval', $userSkills));
    
    // 目標との一致率（割合）
    $maxTotal = $totalSkills * $maxPerSkill;
    $matchRate = ($currentTotal / $maxTotal) * 100;

    return response()->json([
        'status' => 'success',
        'data' => [
            'matchRate' => round($matchRate, 1),
            'skills' => $userSkills,
            'advice' => '分析結果に基づくアドバイスがここに入ります。',
            'roadmap' => [
                'Week 1' => '不足している分野の復習を始めましょう',
                'Week 2' => '実践課題にチャレンジしましょう',
            ]
        ]
    ]);
}

}