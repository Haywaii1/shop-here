<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'parent_id'
    ];

    // parent category
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // children categories
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // recursive children
    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }

    // products in category
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
