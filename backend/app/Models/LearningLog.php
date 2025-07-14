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
        'model_answer',     // ✅ 追加された模範解答
        'explanation',      // ✅ 追加された解説
    ];
}
