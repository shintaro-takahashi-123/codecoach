<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Goal;



/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Goal>
 */
class GoalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
       return [
        'user_id'        => User::factory(),                 // ユーザーも同時生成
        'job_title'      => $this->faker->jobTitle(),
        'target_salary'  => $this->faker->numberBetween(400, 900),
        'target_company' => $this->faker->company(),
    ];
    }
}
