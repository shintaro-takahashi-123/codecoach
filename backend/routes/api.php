<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\LearningLogController;
use App\Http\Controllers\HintController;
use App\Http\Controllers\ModelAnswerController;
use App\Http\Controllers\AnalysisController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'data' => $request->user(),
    ]);
});


Route::middleware('auth:sanctum')->group(function () {
    //学習履歴
    Route::post('/learning_logs', [LearningLogController::class, 'store']);
    Route::get('/learning_logs', [LearningLogController::class, 'index']);
    Route::get('/learning_logs/{id}', [LearningLogController::class, 'show']);
    Route::put('/learning_logs/{id}', [LearningLogController::class, 'update']);

    Route::post('/analyze-skills', [AnalysisController::class, 'analyze']);

    //学習目標
    // Route::post('/goals', [GoalController::class, 'store']);
    // Route::get('/goals', [GoalController::class, 'index']);
    // Route::put('/goals/{id}', [GoalController::class, 'update']);
    // Route::delete('/goals/{id}', [GoalController::class, 'destroy']);
    
    Route::post('/hints/generate', [HintController::class, 'generate']);
    Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);


});