<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LearningLog;
use Illuminate\Support\Facades\Validator;

class LearningLogController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'problem_title' => 'required|string|max:255',
            'problem_desc' => 'nullable|string',
            'status' => 'in:in_progress,completed,abandoned',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => collect($validator->errors())->map(function ($messages, $field) {
                    return ['field' => $field, 'message' => $messages[0]];
                })->values(),
            ], 422);
        }

        $learningLog = LearningLog::create([
            'user_id' => Auth::id(),
            'problem_title' => $request->problem_title,
            'problem_desc' => $request->problem_desc,
            'status' => $request->status ?? 'in_progress',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $learningLog,
            'message' => 'Learning log created successfully',
        ], 201);
    }

    public function index()
    {
        $logs = LearningLog::where('user_id', Auth::id())
            ->select('id', 'problem_title', 'status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $logs,
        ]);
    }

    public function show($id)
    {
        $learningLog = LearningLog::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$learningLog) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Learning log not found or unauthorized'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $learningLog
        ]);
    }

    public function update(Request $request, $id)
    {
        $learningLog = LearningLog::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$learningLog) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Learning log not found or unauthorized'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'problem_title' => 'sometimes|required|string|max:255',
            'problem_desc' => 'nullable|string',
            'status' => 'sometimes|required|string|in:in_progress,completed,abandoned',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => collect($validator->errors())->map(function ($messages, $field) {
                    return ['field' => $field, 'message' => $messages[0]];
                })->values(),
            ], 422);
        }

        $learningLog->fill($request->only(['problem_title', 'problem_desc', 'status']));
        $learningLog->save();

        return response()->json([
            'status' => 'success',
            'data' => $learningLog,
            'message' => 'Learning log updated successfully',
        ]);
    }
}
