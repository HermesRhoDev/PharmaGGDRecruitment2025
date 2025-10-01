"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getPublicProducts } from "App/server/publicProductActions";
import ProductCard from "App/components/ProductCard";
import SearchBar from "App/components/SearchBar";
import ProductFilters from "App/components/ProductFilters";
import PublicPagination from "App/components/PublicPagination";
import Link from 'next/link';
import { useProductFiltersState } from "App/lib/useUrlState";
import { usePaginationState } from "App/lib/usePaginationState";

export default function ProductsPage() {
  // État persistant dans l'URL
  const [urlState, updateUrlState, resetUrlState] = useProductFiltersState();
  
  // Gestion de la pagination
  const pagination = usePaginationState(urlState, updateUrlState);
  
  // État local pour les données
  const [products, setProducts] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extraction des filtres pour l'API (sans page et per_page) - MEMOIZED
  const apiFilters = useMemo(() => ({
    search: urlState.search,
    brand: urlState.brand,
    min_price: urlState.min_price,
    max_price: urlState.max_price,
    sort_by: urlState.sort_by,
    sort_order: urlState.sort_order
  }), [
    urlState.search,
    urlState.brand,
    urlState.min_price,
    urlState.max_price,
    urlState.sort_by,
    urlState.sort_order
  ]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getPublicProducts(
        pagination.currentPage, 
        pagination.perPage, 
        apiFilters
      );
      
      if (result.success) {
        setProducts(result.data);
        setPaginationData(result.pagination);
        setFilters(result.filters);
      } else {
        setError(result.error || "Erreur lors du chargement des produits");
      }
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.perPage, apiFilters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handlers pour les composants enfants - MEMOIZED
  const handleSearch = useCallback((search) => {
    updateUrlState({ search, page: 1 });
  }, [updateUrlState]);

  const handleFiltersChange = useCallback((newFilters) => {
    updateUrlState({ ...newFilters, page: 1 });
  }, [updateUrlState]);

  return (
    <div className="products-page">
      {/* Header */}
      <header className="products-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              <h1>PharmaGDD</h1>
            </Link>
            <nav className="main-nav">
              <Link href="/" className="nav-link">Accueil</Link>
              <Link href="/products" className="nav-link active">Produits</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="products-main">
        <div className="container">
          <div className="products-content">
            <div className="products-header-section">
              <h2>Catalogue des produits</h2>
              <p>Découvrez notre gamme complète de produits pharmaceutiques</p>
            </div>

            {/* Barre de recherche */}
            <div className="search-section">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Rechercher par nom, marque ou référence..."
                initialValue={urlState.search}
              />
            </div>

            {/* Filtres */}
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              appliedFilters={apiFilters}
            />

            {/* Résultats */}
            {loading ? (
              <div className="loading-section">
                <div className="loading-spinner"></div>
                <p>Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="error-section">
                <p className="error-message">{error}</p>
                <button onClick={loadProducts} className="retry-button">
                  Réessayer
                </button>
              </div>
            ) : (
              <>
                {products.length > 0 ? (
                  <>
                    <div className="products-grid">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    <PublicPagination
                      pagination={paginationData}
                      onPageChange={pagination.handlePageChange}
                      onPerPageChange={pagination.handlePerPageChange}
                    />
                  </>
                ) : (
                  <div className="no-products">
                    <div className="no-products-icon">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche ou vos filtres.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}