<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * 未認証時のレスポンス処理
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson()) {
            abort(response()->json([
                'status' => 'fail',
                'message' => 'Unauthenticated.',
            ], 401));
        }

        // ここはSPA用途では使わないので削除してOK
        // parent::unauthenticated($request, $guards);
    }
}
