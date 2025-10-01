<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10); // Par défaut 10 produits par page
        $page = $request->get('page', 1);

        // Validation des paramètres
        $perPage = min(max((int)$perPage, 1), 100); // Entre 1 et 100

        $products = Product::orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'message' => 'Products retrieved successfully',
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'has_more_pages' => $products->hasMorePages(),
                'next_page_url' => $products->nextPageUrl(),
                'prev_page_url' => $products->previousPageUrl()
            ]
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        // Gérer l'upload d'image si présente
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validatedData['image'] = $imagePath;
        }

        $product = Product::create($validatedData);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'message' => 'Product retrieved successfully',
            'product' => $product
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validatedData = $request->validated();

        // Gérer l'upload d'image si présente
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($product->image && \Storage::disk('public')->exists($product->image)) {
                \Storage::disk('public')->delete($product->image);
            }

            // Stocker la nouvelle image
            $imagePath = $request->file('image')->store('products', 'public');
            $validatedData['image'] = $imagePath;
        }

        $product->update($validatedData);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->fresh()
        ]);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get the product image URL.
     */
    public function getImageUrl(Product $product): JsonResponse
    {
        $imageUrl = null;

        if ($product->image) {
            $imageUrl = asset('storage/' . $product->image);
        }

        return response()->json([
            'image_url' => $imageUrl
        ]);
    }
}
