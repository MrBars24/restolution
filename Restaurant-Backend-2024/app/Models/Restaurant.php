<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Restaurant extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'reference_number',
        'name',
        'table_number',
        'house_number',
        'barangay',
        'municipality',
        'province',
        'longitude',
        'latitude',
        'logo',
        'corporate_account',
        'created_by',
        'updated_by'
    ];
}
