<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'price',
        'description',
        'image1',
        'image2',
        'image3',
        'is_deal',
        'deal_percentage',
        'deal_starts_at',
        'deal_ends_at',
    ];

    protected $casts = [
        'is_deal' => 'boolean',
        'deal_starts_at' => 'datetime',
        'deal_ends_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function hasActiveDeal(): bool
    {
        if (!$this->is_deal || !$this->deal_percentage) {
            return false;
        }

        if ($this->deal_starts_at && $this->deal_starts_at->isFuture()) {
            return false;
        }

        if ($this->deal_ends_at && $this->deal_ends_at->isPast()) {
            return false;
        }

        return true;
    }
}
