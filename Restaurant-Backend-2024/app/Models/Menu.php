<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Menu extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'restaurant_id',
        'name',
        'ingredients',
        'price',
        'preparation_time',
        'status',
        'menutab_id',
        'category',
        'image',
        'created_by',
        'updated_by',
        
    ];
}
