<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{ShoppingList, Item};
use App\Http\Resources\ItemResource;


class ItemController extends Controller
{
    // Add item to list
    public function store(Request $request, ShoppingList $shoppingList)
    {
        $validated = $request->validate(['name' => 'required|string']);
        $item = $shoppingList->items()->create($validated);
        return new ItemResource($item);
    }

    // Update item
    public function update(Request $request, ShoppingList $shoppingList, Item $item)
    {
        $item->update($request->validate([
            'name' => 'string',
            'completed' => 'boolean'
        ]));
        return new ItemResource($item);
    }

    // Delete item
    public function destroy(ShoppingList $shoppingList, Item $item)
    {
        $item->delete();
        return response()->noContent();
    }
}
