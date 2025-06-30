<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LearningLogController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\UserSkillController;

// Route::middleware('auth:sanctum')->group(function () {

// });


Route::post('/learning_logs', [LearningLogController::class, 'store']);
Route::get('/learning_logs', [LearningLogController::class, 'index']);
Route::get('/learning_logs/{id}', [LearningLogController::class, 'show']);
Route::put('/learning_logs/{id}', [LearningLogController::class, 'update']);

Route::get('/skills', [SkillController::class, 'index']);
Route::post('/user_skills', [UserSkillController::class, 'store']);
Route::put('/user_skills/{id}', [UserSkillController::class, 'update']);