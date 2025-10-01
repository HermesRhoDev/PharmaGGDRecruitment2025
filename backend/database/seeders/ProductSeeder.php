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
            // Antalgiques et Anti-inflammatoires
            [
                'name' => 'Paracétamol 500mg',
                'price' => 3.50,
                'reference' => '1001',
                'brand' => 'Doliprane',
                'quantity' => 150,
                'image' => null,
            ],
            [
                'name' => 'Ibuprofène 400mg',
                'price' => 4.20,
                'reference' => '1002',
                'brand' => 'Advil',
                'quantity' => 80,
                'image' => null,
            ],
            [
                'name' => 'Aspirine 500mg',
                'price' => 2.90,
                'reference' => '1003',
                'brand' => 'Aspégic',
                'quantity' => 200,
                'image' => null,
            ],
            [
                'name' => 'Paracétamol 1000mg',
                'price' => 4.80,
                'reference' => '1011',
                'brand' => 'Efferalgan',
                'quantity' => 120,
                'image' => null,
            ],
            [
                'name' => 'Ibuprofène 200mg',
                'price' => 3.90,
                'reference' => '1012',
                'brand' => 'Nurofen',
                'quantity' => 95,
                'image' => null,
            ],
            [
                'name' => 'Diclofénac 50mg',
                'price' => 6.75,
                'reference' => '1013',
                'brand' => 'Voltarène',
                'quantity' => 65,
                'image' => null,
            ],
            [
                'name' => 'Naproxène 220mg',
                'price' => 5.40,
                'reference' => '1014',
                'brand' => 'Apranax',
                'quantity' => 70,
                'image' => null,
            ],

            // Antibiotiques
            [
                'name' => 'Amoxicilline 1g',
                'price' => 8.75,
                'reference' => '1004',
                'brand' => 'Clamoxyl',
                'quantity' => 45,
                'image' => null,
            ],
            [
                'name' => 'Amoxicilline 500mg',
                'price' => 6.50,
                'reference' => '1015',
                'brand' => 'Augmentin',
                'quantity' => 55,
                'image' => null,
            ],
            [
                'name' => 'Azithromycine 250mg',
                'price' => 12.30,
                'reference' => '1016',
                'brand' => 'Zithromax',
                'quantity' => 35,
                'image' => null,
            ],
            [
                'name' => 'Clarithromycine 500mg',
                'price' => 15.80,
                'reference' => '1017',
                'brand' => 'Zeclar',
                'quantity' => 40,
                'image' => null,
            ],
            [
                'name' => 'Ciprofloxacine 500mg',
                'price' => 18.90,
                'reference' => '1018',
                'brand' => 'Ciflox',
                'quantity' => 30,
                'image' => null,
            ],

            // Gastro-entérologie
            [
                'name' => 'Oméprazole 20mg',
                'price' => 6.30,
                'reference' => '1005',
                'brand' => 'Mopral',
                'quantity' => 120,
                'image' => null,
            ],
            [
                'name' => 'Lansoprazole 30mg',
                'price' => 8.45,
                'reference' => '1019',
                'brand' => 'Lanzor',
                'quantity' => 85,
                'image' => null,
            ],
            [
                'name' => 'Pantoprazole 40mg',
                'price' => 7.20,
                'reference' => '1020',
                'brand' => 'Inipomp',
                'quantity' => 90,
                'image' => null,
            ],
            [
                'name' => 'Ranitidine 150mg',
                'price' => 5.60,
                'reference' => '1021',
                'brand' => 'Azantac',
                'quantity' => 75,
                'image' => null,
            ],
            [
                'name' => 'Dompéridone 10mg',
                'price' => 4.30,
                'reference' => '1022',
                'brand' => 'Motilium',
                'quantity' => 100,
                'image' => null,
            ],

            // Antihistaminiques
            [
                'name' => 'Cetirizine 10mg',
                'price' => 5.15,
                'reference' => '1006',
                'brand' => 'Zyrtec',
                'quantity' => 90,
                'image' => null,
            ],
            [
                'name' => 'Loratadine 10mg',
                'price' => 4.80,
                'reference' => '1007',
                'brand' => 'Clarityne',
                'quantity' => 75,
                'image' => null,
            ],
            [
                'name' => 'Desloratadine 5mg',
                'price' => 6.90,
                'reference' => '1023',
                'brand' => 'Aerius',
                'quantity' => 65,
                'image' => null,
            ],
            [
                'name' => 'Fexofénadine 120mg',
                'price' => 8.25,
                'reference' => '1024',
                'brand' => 'Telfast',
                'quantity' => 55,
                'image' => null,
            ],

            // Cardiovasculaire
            [
                'name' => 'Simvastatine 20mg',
                'price' => 12.40,
                'reference' => '1008',
                'brand' => 'Zocor',
                'quantity' => 60,
                'image' => null,
            ],
            [
                'name' => 'Atorvastatine 20mg',
                'price' => 15.60,
                'reference' => '1025',
                'brand' => 'Tahor',
                'quantity' => 50,
                'image' => null,
            ],
            [
                'name' => 'Amlodipine 5mg',
                'price' => 9.80,
                'reference' => '1026',
                'brand' => 'Amlor',
                'quantity' => 70,
                'image' => null,
            ],
            [
                'name' => 'Lisinopril 10mg',
                'price' => 11.30,
                'reference' => '1027',
                'brand' => 'Prinivil',
                'quantity' => 65,
                'image' => null,
            ],
            [
                'name' => 'Bisoprolol 5mg',
                'price' => 8.90,
                'reference' => '1028',
                'brand' => 'Cardensiel',
                'quantity' => 80,
                'image' => null,
            ],

            // Diabète
            [
                'name' => 'Metformine 850mg',
                'price' => 7.90,
                'reference' => '1009',
                'brand' => 'Glucophage',
                'quantity' => 110,
                'image' => null,
            ],
            [
                'name' => 'Metformine 500mg',
                'price' => 6.40,
                'reference' => '1029',
                'brand' => 'Stagid',
                'quantity' => 95,
                'image' => null,
            ],
            [
                'name' => 'Gliclazide 80mg',
                'price' => 9.70,
                'reference' => '1030',
                'brand' => 'Diamicron',
                'quantity' => 75,
                'image' => null,
            ],

            // Thyroïde
            [
                'name' => 'Levothyroxine 75µg',
                'price' => 9.25,
                'reference' => '1010',
                'brand' => 'Levothyrox',
                'quantity' => 85,
                'image' => null,
            ],
            [
                'name' => 'Levothyroxine 50µg',
                'price' => 8.50,
                'reference' => '1031',
                'brand' => 'L-Thyroxine',
                'quantity' => 90,
                'image' => null,
            ],
            [
                'name' => 'Levothyroxine 100µg',
                'price' => 10.20,
                'reference' => '1032',
                'brand' => 'Euthyrox',
                'quantity' => 70,
                'image' => null,
            ],

            // Vitamines et Compléments
            [
                'name' => 'Vitamine D3 1000UI',
                'price' => 12.80,
                'reference' => '1033',
                'brand' => 'Uvedose',
                'quantity' => 120,
                'image' => null,
            ],
            [
                'name' => 'Vitamine B12 1000µg',
                'price' => 15.40,
                'reference' => '1034',
                'brand' => 'Gerda',
                'quantity' => 85,
                'image' => null,
            ],
            [
                'name' => 'Acide Folique 5mg',
                'price' => 6.90,
                'reference' => '1035',
                'brand' => 'Speciafoldine',
                'quantity' => 100,
                'image' => null,
            ],
            [
                'name' => 'Fer 80mg',
                'price' => 8.30,
                'reference' => '1036',
                'brand' => 'Tardyferon',
                'quantity' => 95,
                'image' => null,
            ],
            [
                'name' => 'Magnésium 300mg',
                'price' => 11.60,
                'reference' => '1037',
                'brand' => 'Mag 2',
                'quantity' => 110,
                'image' => null,
            ],

            // Dermatologie
            [
                'name' => 'Crème Hydrocortisone 1%',
                'price' => 7.50,
                'reference' => '1038',
                'brand' => 'Cortapaisyl',
                'quantity' => 60,
                'image' => null,
            ],
            [
                'name' => 'Gel Adapalène 0.1%',
                'price' => 18.90,
                'reference' => '1039',
                'brand' => 'Differine',
                'quantity' => 35,
                'image' => null,
            ],
            [
                'name' => 'Crème Clotrimazole 1%',
                'price' => 9.40,
                'reference' => '1040',
                'brand' => 'Pevaryl',
                'quantity' => 45,
                'image' => null,
            ],

            // Respiratoire
            [
                'name' => 'Salbutamol 100µg',
                'price' => 14.20,
                'reference' => '1041',
                'brand' => 'Ventoline',
                'quantity' => 50,
                'image' => null,
            ],
            [
                'name' => 'Budesonide 200µg',
                'price' => 22.80,
                'reference' => '1042',
                'brand' => 'Pulmicort',
                'quantity' => 40,
                'image' => null,
            ],
            [
                'name' => 'Montelukast 10mg',
                'price' => 16.70,
                'reference' => '1043',
                'brand' => 'Singulair',
                'quantity' => 55,
                'image' => null,
            ],

            // Neurologie/Psychiatrie
            [
                'name' => 'Sertraline 50mg',
                'price' => 13.90,
                'reference' => '1044',
                'brand' => 'Zoloft',
                'quantity' => 45,
                'image' => null,
            ],
            [
                'name' => 'Escitalopram 10mg',
                'price' => 15.30,
                'reference' => '1045',
                'brand' => 'Seroplex',
                'quantity' => 40,
                'image' => null,
            ],
            [
                'name' => 'Alprazolam 0.25mg',
                'price' => 8.60,
                'reference' => '1046',
                'brand' => 'Xanax',
                'quantity' => 30,
                'image' => null,
            ],
            [
                'name' => 'Zolpidem 10mg',
                'price' => 11.40,
                'reference' => '1047',
                'brand' => 'Stilnox',
                'quantity' => 35,
                'image' => null,
            ],

            // Ophtalmologie
            [
                'name' => 'Collyre Timolol 0.5%',
                'price' => 12.50,
                'reference' => '1048',
                'brand' => 'Timoptol',
                'quantity' => 25,
                'image' => null,
            ],
            [
                'name' => 'Collyre Latanoprost 0.005%',
                'price' => 28.90,
                'reference' => '1049',
                'brand' => 'Xalatan',
                'quantity' => 20,
                'image' => null,
            ],

            // Gynécologie
            [
                'name' => 'Pilule Ethinylestradiol/Levonorgestrel',
                'price' => 9.80,
                'reference' => '1050',
                'brand' => 'Minidril',
                'quantity' => 80,
                'image' => null,
            ],
            [
                'name' => 'Ovule Econazole 150mg',
                'price' => 7.20,
                'reference' => '1051',
                'brand' => 'Gyno-Pevaryl',
                'quantity' => 60,
                'image' => null,
            ],

            // Urologie
            [
                'name' => 'Tamsulosine 0.4mg',
                'price' => 14.60,
                'reference' => '1052',
                'brand' => 'Josir',
                'quantity' => 50,
                'image' => null,
            ],
            [
                'name' => 'Finastéride 5mg',
                'price' => 18.30,
                'reference' => '1053',
                'brand' => 'Chibro-Proscar',
                'quantity' => 40,
                'image' => null,
            ],

            // Pédiatrie
            [
                'name' => 'Paracétamol Sirop 120mg/5ml',
                'price' => 4.90,
                'reference' => '1054',
                'brand' => 'Doliprane',
                'quantity' => 150,
                'image' => null,
            ],
            [
                'name' => 'Ibuprofène Sirop 100mg/5ml',
                'price' => 5.60,
                'reference' => '1055',
                'brand' => 'Advil',
                'quantity' => 120,
                'image' => null,
            ],

            // Homéopathie
            [
                'name' => 'Oscillococcinum 200K',
                'price' => 8.90,
                'reference' => '1056',
                'brand' => 'Boiron',
                'quantity' => 200,
                'image' => null,
            ],
            [
                'name' => 'Arnica Montana 9CH',
                'price' => 3.20,
                'reference' => '1057',
                'brand' => 'Boiron',
                'quantity' => 180,
                'image' => null,
            ],

            // Produits de parapharmacie
            [
                'name' => 'Sérum Physiologique 30x5ml',
                'price' => 2.80,
                'reference' => '1058',
                'brand' => 'Gilbert',
                'quantity' => 300,
                'image' => null,
            ],
            [
                'name' => 'Thermomètre Digital',
                'price' => 12.90,
                'reference' => '1059',
                'brand' => 'Omron',
                'quantity' => 25,
                'image' => null,
            ],
            [
                'name' => 'Masques Chirurgicaux x50',
                'price' => 8.50,
                'reference' => '1060',
                'brand' => 'Medistock',
                'quantity' => 100,
                'image' => null,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        $this->command->info(count($products) . ' produits pharmaceutiques créés avec succès !');
    }
}
