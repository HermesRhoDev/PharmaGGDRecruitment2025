<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'price',
        'reference',
        'brand',
        'quantity',
        'image'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'reference' => 'integer',
    ];
}
