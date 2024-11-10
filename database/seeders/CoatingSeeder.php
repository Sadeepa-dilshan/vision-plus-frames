<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coating;

class CoatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $coatings = [
            ['name' => 'Multicoated', 'description' => 'Provides a layer that reduces glare and improves durability.'],
            ['name' => 'Bluecut', 'description' => 'Blocks harmful blue light from screens and artificial lighting.'],
            ['name' => 'Bluecut Photocromic', 'description' => 'Combines blue light blocking with light-adaptive properties.'],
        ];

        foreach ($coatings as $coating) {
            Coating::updateOrCreate(['name' => $coating['name']], $coating);
        }
    }
}
