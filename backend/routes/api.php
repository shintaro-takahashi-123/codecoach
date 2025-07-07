<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LearningLogController;
use App\Http\Controllers\HintController;
use App\Http\Controllers\ModelAnswerController;



// Route::middleware('auth:sanctum')->group(function () {
   
// });

Route::post('/learning_logs', [LearningLogController::class, 'LearningLogRegister']);
Route::get('/learning_logs', [LearningLogController::class, 'LearningLogShowList']);
Route::get('/learning_logs/{id}', [LearningLogController::class, 'SpecificLearningLog']);
Route::put('/learning_logs/{id}', [LearningLogController::class, 'UpdateLearningLog']);
Route::post('/hints/generate', [HintController::class, 'generate']);
Route::post('/model_answers/generate', [ModelAnswerController::class, 'generate']);