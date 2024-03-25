<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Promo extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'restaurant_id',
        'category',
        'menu',
        'datefrom',
        'dateto',
        'voucher_code',
        'voucher_name',
        'discount_type',
        'discount_amount',
        'limit',
        'created_by',
        'updated_by'
    ];
}
