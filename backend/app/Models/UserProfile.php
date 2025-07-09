<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'annual_income',
        'job_type',
        'skills',
        'gpt_result',
    ];

    protected $casts = [
        'skills' => 'array',
        'gpt_result' => 'array',
    ];
}
