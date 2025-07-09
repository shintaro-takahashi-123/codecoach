<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningLog extends Model
{
    protected $fillable = [
        'user_id',
        'problem_title',
        'problem_desc',
        'status',
    ];
}
