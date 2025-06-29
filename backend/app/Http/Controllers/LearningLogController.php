<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LearningLog;
use Illuminate\Support\Facades\Validator;

class LearningLogController extends Controller
{
    public function store(Request $request)
    {
        // バリデーション
        $validator = Validator::make($request->all(), [
            'problem_title' => 'required|string|max:255',
            'problem_desc' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => collect($validator->errors())->map(function ($messages, $field) {
                    return ['field' => $field, 'message' => $messages[0]];
                })->values(),
            ], 422);
        }

        // 学習履歴作成（ユーザーIDは仮に1固定。認証連携時に修正
        $learningLog = LearningLog::create([
            'user_id' => Auth::id(),
            'problem_title' => $request->problem_title,
            'problem_desc' => $request->problem_desc,
            'status' => 'in_progress',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $learningLog,
            'message' => 'Learning log created successfully',
        ], 201);
    }

    public function index()
    {
        $logs = \App\Models\LearningLog::all(['id', 'user_id', 'problem_title', 'status', 'created_at']);

        return response()->json([
            'status' => 'success',
            'data' => $logs,
        ]);
    }

    public function show($id)
    {
        $learningLog = LearningLog::find($id);

        if (!$learningLog) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Learning log not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $learningLog
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $learningLog = LearningLog::find($id);

        if (!$learningLog) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Learning log not found'
            ], 404);
        }

        // バリデーション
        $validator = Validator::make($request->all(), [
            'problem_title' => 'sometimes|required|string|max:255',
            'problem_desc' => 'nullable|string',
            'status' => 'sometimes|required|string|in:in_progress,completed,abandoned', // 必要に応じてステータスの値を定義
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => collect($validator->errors())->map(function ($messages, $field) {
                    return ['field' => $field, 'message' => $messages[0]];
                })->values(),
            ], 422);
        }

        // 更新
        $learningLog->fill($request->only(['problem_title', 'problem_desc', 'status']));
        $learningLog->save();

        return response()->json([
            'status' => 'success',
            'data' => $learningLog,
            'message' => 'Learning log updated successfully',
        ], 200);
    }



}
