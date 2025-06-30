<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LearningLogController;

// Route::middleware('auth:sanctum')->group(function () {
   
// });

Route::post('/learning_logs', [LearningLogController::class, 'LearningLogRegister']);
Route::get('/learning_logs', [LearningLogController::class, 'LearningLogShowList']);
Route::get('/learning_logs/{id}', [LearningLogController::class, 'SpecificLearningLog']);
Route::put('/learning_logs/{id}', [LearningLogController::class, 'UpdateLearningLog']);

