"use client";

import { useState, useEffect } from "react";
import { getProducts } from "App/server/productActions";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>Liste des Produits</h1>

      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div>
          <p>Nombre de produits: {products.length}</p>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong> - {product.price}€ (Ref:{" "}
                {product.reference}, Marque: {product.brand}, Stock:{" "}
                {product.quantity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
