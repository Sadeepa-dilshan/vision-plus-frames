<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LensType;

class LensTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $lensTypes = [
            ['name' => 'Single Vision', 'description' => 'Corrects vision for one field of view.'],
            ['name' => 'Bifocal', 'description' => 'Corrects vision for two fields of view, typically distance and reading.'],
            ['name' => 'Varifocal', 'description' => 'Corrects vision at multiple distances without visible lines.']
        ];

        foreach ($lensTypes as $type) {
            LensType::updateOrCreate(['name' => $type['name']], $type);
        }
    }
}
