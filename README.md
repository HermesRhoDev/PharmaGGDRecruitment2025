# Détail du travail rendu

Après avoir **forké** le projet et cloné sur ma machine, j'ai commencé par la mise en place des fichiers `.env` côté **FRONT** et **BACK**.

---

# Table des matières

- [Détail du travail rendu](#détail-du-travail-rendu)
  - [ENV Front](#env-front)
  - [ENV Back](#env-back)
  - [Setup Back-end](#setup-back-end)
  - [Setup Front-end](#setup-front-end)
  - [Mise en place du modèle Product](#mise-en-place-du-modèle-product)
    - [Table Products avec exemples](#table-products-avec-exemples)
    - [Le model Product](#le-model-product)
  - [Product Controller (Admin)](#product-controller-admin)
    - [Exemple : méthode index()](#exemple--méthode-index)
    - [Exemple : méthode store()](#exemple--méthode-store)
  - [Product Controller Public](#product-controller-public)
    - [Exemple : méthode index()](#exemple--méthode-index-1)
    - [Exemple : méthode related()](#exemple--méthode-related)
  - [Product Requests](#product-requests)
  - [Routes Produits](#routes-produits)
    - [Routes publiques](#routes-publiques)
    - [Routes Admin](#routes-admin-crud-protégées-par-sanctum--rôle-admin)
  - [Correction CORS — Récapitulatif](#correction-cors-—-récapitulatif)
    - [1. Configuration du backend](#1-configuration-du-backend)
    - [2. Activation du middleware Sanctum SPA stateful](#2-activation-du-middleware-sanctum-spa-stateful)
    - [3. Alignement des URLs Frontend / Backend](#3-alignement-des-urls-frontend--backend)
    - [4. Rafraîchissement de la configuration Laravel](#4-rafraîchissement-de-la-configuration-laravel)
  - [Front-end](#front-end)
    - [Admin Produits — Vue d’ensemble](#admin-produits-—-vue-densemble)
      - [Pages et composants clés](#pages-et-composants-clés)
      - [Création (Create)](#création-create)
      - [Édition (Edit)](#édition-edit)
      - [Filtres et Recherche](#filtres-et-recherche)
      - [Pagination](#pagination)
      - [Système de Recherche (Admin)](#système-de-recherche-admin)
      - [Indicateurs de Stock (Back Office)](#indicateurs-de-stock-back-office)
      - [Layout Admin](#layout-admin)
    - [Composants Front — Vue d’ensemble](#composants-front-—-vue-densemble)
      - [ProductCard](#productcard)
      - [ProductFilters](#productfilters)
      - [PublicPagination](#publicpagination)
      - [SearchBar](#searchbar)
      - [WysiwygEditor](#wysiwygeditor)
    - [Actions Serveur](#actions-serveur)
      - [productActions (Admin)](#productactions-admin)
      - [publicProductActions (Public)](#publicproductactions-public)
    - [Persistance de l’état URL — Recherche, filtres et pagination](#persistance-de-létat-url-—-recherche-filtres-et-pagination)
      - [Principe général](#principe-général)
      - [Hooks dédiés](#hooks-dédiés)
        - [useUrlState](#useurlstate-frontendsrclibuseurlstatejs)
        - [useProductFiltersState](#useproductfiltersstate)
        - [usePaginationState](#usepaginationstate)
      - [Intégration côté Public](#intégration-côté-public)
      - [Comportement côté Admin](#comportement-côté-admin)
  - [Détail d'un produit](#détail-dun-produit)
    - [Route dynamique et données](#route-dynamique-et-données)
    - [Chargement et erreurs](#chargement-et-erreurs)
    - [Rendu principal](#rendu-principal)
      - [En-tête et fil d’Ariane](#en-tête-et-fil-dariane)
      - [Image](#image)
      - [Infos produit](#infos-produit)
      - [Actions](#actions)
      - [Description (WYSIWYG)](#description-wysiwyg)
      - [Produits liés](#produits-liés)
  - [Schéma d’Architecture SCSS](#schéma-darchitecture-scss)
    - [Entrée globale](#entrée-globale)
    - [Arborescence des styles](#arborescence-des-styles)
    - [Ordre de chargement](#ordre-de-chargement)
    - [Variables principales (_variables.scss)](#variables-principales-_variablesscss)
    - [Mixins clés (_mixins.scss)](#mixins-clés-_mixinsscss)
    - [Pages — Usages principaux](#pages-—-usages-principaux)
      - [_home.scss](#pages_homescss)
      - [_products.scss](#pages_productsscss)
      - [_product-detail.scss](#pages_product-detailscss)
    - [Admin — Usages principaux](#admin-—-usages-principaux)
      - [_dashboard.scss](#admin_dashboardscss)
      - [_auth.scss](#admin_authscss)
      - [_products-admin.scss](#admin_products-adminscss)
      - [_pagination-admin.scss](#admin_pagination-adminscss)
      - [_product-form-admin.scss](#admin_product-form-adminscss)
    - [Conventions](#conventions)

---

## ENV FRONT

Variables ajoutées :

- `NEXTAUTH_SECRET=un_mot_de_passe`
- `BACKEND_URL=http://127.0.0.1:8000/api`
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`

---

## ENV BACK

Variables ajoutées :

- `ADMIN_PASSWORD=un_mot_de_passe`
- `CATALOG_PASSWORD=un_mot_de_passe`
- `SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000`  
  *(pour autoriser ces domaines)*

J'ai également modifié les valeurs des variables de connexion à la base de données et généré la clé d'application :

```bash
php artisan key:generate
```

## Setup Back-end

Pour préparer l'ajout d'images, création du lien symbolique entre `public/storage` et `storage/app/public` :

```bash
php artisan storage:link
```

Lancement initial du back avec installation des dépendances, migration, seed et cache clear : 
```bash
composer install 
php artisan migrate --seed 
php artisan cache:clear 
php artisan serve
```

## Setup Front-end

Après avoir configuré le .env, installation des dépendances et lancement du front :
```bash
npm install
npm run dev
```

J'ai également ajouté la librairie [Slate.js](https://www.slatejs.org/examples/richtext) pour l'utilisation future d'un éditeur WYSIWYG pour la description des produits.

# Mise en place du modèle Product

Pour mettre en place le modèle `Product`, j'ai commencé par générer automatiquement la première migration avec la commande :
```bash
php artisan make:model Product -m
```
Commandes supplémentaires pour modifications ultérieures :
```bash
php artisan make:migration add_description_to_products_table --table=products
```
```bash
php artisan make:migration alter_products_reference_column --table=products
```
- Les deux migrations supplémentaires ont été nécessaires car :  
  - Initialement, la **description** n'avait pas été prévue.  
  - Le champ **reference** a été modifié de `bigint` → `string` pour supporter des références plus longues (test avec un produit du site PharmaGDD).

J'ai choisi d'utiliser un **UUID** pour ce test afin de rendre les endpoints moins prévisibles.  
⚠️ Cependant, cela **alourdit la base de données et ralentit l'indexation**.

> Pour un site e-commerce complet, un **ID classique** serait plus cohérent pour des raisons de performance.

## TABLE PRODUCTS AVEC EXEMPLES
| Champ       | Type                          | Exemple                                      | Présence   | Description                                                                 |
|-------------|-------------------------------|----------------------------------------------|------------|-----------------------------------------------------------------------------|
| id          | uuid (string, PK, auto)       | `550e8400-e29b-41d4-a716-446655440000`       | requis     | Identifiant unique du produit (UUID généré automatiquement).                |
| name        | string                        | Doliprane 500mg                              | requis     | Nom commercial du produit.                                                  |
| brand       | string                        | Sanofi                                       | requis     | Marque / laboratoire du produit.                                            |
| reference   | string(100), unique           | 3578835505078                                 | requis     | Référence interne produit (recherche, affichage fiche).                     |
| price       | decimal(10,2)                 | 3.99                                         | requis     | Prix TTC en euros.                                                          |
| quantity    | integer                       | 12                                           | requis     | Quantité en stock (0 = hors stock, affiché “Bientôt de retour”).            |
| description | text (string JSON/HTML)       | `"[{type:'paragraph',...}]"`                 | optionnel  | Description riche (WYSIWYG Slate), stockée en JSON string; rendue en HTML.  |
| image       | string (chemin stockage)      | products/dlprn500.jpg                        | optionnel  | Chemin du fichier image stocké par Laravel (`storage/`).                    |
| created_at  | timestamp                     | 2025-01-20T10:45:00Z                         | auto       | Date de création (Eloquent).                                                |
| updated_at  | timestamp                     | 2025-01-21T08:30:00Z                         | auto       | Dernière mise à jour (Eloquent).                                            |
| image_url   | string (dérivé API)           | https://localhost:8000/storage/products/dlprn500.jpg | dérivé    | URL absolue calculée côté API pour le frontend.                             |

## LE MODEL PRODUCT
Le model étant déjà généré, j'ai pu le compléter comme ci-dessous:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'reference',
        'brand',
        'description',
        'quantity',
        'image'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'quantity' => 'integer',
        ];
    }

    /**
     * Boot the model and generate UUID for new models.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
```

Une fois le model créé et complété, j'ai mis en place un "ProductSeeder" contenant 60 produits pour avoir un jeu de données dans la base de données.

```php
[
    'name' => 'Gel Adapalène 0.1%',
    'price' => 18.90,
    'reference' => '1039',
    'brand' => 'Differine',
    'quantity' => 35,
    'image' => null,
],
```

Précision: ces produits n'ont pas de description. Utilisant Slate.js, je voulais uniquement enrichir certains produit pour illustrer ce que permet de faire Slate.js.

## Product Controller (Admin)

Comme pour un CRUD classique, dans le `ProductController` côté admin, on y retrouve les méthodes suivantes :

- `index()`  
- `show()`  
- `store()`  
- `update()`  
- `destroy()`  
- `getImageUrl()`

> Les méthodes `create` et `edit` ne sont pas présentes, car la communication se fait via API avec le front (Next.js) qui gère l'affichage des formulaires.

### Exemple : méthode `index()`
```php
public function index(Request $request): JsonResponseI
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

    // Search by name, brand, or reference
    if ($search) {
        $query->where(function($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('brand', 'LIKE', "%{$search}%")
              ->orWhere('reference', 'LIKE', "%{$search}%");
        });
    }

    // Filter by brand
    if ($brand) {
        $query->where('brand', 'LIKE', "%{$brand}%");
    }

    // Filter by price
    if ($minPrice !== null && is_numeric($minPrice)) {
        $query->where('price', '>=', (float)$minPrice);
    }
    if ($maxPrice !== null && is_numeric($maxPrice)) {
        $query->where('price', '<=', (float)$maxPrice);
    }

    // Filter by quantity
    if ($minQuantity !== null && is_numeric($minQuantity)) {
        $query->where('quantity', '>=', (int)$minQuantity);
    }
    if ($maxQuantity !== null && is_numeric($maxQuantity)) {
        $query->where('quantity', '<=', (int)$maxQuantity);
    }

    // Sorting
    $query->orderBy($sortBy, $sortOrder);

    // Pagination
    $products = $query->paginate($perPage, ['*'], 'page', $page);

    // Get unique brands for filters
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
```

### Exemple : méthode store()
```php
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
```

## PRODUCT CONTROLLER PUBLIC
J'ai fais le choix d'avoir deux ProductController. L'un gère les produits dans le back office et l'autre gère les produits pour le front.

On y retrouve les méthodes:
- index()
- show()
- related()

La méthode related(), explications:
- **Exclut le produit courant**  
  `where('id', '!=', $product->id)`

- **Ne retourne que des produits en stock**  
  `where('quantity', '>', 0)`

- **Critères de similarité :**
  - Même **marque** (`brand`)
  - **Prix** dans une fourchette de ±20% du produit consulté  
    `orWhereBetween('price', [0.8 * $product->price, 1.2 * $product->price])`

- **Limite** à 4 résultats  
  `limit(4)->get()`

- **Ajoute une URL d'image publique**  
  `image_url = asset('storage/...')` si une image existe, sinon `null`

- **Réponse JSON structurée** :  
  ```json
  {
    "message": "Produits liés",
    "products": [...]
  }
  ```

### Exemple : méthode index():
```php
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
```

### Exemple : méthode related():
```php
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
```

## PRODUCT REQUESTS

### Gestion des Requests personnalisées

Pour une meilleure gestion des requests, j'ai choisi de créer **deux fichiers distincts** :  

- **StoreProductRequest** → pour la création d’un produit  
- **UpdateProductRequest** → pour la mise à jour d’un produit  

### Commandes pour les générer

```bash
php artisan make:request StoreProductRequest
php artisan make:request UpdateProductRequest
```

## Routes Produits
Étant donné que nous travaillons avec une API pour le back, les routes **admin** et **publiques** sont définies dans le fichier `api.php`.

### Routes publiques

| Méthode | Endpoint | Description |
|---------|---------|-------------|
| GET     | /api/products | Liste paginée des produits (inclut hors stock) |
| GET     | /api/products/{product} | Détail d’un produit |
| GET     | /api/products/{product}/related | 4 produits similaires (même marque ou ±20% du prix, en stock) |

**Query params pour GET /api/products :**

| Paramètre   | Type | Description | Valeur par défaut |
|-------------|------|-------------|-----------------|
| page        | int  | Numéro de page | 1 |
| per_page    | int  | Nombre d’éléments par page (1–48) | 12 |
| search      | string | Recherche sur name, brand, reference, description | — |
| brand       | string | Filtre par marque | — |
| sort_by     | string | Tri par champ (name, price, brand, created_at) | created_at |
| sort_order  | string | Ordre de tri (asc, desc) | desc |
| min_price   | number | Prix minimum | — |
| max_price   | number | Prix maximum | — |

---

### Routes Admin (CRUD, protégées par Sanctum + rôle admin)

| Méthode | Endpoint | Description |
|---------|---------|-------------|
| GET     | /api/admin/products | Liste paginée des produits (avec filtres éventuels) |
| POST    | /api/admin/products | Création d’un produit |
| GET     | /api/admin/products/{product} | Détail d’un produit |
| PUT/PATCH | /api/admin/products/{product} | Mise à jour d’un produit |
| DELETE  | /api/admin/products/{product} | Suppression d’un produit |

## Correction CORS — Récapitulatif

Pour résoudre les problèmes liés aux requêtes cross-origin (CORS) entre le front (Next.js) et le back (Laravel), j'ai suivi les étapes suivantes :

---

### 1. Configuration du backend

Fichier : `config/cors.php` :

- **paths** : `['api/*', 'sanctum/csrf-cookie']`  
- **allowed_origins** : `['http://localhost:3000', 'http://127.0.0.1:3000']`  
- **allowed_methods** : `['*']`  
- **allowed_headers** : `['*']`  
- **supports_credentials** : `true` *(indispensable pour les cookies et tokens cross-origin)*

---

### 2. Activation du middleware Sanctum SPA stateful

- Dans `bootstrap/app.php`, ajout de :

```php
\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class
```

### 3. Alignement des URLs Frontend / Backend

- Front-end : NEXT_PUBLIC_BACKEND_URL pointe vers l’API
- Back-end : APP_URL cohérent avec l’hôte

### 4. Rafraîchissement de la configuration Laravel
```bash
php artisan config:clear
```
```bash
php artisan config:cache
```

### Résultat

Les pré-requêtes OPTIONS et les appels fetch depuis http://localhost:3000 vers http://localhost:8000/api/* passent correctement.

Les cookies et la session Sanctum fonctionnent en mode SPA.

***

# Front-end

## Admin Produits — Vue d’ensemble

### Pages et composants clés
- `app/admin/dashboard/products/page.jsx`  
- `ProductForm.jsx`  
- `ProductFilters.jsx`  
- `Pagination.jsx`  
- `components/AdminLayout.jsx`

### Intégration API
- Actions : `getProducts`, `createProduct`, `updateProduct`, `deleteProduct` (dans `App/server/productActions`)  
- Endpoint : `/api/admin/products`

### Création (Create)

- **Déclencheur** : bouton “+ Créer un produit” ouvre la modale (`setShowCreateForm(true)`)  
- **Formulaire** : `ProductForm.jsx` avec champs `name`, `price`, `reference`, `brand`, `quantity`, `description` (WYSIWYG), et `image`  
- **WYSIWYG** : composant `WysiwygEditor.jsx` (Slate + History), description stockée en JSON string  
- **Image** : gestion du fichier, preview (`imagePreview`), support du changement (`selectedImage`)  
- **Validation / états** : `errors`, `isLoading` pour désactiver les inputs/boutons  

### Édition (Edit)

- **Ouverture** : bouton “Éditer” sur une carte produit remplit le formulaire avec valeurs initiales (`product`)  
- **Sauvegarde** : `onSave` déclenche `updateProduct` (PUT/PATCH `/api/admin/products/{id}`), gère états et messages d’erreur comme pour la création  
- **Image** : affiche l’image actuelle si non remplacée ; preview si un nouveau fichier est sélectionné  
- **WYSIWYG** : synchronisation avec le contenu existant du produit (conversion JSON Slate)

### Filtres et Recherche

- **Composant** : `ProductFilters.jsx`  
- **Champs gérés** : `search`, `brand`, `sort_by`, `sort_order`, `min_price`, `max_price`, `min_quantity`, `max_quantity`  
- **Comportement** : `onFiltersChange` propage les filtres au parent qui relance `getProducts` côté serveur ; page réinitialisée à 1  
- **Recherche** : paramètre `search` transmis au backend ; correspondances sur `name`, `brand`, `reference`, `description`  

### Pagination

- **Composant** : `Pagination.jsx`  
- **Données** : utilise l’objet pagination du backend (`current_page`, `last_page`, `per_page`, `total`, `from`, `to`)  
- **Logique** : `generatePageNumbers()` affiche une fenêtre dynamique (jusqu’à 5 pages visibles) autour de `current_page`, bornes 1 / `last_page`  
- **Interactions** :  
  - `onPageChange(page)` pour changer de page  
  - `onPerPageChange(perPage)` pour modifier le nombre d’items par page (ex : 12, 24, 48)  

### Système de Recherche (Admin)

- Intégré au composant `ProductFilters.jsx` via le champ `search` et les autres filtres.  
- **Validation requise** : la recherche et les filtres ne déclenchent pas de requête tant que l’utilisateur n’a pas validé (bouton “Appliquer les filtres” ou touche Entrée).  
- **Soumission** : à la validation, la page est réinitialisée à 1 et la liste est rafraîchie via `getProducts` avec les paramètres sélectionnés.  
- **État local** : les inputs mettent à jour un état local sans requête réseau intermédiaire ; pas de debounce côté admin.  
- **UX** : cohérence avec les autres filtres (tri, prix, quantité) ; un bouton “Réinitialiser” permet de remettre les filtres à zéro.  

### Indicateurs de Stock (Back Office)

- **Styles prévus** : `.product-stock.low-stock`, `.product-stock.medium-stock`, `.product-stock.high-stock` dans `styles/admin/_products-admin.scss`  
- **Usage** : classes appliquées selon la quantité pour colorer l’état (rouge / orange / vert) et faciliter le repérage des faibles stocks

### Layout Admin

- **Composant** : `components/AdminLayout.jsx`  
- **Rôle** : conserve l’en-tête et le menu du dashboard (liens “Accueil”, “Produits”), gère la déconnexion (`adminLogout`), encapsule les pages (`children`) pour une expérience persistante

### Points d’intégration importants

- Les actions CRUD appellent les routes protégées `/api/admin/products` (Sanctum + rôle admin)  
- Les filtres/pagination ajoutent/retranchent des query params au fetch côté serveur pour obtenir un payload paginé cohérent (`from` / `to` / `total`)

### Exemple du layout admin

```php
"use client";

import { adminLogout } from "App/server/adminAuth";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = "/admin";
  };

  return (
    <div className="dashboard-page admin">
      {/* Header with navigation menu */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            <Link href="/admin/dashboard">
              Dashboard Administrateur
            </Link>
          </h1>
          
          <nav className="dashboard-nav">
            <Link 
              href="/admin/dashboard" 
              className={`nav-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              Accueil
            </Link>
            <Link 
              href="/admin/dashboard/products" 
              className={`nav-link ${pathname.startsWith('/admin/dashboard/products') ? 'active' : ''}`}
            >
              Produits
            </Link>
          </nav>

          <div className="dashboard-user-section">
            <button
              onClick={handleLogout}
              className="logout-button admin"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
```

***

# Composants Front — Vue d’ensemble

**Dossier :** `frontend/src/components`  
**Composants :** `ProductCard.jsx`, `ProductFilters.jsx`, `PublicPagination.jsx`, `SearchBar.jsx`, `WysiwygEditor.jsx`  
**Exclusion :** `AdminLayout.jsx` (déjà documenté)

### ProductCard

**Rôle :** Affiche une carte produit pour la liste publique, avec image, nom, marque, prix et état de stock. Le clic ouvre le détail produit.

**Props :**  
- `product` : objet produit (`id`, `name`, `brand`, `price`, `quantity`, `image_url`)

**Rendu :**  
- Lien vers `/products/{id}` via `next/link`  
- Image via `next/image` si `image_url` existe, sinon un placeholder SVG  
- Prix formaté en EUR (`fr-FR`) via `Intl.NumberFormat`  
- Stock : affiche “En stock” si `quantity > 0`, sinon “Bientôt de retour”

**Classes utilisées :**  
`product-card`, `product-link`, `product-image-container`, `product-image`, `product-image-placeholder`, `product-info-client`, `product-name`, `product-brand`, `product-footer`, `product-price`, `product-stock`, `in-stock`, `out-of-stock`

**Notes :**  
- `objectFit: 'cover'` appliqué à l’image pour un rendu homogène  
- Purement affichage public, pas d’action d’édition

### ProductFilters

**Rôle :** Filtres pour la liste publique (réutilisable côté admin avec comportement adapté). Gère tri, marque, fourchettes de prix et réinitialisation.

**Props :**  
- `filters` : meta (ex. `brands` pour alimenter le select)  
- `onFiltersChange` : callback appelé à chaque modification locale  
- `appliedFilters` : valeurs initiales (pré-appliquées)

**État :** `localFilters` `{ brand, min_price, max_price, sort_by, sort_order }`

**Comportement :**  
- Mise à jour instantanée via `onFiltersChange(newFilters)`  
- Bouton “Effacer les filtres” remet les valeurs par défaut  
- Indicateur d’activité si des filtres sont actifs (`hasActiveFilters`)  

**Champs :**  
- Tri : `sort_by` (`created_at`, `name`, `price`, `brand`), `sort_order` (`asc`/`desc`)  
- Marque : `brand` (liste injectée)  
- Prix : `min_price`, `max_price` (number, step=0.01)

**Classes utilisées :**  
`product-filters`, `filters-header`, `active-filters-indicator`, `filters-content`, `filters-grid`, `filter-group`, `filter-select`, `filter-input`, `filters-actions`, `clear-filters-button`

**Notes :**  
- Notifie en direct via `onFiltersChange` côté public  
- Côté admin, la validation peut bufferiser l’état local avant envoi

### PublicPagination

**Rôle :** Pagination pour la liste publique avec fenêtre de pages dynamiques, boutons précédent/suivant, et sélection du nombre d’items par page

**Props :**  
- `pagination` : `{ current_page, last_page, per_page, total, from, to }`  
- `onPageChange(page)`  
- `onPerPageChange(perPage)`

**Logique :**  
- Génère jusqu’à 5 pages visibles autour de `current_page`  
- Ellipses `...` si des pages sont masquées  
- Boutons précédent/suivant désactivés aux bornes

**Rendu :**  
- Infos : “Affichage de from à to sur total produits”  
- Boutons : premier, visible window, dernier, précédent, suivant  
- Sélecteur `per_page` : valeurs 12, 24, 48

**Classes utilisées :**  
`public-pagination`, `pagination-info`, `pagination-controls`, `pagination-button` (+ `prev`, `next`, `active`), `pagination-ellipsis`, `pagination-per-page`, `per-page-select`

**Notes :**  
- Retourne `null` si `last_page <= 1`

### SearchBar

**Rôle :** Barre de recherche réutilisable avec mode “live” (debounce) ou “validation” (submit), indicateur de chargement et bouton de réinitialisation

**Props :**  
- `onSearch(term)` : callback pour lancer la recherche  
- `placeholder` : texte d’aide (par défaut “Rechercher des produits...”)  
- `initialValue` : valeur initiale (ex. depuis l’URL)  
- `debounceMs` : délai du debounce (défaut 300ms)  
- `enableLiveSearch` : true = live, false = validation

**État :** `searchTerm`, `isSearching`

**Comportement :**  
- Mode live : debounce sur `searchTerm` puis `onSearch`  
- Mode validation : soumission via bouton ou Entrée  
- Bouton “×” efface et appelle `onSearch("")`  
- Synchronisation avec `initialValue` via effet

**Rendu :**  
- Input texte, loader SVG (`search-spinner`), bouton “×”, bouton “Rechercher” (mode validation)

**Classes utilisées :**  
`search-bar`, `search-input-container`, `search-input`, `search-loading-indicator`, `search-spinner`, `clear-button`, `search-button`

**Notes :**  
- Délègue la logique de fetch au parent

### WysiwygEditor

**Rôle :** Éditeur WYSIWYG (Slate + History) pour la description riche, sérialisé en JSON string compatible API

**Props :**  
- `value` : JSON string (Slate) ou vide  
- `onChange(serialized)` : callback avec valeur JSON  
- `placeholder` : “Entrez votre description...”  
- `maxLength` : limite théorique (défaut 50000)  
- `error` : message d’erreur conditionnel

**État et synchronisation :**  
- Initialisation avec `withReact + withHistory`  
- Parse la valeur initiale (`parseValue(value)`), synchronisation si valeur externe change

**Toolbar et formats :**  
- Marques : bold, italic, underline  
- Titres : heading-one, heading-two  
- Listes : numbered-list, bulleted-list  
- Alignements : left, center, right, justify  
- Boutons et icônes : `wysiwyg-button`, `active`, `wysiwyg-icon`, `wysiwyg-separator`, `wysiwyg-toolbar`

**Rendu du contenu :**  
- `<p>`, `<h1>`, `<h2>`, `<ul>`, `<ol>`, `<li>` avec `textAlign`  
- Feuilles : `strong`, `em`, `u`

**Classes utilisées :**  
`wysiwyg-toolbar`, `wysiwyg-button`, `active`, `wysiwyg-icon`, `wysiwyg-separator`

**Notes :**  
- Valeur toujours remontée en JSON string via `onChange`  
- Pas de gestion d’images/médias intégrée, uniquement texte

# Actions Serveur

**Emplacement :** `frontend/src/server`  
**Modules :**  
- `productActions.js` (Admin, protégés)  
- `publicProductActions.js` (Public)

## productActions (Admin)

**Contexte :**  
- Utilise `adminAuth()` pour récupérer la session et le `laravelAccessToken`.  
- Cible les endpoints protégés `/admin/products` (Bearer token).

### Fonctions principales

- **getProducts(page = 1, perPage = 10, filters = {})**  
  - GET `{BACKEND_URL}/admin/products?page&per_page&...filters`  
  - Ajoute uniquement les filtres non vides : `brand`, `min_price`, `max_price`, `sort_by`, `sort_order`, etc.  
  - Retour : `{ success, data: products, pagination, filters }`  
  - Gestion d’échec : `{ success: false, error }`, gère 401 si non authentifié

- **deleteProduct(productId)**  
  - DELETE `{BACKEND_URL}/admin/products/{id}` avec Authorization  
  - Retour : `{ success: true, message }`  
  - Échec : parse le `text()` et met le message dans `error`

- **updateProduct(productId, productData)**  
  - Accepte JSON ou FormData  
  - FormData : POST avec `_method=PUT` (upload image)  
  - JSON : PUT avec `Content-Type: application/json`  
  - Retour : `{ success: true, data: product }`  
  - Échec : log détaillé, parse JSON si possible, message structuré dans `error`

- **createProduct(productData)**  
  - Accepte JSON ou FormData  
  - FormData : POST sans Content-Type  
  - JSON : POST avec Content-Type `application/json`  
  - Retour : `{ success: true, data: product }`  
  - Échec : log + parse corps d’erreur, message riche dans `error`

**Points clés :**  
- Tous les appels vérifient la présence du token admin  
- Les filtres sont passés en query string pour cohérence pagination/tri  
- Les erreurs remontent un message exploitable côté UI (toast/alert)

## publicProductActions (Public)

**Contexte :**  
- Appels non authentifiés sur `/products` et `/products/{id}`  
- Désactive le cache Next (`cache: 'no-store'`) pour des données à jour

### Fonctions principales

- **getPublicProducts(page = 1, perPage = 12, filters = {})**  
  - GET `{BACKEND_URL}/products?page&per_page&...filters`  
  - Retour : `{ success, data: products, pagination, filters }`  
  - Échec : message `Erreur {status}: {text}`

- **getPublicProduct(productId)**  
  - GET `{BACKEND_URL}/products/{id}`  
  - Retour : `{ success, data: product }`

- **getRelatedProducts(productId)**  
  - GET `{BACKEND_URL}/products/{id}/related`  
  - Retour : `{ success, data: products }`

**Points clés :**  
- Les filtres côté public peuvent inclure : `search`, `brand`, `sort_by`, `sort_order`, `prix`  
- Interface de retour uniforme (`success`, `data`, `pagination`, `filters`) pour simplifier la consommation côté pages

***

# Persistance de l’état URL — Recherche, filtres et pagination
- Conserver la recherche, les filtres et la pagination après un rafraîchissement.  
- Offrir une **UX stable** et des **liens partageables**.

## Principe général

- Encoder l’état dans l’URL via les **query params** : `page`, `per_page`, `search`, `brand`, `min_price`, `max_price`, `sort_by`, `sort_order`.  
- À l’hydratation, relire les params de l’URL et reconstituer l’état local avant de relancer le chargement des produits.  

## Hooks dédiés

### useUrlState (`frontend/src/lib/useUrlState.js`)

- Initialise l’état à partir des `searchParams` (`useSearchParams`), avec désérialisation par type.  
- Met à jour l’URL via `router.replace` avec **debounce** (`debounceMs`), sans scroll.  
- Ignore les valeurs vides et les valeurs par défaut pour garder des URL propres.  
- Expose : `[state, updateState, resetState]`.

### useProductFiltersState

- Spécialisation avec `DEFAULT_FILTERS` (page, per_page, search, brand, min/max_price, sort_by/order).  
- Désérialise les valeurs pour garantir des types sûrs (`page ≥ 1`, `per_page ∈ {12,24,48}`).

### usePaginationState

- Met à jour `page` et `per_page` ; réinitialise `page` si `per_page` change.  
- Effectue un `scrollTo` haut de page pour l’UX.

### Intégration côté Public

- La page `products` encode et lit son état via `useProductFiltersState`.  
- Handlers principaux :  
  - `handleSearch(term)` → `updateUrlState({ search: term, page: 1 })`  
  - `handleFiltersChange(newFilters)` → `updateUrlState({ ...newFilters, page: 1 })`  
- Pagination via `usePaginationState` sur le même `urlState`.  
- **Résultat :** un refresh ou un lien copié-collé conserve la liste telle qu’affichée (recherche, filtres, page).

### Comportement côté Admin

- Actuel : `ProductsPage` admin stocke `activeFilters`, `currentPage`, `perPage` en `useState`.  
- Limitation : ces valeurs ne sont pas persistées dans l’URL, donc un refresh les perd.

***

## Détail d'un produit

### Route dynamique et données
- Fichier: `app/products/[id]/page.jsx`
- Récupération du product Id via `useParams()`
- Données: `getPublicProduct(productId)` puis `getRelatedProducts(productId)` depuis `publicProductActions`
- Objectif: afficher le détail, état de stock, description (WYSIWYG) et produits similaires

### Chargement et erreurs
- États: `product`, `relatedProducts`, `loading`, `error`
- Chargement: section dédiée avec `loading-spinner` et message
- Erreur: section avec titre, message (`error`) et bouton retour (`/products`)
- Pas de cache: `cache: 'no-store'` dans les fetchs pour des infos à jour

### Rendu principal

#### En-tête et fil d’Ariane
- Navigation: “Accueil/Produits”
- Fil d’Ariane: Accueil › Produits › `{product.name}`

#### Image
- Image principale via `next/image` (`product.image_url`), `objectFit: "cover"`
- Placeholder SVG si pas d’image

#### Infos produit
- Titre (`name`), marque (`brand`), référence (`reference`)
- Prix formaté EUR: `Intl.NumberFormat('fr-FR')`
- Stock: badge “✓ En stock” ou “✗ Bientôt de retour”

#### Actions
- Bouton “Ajouter au panier” factice (alert si stock > 0)
- Bouton retour aux produits

#### Description (WYSIWYG)
- Source: contenu Slate (JSON string)
- Conversion: `convertSlateToHtml` mappe nœuds (`paragraph`, `heading-one/two`, `ul/ol/li`, `blockquote`) et marques (`bold/italic/underline`) vers HTML
- Injection: `dangerouslySetInnerHTML` sur `description-content`

#### Produits liés
- Chargement séquentiel après le produit
- Affichage grid via `ProductCard` (image, nom, marque, prix, stock)
- Critères côté API: marque identique ou prix dans une fenêtre ±20%

***

# Schéma d’Architecture SCSS

## Entrée globale

- **Point d’entrée côté client :**  
  `frontend/src/app/layout.js` importe `App/styles/main.scss`  
  (alias `src/styles/main.scss`), ce qui charge **tous les styles** au niveau de l’app.

---

## Arborescence des styles

📂 **src/styles/**  
├── 📄 **main.scss** *(point d’entrée global)*  
│  
├── 📄 _variables.scss *(couleurs, gris, breakpoints)*  
├── 📄 _mixins.scss *(boutons, inputs, layout, responsive)*  
├── 📄 _base.scss *(reset léger + utilitaires : grid, spacing, text, display)*  
│  
├── 📂 **components/**  
│   └── 📄 _wysiwyg.scss *(éditeur Slate)*  
│  
├── 📂 **pages/**  
│   ├── 📄 _home.scss *(page d’accueil + CTA + sections info)*  
│   ├── 📄 _products.scss *(catalogue public : header, recherche, filtres, grille, pagination)*  
│   └── 📄 _product-detail.scss *(fiche produit : header, breadcrumb, galerie, infos, actions, description, liés, loading/erreur)*  
│  
└── 📂 **admin/**  
    ├── 📄 _dashboard.scss *(header, navigation, cards, debug, loading)*  
    ├── 📄 _auth.scss *(pages login admin/user)*  
    ├── 📄 _products-admin.scss *(grille, filtres, actions, stock, CRUD)*  
    ├── 📄 _pagination-admin.scss *(pagination admin : boutons, états, per-page)*  
    └── 📄 _product-form-admin.scss *(modale, inputs, preview, erreurs, actions)*  

---

## Ordre de chargement

Dans `main.scss` :

1. `variables`
2. `mixins`
3. `base`
4. `components`
5. `pages`
6. `admin`

---

## Variables principales (`_variables.scss`)

- **Couleurs :**  
  `#10a666` (`$primary-color`), `#0a7a4b` (`$secondary-color`),  
  `$white`, `$black`, `$gray`, `$red`.

- **Variantes :**  
  `$primary-light/dark`, `$secondary-light/dark`,  
  `$red-500/600`, `$green-500/600`, `$orange-500/600`, `$yellow-500/600`.

- **Gris :** `$gray-50` → `$gray-900` avec `lighten()` / `darken()`.

- **Breakpoints :**  
  `$mobile`, `$tablet`, `$desktop`, `$large`.

---

## Mixins clés (`_mixins.scss`)

- **Layout :** `flex-center`, `flex-between`, `card`.  
- **Formes :** `input`.  
- **Boutons :**  
  - `button($bg, $hover)`  
  - `button-base`  
  - `button-variant($bg, $hover)` (inclut `:disabled`).  
- **Responsive :**  
  - `responsive($breakpoint)`  
  - `responsive-products($breakpoint)` (adapté aux pages).  

**Utilisation :** partout pour **cohérence visuelle** et **accessibilité** (`hover`, `focus`).

---

## Pages — Usages principaux

### `pages/_home.scss`
- Carte d’accueil.  
- Boutons CTA : `.cta-button.primary / .secondary`.  
- Sections admin/user.  
- Liste tech.  

### `pages/_products.scss`
- Header sticky.  
- Barre de recherche (`.search-bar`, loader `.search-spinner` avec `@keyframes spin`).  
- Filtres (`.product-filters`).  
- Grille (`.products-grid`, `.product-card`).  
- Footer carte (prix/stock).  
- Pagination publique (`.public-pagination`, `.pagination-button.active`).  

### `pages/_product-detail.scss`
- Header sticky, breadcrumb.  
- Galerie (`.product-image` / placeholder).  
- Infos (titre, marque, référence, prix, stock).  
- Actions : bouton “ajout au panier” (`.available` / `.unavailable`), lien retour.  
- Description riche : `H1–H6`, `UL/OL`, `strong`, `em`, `u`.  
- Produits liés (`.related-products-grid`).  
- États loading / erreur.  

---

## Admin — Usages principaux

### `admin/_dashboard.scss`
- `.dashboard-header` (menu, liens actifs).  
- `.dashboard-card` (sections).  
- `.logout-button.admin/user`.  
- `.loading-screen`.  

### `admin/_auth.scss`
- Layout des pages de connexion.  
- Variantes admin/user.  
- Focus visuel sur inputs.  

### `admin/_products-admin.scss`
- Cartes produits (image, nom, brand, référence, prix).  
- Badges stock colorés : `.stock-low`, `.stock-normal`, `.product-stock.low/medium/high`.  
- Filtres (search, brand, tri, prix, quantité).  
- Actions : `.btn-edit`, `.btn-delete`.  

### `admin/_pagination-admin.scss`
- `.admin-pagination` (info + contrôle).  
- Boutons `.admin-pagination__button` (`is-active`, `is-disabled`).  
- Select `per-page` stylé.  

### `admin/_product-form-admin.scss`
- Modale admin.  
- Inputs, preview image.  
- Gestion des erreurs : `.error-text`.  
- Actions : `.btn--cancel`, `.btn--submit`.  

---

## Conventions

- **Nommage clair** : classes regroupées par contexte (`pages`, `admin`, `components`).  
- **Mixins** appliqués aux boutons/inputs/focus pour cohérence + accessibilité.  
- **Responsive centralisé** via mixins + breakpoints (`mobile`, `tablet`, `desktop`, `large`).  
- **Animations légères :** `spin` pour loaders (search, chargement).  
