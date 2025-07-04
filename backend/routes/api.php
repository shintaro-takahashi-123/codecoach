<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LearningLogController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/learning_logs', [LearningLogController::class, 'store']);
    Route::get('/learning_logs', [LearningLogController::class, 'index']);
    Route::get('/learning_logs/{id}', [LearningLogController::class, 'show']);
    Route::put('/learning_logs/{id}', [LearningLogController::class, 'update']);

});

