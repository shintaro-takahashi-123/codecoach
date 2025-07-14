<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);

            Auth::login($user);
            $request->session()->regenerate();

            session(['user_id' => $user->id]); // 🔧 統一
            session()->put('auth_user_id', $user->user_id); // 🔧 統一
            session()->save();

            Log::info('Auth::login完了', [
                'user_id' => $user->user_id,
                'guarded' => Auth::guard()->check(),
                'session' => session()->all(),
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Registration completed',
                'data'    => [
                    'user_id' => $user->getAuthIdentifier(),
                    'name'    => $user->name,
                    'email'   => $user->email,
                ],
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Register error', ['error' => $e->getMessage()]);
            return response()->json([
                'status'  => 'error',
                'message' => '登録中にエラーが発生しました',
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            if (!Auth::attempt($request->only('email', 'password'), true)) {
                Log::warning('ログイン失敗', ['email' => $request->email]);
                return response()->json([
                    'status'  => 'fail',
                    'message' => 'Invalid credentials',
                ], 401);
            }

            $request->session()->regenerate();

            $user = Auth::user();

            Log::info('ログイン成功', [
                'user_id' => $user->user_id,
                'session' => session()->all(),
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Login successful',
                'data'    => [
                    'user_id' => $user->user_id,
                    'name'    => $user->name,
                    'email'   => $user->email,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Login error', ['error' => $e->getMessage()]);
            return response()->json([
                'status'  => 'error',
                'message' => 'ログイン処理でエラーが発生しました',
            ], 500);
        }
    }

    public function user(Request $request)
    {
        $user = Auth::user();

        Log::info('ユーザー取得', [
            'user_id' => $user?->user_id,
            'cookie'  => $request->cookie('laravel_session'),
            'session' => session()->all(),
        ]);

        if (!$user) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'Not authenticated',
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'data'   => [
                'user_id' => $user->user_id,
                'name'    => $user->name,
                'email'   => $user->email,
            ],
        ]);
    }
}
