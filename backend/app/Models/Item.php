<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model {
    protected $fillable = ['name', 'completed', 'shopping_list_id'];

    public function shoppingList() {
        return $this->belongsTo(ShoppingList::class);
    }
}
