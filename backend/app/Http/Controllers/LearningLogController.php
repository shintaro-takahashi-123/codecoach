<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LearningLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class LearningLogController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'problem_title' => 'nullable|string|max:255',
            'problem_desc'  => 'nullable|string',
            'status'        => 'nullable|string|in:in_progress,completed,abandoned',
            'model_answer'  => 'nullable|string',
            'explanation'   => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => collect($validator->errors())->map(fn($messages, $field) => [
                    'field' => $field, 'message' => $messages[0]
                ])->values(),
            ], 422);
        }

        try {
            $log = LearningLog::create([
                'user_id'      => Auth::id(),
                'problem_title'=> $request->problem_title,
                'problem_desc' => $request->problem_desc,
                'status'       => $request->status ?? 'in_progress',
                'model_answer' => $request->model_answer,
                'explanation'  => $request->explanation,
            ]);

            return response()->json([
                'status'  => 'success',
                'data'    => $log,
                'message' => 'ログを保存しました',
            ], 201);
        } catch (\Throwable $e) {
            Log::error('LearningLog保存エラー', ['error' => $e->getMessage()]);
            return response()->json([
                'status' => 'fail',
                'message' => '内部エラーにより保存できませんでした',
            ], 500);
        }
    }

    public function index()
    {
        $logs = LearningLog::query()
            ->when(Auth::check(), fn($q) => $q->where('user_id', Auth::id()))
            ->when(!Auth::check(), fn($q) => $q->whereNull('user_id'))
            ->select([
                'id',
                'problem_title',
                'problem_desc',      // ✅ 追加
                'model_answer',      // ✅ 追加
                'explanation',       // ✅ 追加
                'status',
                'created_at',
            ])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    public function show($id)
    {
        $log = LearningLog::query()
            ->where('id', $id)
            ->when(Auth::check(), fn($q) => $q->where('user_id', Auth::id()))
            ->when(!Auth::check(), fn($q) => $q->whereNull('user_id'))
            ->first();

        if (!$log) {
            return response()->json([
                'status' => 'fail',
                'message' => '指定されたログが見つかりません',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $log,
        ]);
    }

    public function update(Request $request, $id)
    {
        $log = LearningLog::query()
            ->where('id', $id)
            ->when(Auth::check(), fn($q) => $q->where('user_id', Auth::id()))
            ->when(!Auth::check(), fn($q) => $q->whereNull('user_id'))
            ->first();

        if (!$log) {
            return response()->json([
                'status' => 'fail',
                'message' => '対象ログが見つからないか、権限がありません',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'problem_title' => 'nullable|string|max:255',
            'problem_desc'  => 'nullable|string',
            'status'        => 'nullable|string|in:in_progress,completed,abandoned',
            'model_answer'  => 'nullable|string',
            'explanation'   => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => collect($validator->errors())->map(fn($messages, $field) => [
                    'field' => $field, 'message' => $messages[0]
                ])->values(),
            ], 422);
        }

        $log->fill($request->only([
            'problem_title',
            'problem_desc',
            'status',
            'model_answer',
            'explanation',
        ]))->save();

        return response()->json([
            'status' => 'success',
            'data'   => $log,
        ]);
    }
}
