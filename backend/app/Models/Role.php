<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionFactory> */
    use HasFactory;

    public $timestamps = false;
    
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'all_permissions'
    ];
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'all_permissions' => 'boolean',
        ];
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission', 'role_id', 'permission_id');
    }

    public function admins(): HasMany
    {
        return $this->hasMany(Admin::class, 'role_id');
    }
}
