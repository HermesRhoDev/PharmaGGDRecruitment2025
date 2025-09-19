<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function(Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->boolean('all_permissions')->default(false);
        });

        Schema::create('permissions', function(Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
        });

        Schema::create('role_permission', function(Blueprint $table) {
            $table->foreignId( 'role_id')->references('id')->on('roles')->onDelete('CASCADE');
            $table->foreignId('permission_id')->references('id')->on('permissions')->onDelete('CASCADE');
        });

        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->foreignId('role_id')->references('id')->on('roles')->onDelete('RESTRICT');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
