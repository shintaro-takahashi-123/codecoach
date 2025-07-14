<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LearningLogController;
use App\Http\Controllers\HintController;
use App\Http\Controllers\ModelAnswerController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SkillAnalysisController;
use App\Http\Controllers\CompanySuggestController;


// 記録不要API
Route::post('/learning_logs', [LearningLogController::class, 'store']);
Route::get('/learning_logs', [LearningLogController::class, 'index']);
Route::get('/learning_logs/{id}', [LearningLogController::class, 'show']);
Route::put('/learning_logs/{id}', [LearningLogController::class, 'update']);
Route::post('/hints/generate', [HintController::class, 'generate']);
Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);
Route::post('/suggest-companies', [CompanyController::class, 'suggest']);
Route::post('/analyze-skills', [SkillAnalysisController::class, 'analyze']);
Route::options('/{any}', fn() => response('', 204))
      ->where('any', '.*');   // ←プリフライト用の汎用 OPTIONS
Route::post('/companies/suggest', [CompanySuggestController::class, 'suggest']);



// 認証必須API
Route::middleware('auth:sanctum')->group(function () {
    // ログイン後のみ利用可能なルートを追加
});
