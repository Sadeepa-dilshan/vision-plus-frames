<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Power;

class PowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $powerTypes = [
            ['name' => 'sph'], // Spherical power
            ['name' => 'cyl'], // Cylindrical power
        ];

        foreach ($powerTypes as $type) {
            Power::updateOrCreate(['name' => $type['name']], $type);
        }
    }
}
