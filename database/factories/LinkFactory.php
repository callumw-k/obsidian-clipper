<?php

namespace Database\Factories;

use App\Models\Link;
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
        return [
            'title' => $this->faker->optional()->sentence(), // Optional title
            'original_url' => $this->faker->url(),          // Random URL
            'path' => $this->faker->unique()->slug(),       // Unique slug
        ];
    }
}

