<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Paracétamol 500mg',
                'price' => 3.50,
                'reference' => 1001,
                'brand' => 'Doliprane',
                'quantity' => 150,
                'image' => null,
            ],
            [
                'name' => 'Ibuprofène 400mg',
                'price' => 4.20,
                'reference' => 1002,
                'brand' => 'Advil',
                'quantity' => 80,
                'image' => null,
            ],
            [
                'name' => 'Aspirine 500mg',
                'price' => 2.90,
                'reference' => 1003,
                'brand' => 'Aspégic',
                'quantity' => 200,
                'image' => null,
            ],
            [
                'name' => 'Amoxicilline 1g',
                'price' => 8.75,
                'reference' => 1004,
                'brand' => 'Clamoxyl',
                'quantity' => 45,
                'image' => null,
            ],
            [
                'name' => 'Oméprazole 20mg',
                'price' => 6.30,
                'reference' => 1005,
                'brand' => 'Mopral',
                'quantity' => 120,
                'image' => null,
            ],
            [
                'name' => 'Cetirizine 10mg',
                'price' => 5.15,
                'reference' => 1006,
                'brand' => 'Zyrtec',
                'quantity' => 90,
                'image' => null,
            ],
            [
                'name' => 'Loratadine 10mg',
                'price' => 4.80,
                'reference' => 1007,
                'brand' => 'Clarityne',
                'quantity' => 75,
                'image' => null,
            ],
            [
                'name' => 'Simvastatine 20mg',
                'price' => 12.40,
                'reference' => 1008,
                'brand' => 'Zocor',
                'quantity' => 60,
                'image' => null,
            ],
            [
                'name' => 'Metformine 850mg',
                'price' => 7.90,
                'reference' => 1009,
                'brand' => 'Glucophage',
                'quantity' => 110,
                'image' => null,
            ],
            [
                'name' => 'Levothyroxine 75µg',
                'price' => 9.25,
                'reference' => 1010,
                'brand' => 'Levothyrox',
                'quantity' => 85,
                'image' => null,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        $this->command->info('10 produits pharmaceutiques créés avec succès !');
    }
}
