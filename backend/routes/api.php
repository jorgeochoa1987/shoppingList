<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{ShoppingListController, ItemController};


Route::middleware('auth:sanctum')->group(function () {
    // Shopping Lists
    Route::apiResource('shopping-lists', ShoppingListController::class);

    // Items (nested under shopping lists)
    Route::prefix('shopping-lists/{shoppingList}')->group(function () {
        Route::apiResource('items', ItemController::class)->except(['index', 'show']);
    });
});
