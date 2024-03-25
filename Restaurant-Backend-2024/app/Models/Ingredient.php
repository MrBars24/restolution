<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Ingredient extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'restaurant_id',
        'name',
        'unit',
        'quantity',
        'unit_cost',
        'created_by',
        'updated_by',
    ];
} 
