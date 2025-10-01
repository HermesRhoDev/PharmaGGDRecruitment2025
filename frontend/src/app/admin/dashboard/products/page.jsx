"use client";

import { useState, useEffect } from "react";
import { getProducts, deleteProduct, updateProduct, createProduct } from "App/server/productActions";
import ProductForm from "./ProductForm";
import Pagination from "./Pagination";
import ProductFilters from "./ProductFilters";
import AdminLayout from "../../../../components/AdminLayout";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // États pour la pagination et les filtres
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    fetchProducts(currentPage, perPage, activeFilters);
  }, [currentPage, perPage, activeFilters]);

  const fetchProducts = async (page = 1, itemsPerPage = 10, filtersToApply = {}) => {
    setLoading(true);
    try {
      const result = await getProducts(page, itemsPerPage, filtersToApply);
      
      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
        setFilters(result.filters);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Erreur de connexion: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
      return;
    }

    setDeletingId(productId);
    
    try {
      const result = await deleteProduct(productId);
      
      if (result.success) {
        // Recharger la page actuelle après suppression
        await fetchProducts(currentPage, perPage, activeFilters);
        alert("Produit supprimé avec succès !");
      } else {
        alert(`Erreur lors de la suppression: ${result.error}`);
      }
    } catch (err) {
      alert(`Erreur de connexion: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (productData) => {
    setIsUpdating(true);
    
    try {
      const result = await updateProduct(editingProduct.id, productData);
      
      if (result.success) {
        // Recharger la page actuelle après modification
        await fetchProducts(currentPage, perPage, activeFilters);
        setEditingProduct(null);
        alert("Produit modifié avec succès !");
      } else {
        console.error("Update failed:", result.error);
        alert(`Erreur lors de la modification: ${result.error}`);
      }
    } catch (err) {
      console.error("Update exception:", err);
      alert(`Erreur de connexion: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleCreateProduct = async (productData) => {
    setIsCreating(true);
    
    try {
      const result = await createProduct(productData);
      
      if (result.success) {
        // Recharger la première page après création
        await fetchProducts(1, perPage, activeFilters);
        setCurrentPage(1); // Retourner à la première page pour voir le nouveau produit
        setShowCreateForm(false);
        alert("Produit créé avec succès !");
      } else {
        console.error("Create failed:", result.error);
        alert(`Erreur lors de la création: ${result.error}`);
      }
    } catch (err) {
      console.error("Create exception:", err);
      alert(`Erreur de connexion: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Retourner à la première page
  };

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Retourner à la première page lors du changement de filtres
  };

  const handleFiltersReset = () => {
    setActiveFilters({});
    setCurrentPage(1); // Retourner à la première page lors du reset
  };

  return (
    <AdminLayout>
      <div className="products-page">
        {/* Titre de la page */}
        <div className="products-title">
          <h1>Gestion des Produits</h1>
        </div>

        {/* Actions principales */}
        <div className="products-actions">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-create"
          >
            + Créer un produit
          </button>
        </div>

        {/* Filtres */}
        <ProductFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />

        {/* États de chargement et d'erreur */}
        {loading && <div className="loading">Chargement des produits...</div>}
        {error && <div className="error">Erreur: {error}</div>}

        {/* Liste des produits */}
        {!loading && !error && (
          <div className="products-content">
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Image du produit - plus petite et conditionnelle */}
                  {product.image && (
                    <div className="product-image-small">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${product.image}`} 
                        alt={product.name}
                      />
                    </div>
                  )}
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-price">{product.price} €</p>
                    <p className="product-reference">Réf: {String(product.reference)}</p>
                    <p className={`product-stock ${product.quantity <= 5 ? 'low-stock' : product.quantity <= 10 ? 'medium-stock' : 'high-stock'}`}>
                      Stock: {product.quantity}
                    </p>
                  </div>
                  
                  <div className="product-actions">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="btn-edit"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="btn-delete"
                    >
                      {deletingId === product.id ? "Suppression..." : "Supprimer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Composant de pagination */}
            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
              />
            )}
          </div>
        )}

        {/* Formulaire d'édition modal */}
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelEdit}
            isLoading={isUpdating}
            mode="edit"
          />
        )}

        {/* Formulaire de création modal */}
        {showCreateForm && (
          <ProductForm
            onSave={handleCreateProduct}
            onCancel={handleCancelCreate}
            isLoading={isCreating}
            mode="create"
          />
        )}
      </div>
    </AdminLayout>
  );
}
