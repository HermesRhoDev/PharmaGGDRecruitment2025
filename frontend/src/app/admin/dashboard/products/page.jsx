"use client";

import { useState, useEffect } from "react";
import { getProducts, deleteProduct, updateProduct } from "App/server/productActions";
import EditProductForm from "./EditProductForm";
import Pagination from "./Pagination";
import ProductFilters from "./ProductFilters";
import "../../../styles/admin/product.scss";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#6c757d" }}>Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#dc3545" }}>Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#343a40" }}>Liste des Produits</h1>

      {/* Composant de filtres */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
      />

      {products.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          border: "1px solid #dee2e6"
        }}>
          <p style={{ fontSize: "18px", color: "#6c757d", margin: 0 }}>
            Aucun produit trouvé avec les critères sélectionnés.
          </p>
        </div>
      ) : (
        <div>
          {pagination && (
            <div style={{ 
              marginBottom: "15px", 
              padding: "10px", 
              backgroundColor: "#e9ecef", 
              borderRadius: "4px",
              fontSize: "14px",
              color: "#495057"
            }}>
              <strong>Résultats :</strong> {pagination.from} à {pagination.to} sur {pagination.total} produits
              {Object.keys(activeFilters).length > 0 && (
                <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                  (filtré)
                </span>
              )}
            </div>
          )}
          
          {/* Grille en deux colonnes avec classes CSS */}
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {/* En-tête du produit */}
                <div className="product-header">
                  <div style={{ flex: 1 }}>
                    <div className="product-name">
                      {product.name}
                    </div>
                    <div className="product-price">
                      {product.price}€
                    </div>
                  </div>
                </div>

                {/* Informations du produit */}
                <div className="product-info">
                  <div>
                    <strong>Ref:</strong> {product.reference}
                  </div>
                  <div>
                    <strong>Marque:</strong> {product.brand}
                  </div>
                  <div className="product-info-full">
                    <strong>Stock:</strong> 
                    <span className={product.quantity < 10 ? "stock-low" : "stock-normal"}>
                      {product.quantity}
                    </span>
                    {product.quantity < 10 && (
                      <span className="stock-warning">
                        (Stock faible)
                      </span>
                    )}
                  </div>
                </div>

                {/* Boutons d'action */}
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
        <EditProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
