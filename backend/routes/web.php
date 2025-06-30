<?php

use Illuminate\Support\Facades\Route;

// routes/api.php
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});
