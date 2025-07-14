<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
class VerifyCsrfToken extends \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken
{
    public function handle($request, \Closure $next)
    {
        \Log::info('CSRF判定パス', ['path' => $request->path()]);
        return parent::handle($request, $next);
    }
    /**
     * CSRFチェックを除外するURIリスト
     */
    protected $except = [
        '/register',
        '/login',
        '/user',
    ];
    
}
