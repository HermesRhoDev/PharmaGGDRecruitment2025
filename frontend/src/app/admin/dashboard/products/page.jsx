"use client";

import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "App/server/productActions";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      
      if (result.success) {
        setProducts(result.data);
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
        // Supprimer le produit de la liste locale
        setProducts(products.filter(product => product.id !== productId));
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
          <p>Nombre de produits: {products.length}</p>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
