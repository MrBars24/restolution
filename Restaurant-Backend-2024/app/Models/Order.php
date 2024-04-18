<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Order extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'restaurant_id',
        'menu',
        'table_number',
        'dine_in_out',
        'payment_method',
        'status',
        'total_amount',
        'discount_amount',
        'special_discount_amount',
        'vatable',
        'vat',
        'cooked_by',
        'customer_name',
        'discount_id',
        'special_discount_id',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
