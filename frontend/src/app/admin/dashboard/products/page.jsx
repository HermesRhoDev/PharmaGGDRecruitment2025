"use client";

import { useState, useEffect } from "react";
import { getProducts, deleteProduct, updateProduct } from "App/server/productActions";
import EditProductForm from "./EditProductForm";
import Pagination from "./Pagination";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchProducts(currentPage, perPage);
  }, [currentPage, perPage]);

  const fetchProducts = async (page = 1, itemsPerPage = 10) => {
    setLoading(true);
    try {
      const result = await getProducts(page, itemsPerPage);
      
      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
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
        await fetchProducts(currentPage, perPage);
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
    
    console.log("=== CLIENT SIDE DEBUG ===");
    console.log("Editing Product:", editingProduct);
    console.log("Form Data:", productData);
    
    try {
      const result = await updateProduct(editingProduct.id, productData);
      
      console.log("Update Result:", result);
      
      if (result.success) {
        // Recharger la page actuelle après modification
        await fetchProducts(currentPage, perPage);
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

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des Produits</h1>

      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div>
          {pagination && (
            <p>
              Affichage de {pagination.from} à {pagination.to} sur {pagination.total} produits
            </p>
          )}
          
          <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
            {products.map((product) => (
              <div 
                key={product.id} 
                style={{ 
                  border: "1px solid #ddd", 
                  padding: "15px", 
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{product.name}</strong> - {product.price}€
                  <br />
                  <small>
                    Ref: {product.reference} | Marque: {product.brand} | Stock: {product.quantity}
                  </small>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleEditProduct(product)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    disabled={deletingId === product.id}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: deletingId === product.id ? "not-allowed" : "pointer",
                      opacity: deletingId === product.id ? 0.6 : 1
                    }}
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
