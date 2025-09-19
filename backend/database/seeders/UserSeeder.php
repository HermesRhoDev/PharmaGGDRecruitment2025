<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users
        User::create([
            'name' => 'John Doe',
            'email' => 'user@pharma-gdd.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@pharma-gdd.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create test admins
        $superAdminRole = Role::where('code', 'super_admin')->first();
        $adminCatalog = Role::where('code', 'catalog')->first();

        Admin::create([
            'name' => 'Admin Admin',
            'email' => 'admin@pharma-gdd.com',
            'password' => Hash::make(env('ADMIN_PASSWORD')),
            'role_id' => $superAdminRole->id,
        ]);

        Admin::create([
            'name' => 'Admin Catalogue',
            'email' => 'catalog@pharma-gdd.com',
            'password' => Hash::make(env('CATALOG_PASSWORD')),
            'role_id' => $adminCatalog->id,
        ]);
    }
}
