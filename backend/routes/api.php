<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LearningLogController;
use App\Http\Controllers\HintController;
use App\Http\Controllers\ModelAnswerController;




// 新規登録・ログイン
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ログイン中ユーザー取得
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

// 認証が必要なAPIグループ
Route::middleware('auth:sanctum')->group(function () {
    // 学習ログAPI（mainの新しい形式）
    Route::post('/learning_logs', [LearningLogController::class, 'store']);
    Route::get('/learning_logs', [LearningLogController::class, 'index']);
    Route::get('/learning_logs/{id}', [LearningLogController::class, 'show']);
    Route::put('/learning_logs/{id}', [LearningLogController::class, 'update']);

    // 必要ならヒントや模範解答APIもここに（認証必須にしたい場合は↓）
    // Route::post('/hints/generate', [HintController::class, 'generate']);
    // Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);
});

// 認証なしでも使えるAPI（必要ならここ）
Route::post('/hints/generate', [HintController::class, 'generate']);
Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);
