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
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $search = $request->get('search');
        $brand = $request->get('brand');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $minPrice = $request->get('min_price');
        $maxPrice = $request->get('max_price');
        $minQuantity = $request->get('min_quantity');
        $maxQuantity = $request->get('max_quantity');
        $perPage = min(max((int)$perPage, 1), 100); // Entre 1 et 100
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $allowedSortFields = ['name', 'price', 'reference', 'brand', 'quantity', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'created_at';
        $query = Product::query();

        // Recherche textuelle (nom, marque, référence)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('brand', 'LIKE', "%{$search}%")
                  ->orWhere('reference', 'LIKE', "%{$search}%");
            });
        }

        // Filtrage par marque
        if ($brand) {
            $query->where('brand', 'LIKE', "%{$brand}%");
        }

        // Filtrage par prix
        if ($minPrice !== null && is_numeric($minPrice)) {
            $query->where('price', '>=', (float)$minPrice);
        }
        if ($maxPrice !== null && is_numeric($maxPrice)) {
            $query->where('price', '<=', (float)$maxPrice);
        }

        // Filtrage par quantité
        if ($minQuantity !== null && is_numeric($minQuantity)) {
            $query->where('quantity', '>=', (int)$minQuantity);
        }
        if ($maxQuantity !== null && is_numeric($maxQuantity)) {
            $query->where('quantity', '<=', (int)$maxQuantity);
        }

        // Tri
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $products = $query->paginate($perPage, ['*'], 'page', $page);

        // Récupérer les marques uniques pour les filtres
        $brands = Product::select('brand')
            ->distinct()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->orderBy('brand')
            ->pluck('brand');

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
            ],
            'filters' => [
                'brands' => $brands,
                'applied_filters' => [
                    'search' => $search,
                    'brand' => $brand,
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'min_price' => $minPrice,
                    'max_price' => $maxPrice,
                    'min_quantity' => $minQuantity,
                    'max_quantity' => $maxQuantity
                ]
            ]
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

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

        if ($request->hasFile('image')) {
            if ($product->image && \Storage::disk('public')->exists($product->image)) {
                \Storage::disk('public')->delete($product->image);
            }

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
