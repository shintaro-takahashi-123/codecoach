<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * 新規登録
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Sanctumトークンを生成
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Registration completed',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ]
        ], 201);
    }

    /**
     * ログイン
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        // ユーザーが存在しない、またはパスワードが一致しない場合
        if (!$user || !Hash::check($request->password, $user->password)) {
            \Log::warning('ログイン失敗', ['email' => $request->email]);

            return response()->json([
                'status'  => 'fail',
                'message' => 'Invalid credentials',
            ], 401);
        }
        
        // 既存のトークンを削除して、新しいトークンを生成
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login successful',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ]
        ]);
    }

    /**
     * ログイン中のユーザー情報取得
     */
    public function user(Request $request)
    {
        $user = $request->user(); // Sanctum に対応

        if (!$user) {
            return response()->json([
                'status'  => 'fail',
                'message' => 'Not authenticated',
            ], 401);
        }

        return response()->json([
            'status'  => 'success',
            'data'    => $user,
        ]);
    }
    
    /**
     * ログアウト
     */
    public function logout(Request $request)
    {
        // 現在のリクエストで使われているトークンを削除
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ], 200);
    }
}