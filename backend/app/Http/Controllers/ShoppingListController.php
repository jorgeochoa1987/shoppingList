<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ShoppingList;
use App\Http\Resources\ShoppingListResource;

class ShoppingListController extends Controller
{
    // Get all lists (no auth)
    public function index()
    {
        return ShoppingListResource::collection(ShoppingList::all());
    }

    // Create a new list (no user association)
    public function store(Request $request)
    {   
        $validated = $request->validate(['name' => 'required|string','user_id'=>'required|integer']);
        
        try {
            $list = ShoppingList::create($validated);
            return new ShoppingListResource($list);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create list', 'message' => $e->getMessage()], 500);
        }
    }

    // Get single list
    public function show(ShoppingList $shoppingList)
    {
        return new ShoppingListResource($shoppingList);
    }

    // Update list
    public function update(Request $request, ShoppingList $shoppingList)
    {
        $shoppingList->update($request->validate(['name' => 'string']));
        return new ShoppingListResource($shoppingList);
    }

    // Delete list
    public function destroy(ShoppingList $shoppingList)
    {
        $shoppingList->delete();
        return response()->noContent();
    }
}

