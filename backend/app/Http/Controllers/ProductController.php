<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the products for public access.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 12);
        $page = $request->get('page', 1);

        // Parameters for search and filters
        $search = $request->get('search');
        $brand = $request->get('brand');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $minPrice = $request->get('min_price');
        $maxPrice = $request->get('max_price');

        // Validation of parameters
        $perPage = min(max((int)$perPage, 1), 48);
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';
        $allowedSortFields = ['name', 'price', 'brand', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'created_at';

        // Construction of the query - include all products (even out of stock)
        $query = Product::query();

        // Search by name, brand, reference, or description
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('brand', 'LIKE', "%{$search}%")
                  ->orWhere('reference', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Filter by brand
        if ($brand) {
            $query->where('brand', 'LIKE', "%{$brand}%");
        }

        // Filter by price range
        if ($minPrice !== null && is_numeric($minPrice)) {
            $query->where('price', '>=', (float)$minPrice);
        }
        if ($maxPrice !== null && is_numeric($maxPrice)) {
            $query->where('price', '<=', (float)$maxPrice);
        }

        // Sorting
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $products = $query->paginate($perPage, ['*'], 'page', $page);

        // Get unique brands for filters (all brands)
        $brands = Product::select('brand')
            ->distinct()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->orderBy('brand')
            ->pluck('brand');

        // Add full image URL to each product
        $productsWithImages = $products->getCollection()->map(function ($product) {
            if ($product->image) {
                $product->image_url = asset('storage/' . $product->image);
            } else {
                $product->image_url = null;
            }
            return $product;
        });

        $products->setCollection($productsWithImages);

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
                    'max_price' => $maxPrice
                ]
            ]
        ]);
    }

    /**
     * Display the specified product for public access.
     */
    public function show(Product $product): JsonResponse
    {
        if ($product->image) {
            $product->image_url = asset('storage/' . $product->image);
        } else {
            $product->image_url = null;
        }

        return response()->json([
            'message' => 'Product retrieved successfully',
            'product' => $product
        ]);
    }

    /**
     * Get related products (same brand or similar price range).
     */
    public function related(Product $product): JsonResponse
    {
        $relatedProducts = Product::where('id', '!=', $product->id)
            ->where('quantity', '>', 0)
            ->where(function($query) use ($product) {
                $query->where('brand', $product->brand)
                      ->orWhereBetween('price', [
                          $product->price * 0.8,
                          $product->price * 1.2
                      ]);
            })
            ->limit(4)
            ->get()
            ->map(function ($relatedProduct) {
                if ($relatedProduct->image) {
                    $relatedProduct->image_url = asset('storage/' . $relatedProduct->image);
                } else {
                    $relatedProduct->image_url = null;
                }
                return $relatedProduct;
            });

        return response()->json([
            'message' => 'Related products retrieved successfully',
            'products' => $relatedProducts
        ]);
    }
}
