<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Reservation extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'restaurant_id',
        'table_number',
        'date',
        'time',
        'number_of_guest',
        'guest_name',
        'notes',
        'created_by',
        'updated_by'
    ];
}
