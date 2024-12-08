<?php

namespace Database\Factories;

use App\Models\Link;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Link>
 */
class LinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::firstOrCreate(['email' => 'cwellkane@gmail.com'], [
            'name' => $this->faker->name(),
            'password' => User::createPasswordHash('password'),
        ]);

        return [
            'title' => $this->faker->optional()->sentence(),
            'original_url' => $this->faker->url(),
            'path' => $this->faker->unique()->slug(),
            'user_id' => $user->id,
            'created_at' => $this->faker->date(),
        ];
    }
}

