<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LearningLogController;
use App\Http\Controllers\HintController;
use App\Http\Controllers\ModelAnswerController;

// Sanctum 認証用の CSRF Cookie 取得（React 側で最初に呼び出す）
Route::get('/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

// 新規登録・ログイン
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ログイン中ユーザー取得（React 側でログイン状態を確認するために使用）
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

// 認証が必要なAPIグループ
Route::middleware('auth:sanctum')->group(function () {
    // 学習ログAPI
    Route::post('/learning_logs', [LearningLogController::class, 'store']);
    Route::get('/learning_logs', [LearningLogController::class, 'index']);
    Route::get('/learning_logs/{id}', [LearningLogController::class, 'show']);
    Route::put('/learning_logs/{id}', [LearningLogController::class, 'update']);

    // 認証が必要なヒント・模範解答API（必要ならこちらを有効化）
    // Route::post('/hints/generate', [HintController::class, 'generate']);
    // Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);
});

// 認証なしでも使えるAPI（現状維持）
Route::post('/hints/generate', [HintController::class, 'generate']);
Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);
