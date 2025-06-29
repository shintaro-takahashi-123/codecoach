<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Goal;

class GoalSeeder extends Seeder
{
    public function run(): void
    {
        Goal::factory()->count(10)->create();
    }
}
