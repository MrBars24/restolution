<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class OrderTracker extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'order_id',
        'time_created',
        'time_process',
        'time_served',
        'time_completed'
    ];
}
