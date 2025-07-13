<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SkillAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'matchRate' => 85,
                'skills' => $request->skills,
                'advice' => 'あなたのスキルセットは十分に魅力的です！',
                'roadmap' => [
                    'Week 1' => 'React を強化しよう',
                    'Week 2' => 'AWS の学習を始めよう',
                ]
            ]
        ]);
    }
}
