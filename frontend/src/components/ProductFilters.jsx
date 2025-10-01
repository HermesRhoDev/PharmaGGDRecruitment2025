"use client";

import { useState, useEffect } from 'react';

export default function ProductFilters({ filters, onFiltersChange, appliedFilters }) {
  const [localFilters, setLocalFilters] = useState({
    brand: appliedFilters?.brand || '',
    min_price: appliedFilters?.min_price || '',
    max_price: appliedFilters?.max_price || '',
    sort_by: appliedFilters?.sort_by || 'created_at',
    sort_order: appliedFilters?.sort_order || 'desc'
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      brand: '',
      min_price: '',
      max_price: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.brand || localFilters.min_price || localFilters.max_price;

  return (
    <div className="product-filters">
      <div className="filters-header">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="filters-toggle"
        >
          <span>Filtres</span>
          {hasActiveFilters && <span className="active-filters-indicator">•</span>}
          <svg
            className={`filters-arrow ${isOpen ? 'open' : ''}`}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className={`filters-content ${isOpen ? 'open' : ''}`}>
        <div className="filters-grid">
          {/* Tri */}
          <div className="filter-group">
            <label htmlFor="sort_by">Trier par</label>
            <select
              id="sort_by"
              value={localFilters.sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              className="filter-select"
            >
              <option value="created_at">Date de création</option>
              <option value="name">Nom</option>
              <option value="price">Prix</option>
              <option value="brand">Marque</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort_order">Ordre</label>
            <select
              id="sort_order"
              value={localFilters.sort_order}
              onChange={(e) => handleFilterChange('sort_order', e.target.value)}
              className="filter-select"
            >
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
          </div>

          {/* Marque */}
          {filters?.brands && filters.brands.length > 0 && (
            <div className="filter-group">
              <label htmlFor="brand">Marque</label>
              <select
                id="brand"
                value={localFilters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="filter-select"
              >
                <option value="">Toutes les marques</option>
                {filters.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Prix */}
          <div className="filter-group">
            <label htmlFor="min_price">Prix minimum</label>
            <input
              type="number"
              id="min_price"
              value={localFilters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="max_price">Prix maximum</label>
            <input
              type="number"
              id="max_price"
              value={localFilters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              className="filter-input"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="filters-actions">
            <button onClick={handleClearFilters} className="clear-filters-button">
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}