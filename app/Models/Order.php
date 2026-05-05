<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{

    use SoftDeletes;

    protected $dates = ['deleted_at']; 

    protected $fillable = [
        'user_id',
        'order_number',
        'total',
        'status',
        'payment_method',
        'payment_reference',
        'paid_at',
        'tracking_number',
        'preparing_at',
        'shipped_at',
        'delivered_at'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
