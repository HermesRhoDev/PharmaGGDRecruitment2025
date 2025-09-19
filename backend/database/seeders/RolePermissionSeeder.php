<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            ['code' => 'users.read', 'name' => 'Read Users'],
            ['code' => 'users.create', 'name' => 'Create Users'],
            ['code' => 'users.update', 'name' => 'Update Users'],
            ['code' => 'users.delete', 'name' => 'Delete Users'],
            ['code' => 'admins.read', 'name' => 'Read Admins'],
            ['code' => 'admins.create', 'name' => 'Create Admins'],
            ['code' => 'admins.update', 'name' => 'Update Admins'],
            ['code' => 'admins.delete', 'name' => 'Delete Admins'],
            ['code' => 'roles.read', 'name' => 'Read Roles'],
            ['code' => 'roles.create', 'name' => 'Create Roles'],
            ['code' => 'roles.update', 'name' => 'Update Roles'],
            ['code' => 'roles.delete', 'name' => 'Delete Roles'],
            ['code' => 'permissions.read', 'name' => 'Read Permissions'],
            ['code' => 'permissions.create', 'name' => 'Create Permissions'],
            ['code' => 'permissions.update', 'name' => 'Update Permissions'],
            ['code' => 'permissions.delete', 'name' => 'Delete Permissions'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Create roles
        $superAdminRole = Role::create([
            'code' => 'super_admin',
            'name' => 'Administrateur',
            'all_permissions' => true
        ]);

        $catalogRole = Role::create([
            'code' => 'catalog',
            'name' => 'Catalogue',
            'all_permissions' => false
        ]);

        // Assign specific permissions to admin role
        $adminPermissions = Permission::whereIn('code', [
            'users.read', 'users.create', 'users.update',
            'admins.read', 'roles.read', 'permissions.read'
        ])->get();

        foreach ($adminPermissions as $permission) {
            DB::table('role_permission')->insert([
                'role_id' => $superAdminRole->id,
                'permission_id' => $permission->id
            ]);
        }

        // Assign specific permissions to moderator role
        $catalogPermissions = Permission::whereIn('code', [
            'users.read',
        ])->get();

        foreach ($catalogPermissions as $permission) {
            DB::table('role_permission')->insert([
                'role_id' => $catalogRole->id,
                'permission_id' => $permission->id
            ]);
        }
    }
}
