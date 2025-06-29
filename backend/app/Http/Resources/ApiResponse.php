<?php

namespace App\Http\Responses;

trait ApiResponse
{
    protected function success(mixed $data, string $message = 'OK', array $meta = [], int $code = 200)
    {
        return response()->json([
            'status'  => 'success',
            'data'    => $data,
            'message' => $message,
            'meta'    => $meta,
        ], $code);
    }

    protected function created(mixed $data, string $message = 'Created')
    {
        return $this->success($data, $message, [], 201);
    }

    protected function fail(array $errors, int $code = 422)
    {
        return response()->json([
            'status' => 'fail',
            'errors' => $errors,
        ], $code);
    }
}
