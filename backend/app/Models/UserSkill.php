<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSkill extends Model
{
    protected $fillable = ['user_id', 'skill_id', 'level'];
    public $timestamps = false;

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
