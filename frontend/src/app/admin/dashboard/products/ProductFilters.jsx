"use client";

import { useState, useEffect } from "react";

export default function ProductFilters({ filters, onFiltersChange, onReset }) {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    brand: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    min_price: '',
    max_price: '',
    min_quantity: '',
    max_quantity: ''
  });

  // Function to ensure that values are always strings
  const ensureStringValue = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  // Update local filters when applied filters change
  useEffect(() => {
    if (filters?.applied_filters) {
      const safeFilters = {};
      Object.entries(filters.applied_filters).forEach(([key, value]) => {
        safeFilters[key] = ensureStringValue(value);
      });
      
      setLocalFilters(prev => ({
        ...prev,
        ...safeFilters
      }));
    }
  }, [filters]);

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: ensureStringValue(value)
    }));
  };

  const handleApplyFilters = () => {
    // Clean empty values
    const cleanFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      const cleanValue = ensureStringValue(value);
      if (cleanValue !== '') {
        acc[key] = cleanValue;
      }
      return acc;
    }, {});
    
    onFiltersChange(cleanFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      brand: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      min_price: '',
      max_price: '',
      min_quantity: '',
      max_quantity: ''
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="product-filters">
      <h3 className="product-filters__title">Filtres et Recherche</h3>
      
      <div className="product-filters__grid">
        {/* Search */}
        <div className="product-filters__field">
          <label className="product-filters__label">
            Recherche (nom, marque, référence)
          </label>
          <input
            type="text"
            className="product-filters__input"
            value={ensureStringValue(localFilters.search)}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez pour rechercher..."
          />
        </div>

        {/* Brand Filter */}
        <div className="product-filters__field">
          <label className="product-filters__label">
            Marque
          </label>
          <select
            className="product-filters__select"
            value={ensureStringValue(localFilters.brand)}
            onChange={(e) => handleInputChange('brand', e.target.value)}
          >
            <option value="">Toutes les marques</option>
            {filters?.brands?.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div className="product-filters__field">
          <label className="product-filters__label">
            Trier par
          </label>
          <div className="product-filters__sort">
            <select
              className="product-filters__select"
              value={ensureStringValue(localFilters.sort_by)}
              onChange={(e) => handleInputChange('sort_by', e.target.value)}
            >
              <option value="created_at">Date de création</option>
              <option value="name">Nom</option>
              <option value="price">Prix</option>
              <option value="reference">Référence</option>
              <option value="brand">Marque</option>
              <option value="quantity">Stock</option>
            </select>
            <select
              className="product-filters__select"
              value={ensureStringValue(localFilters.sort_order)}
              onChange={(e) => handleInputChange('sort_order', e.target.value)}
            >
              <option value="desc">↓ Desc</option>
              <option value="asc">↑ Asc</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="product-filters__field">
          <label className="product-filters__label">
            Prix (€)
          </label>
          <div className="product-filters__range">
            <input
              type="number"
              step="0.01"
              value={ensureStringValue(localFilters.min_price)}
              onChange={(e) => handleInputChange('min_price', e.target.value)}
              placeholder="Min"
            />
            <span>à</span>
            <input
              type="number"
              step="0.01"
              value={ensureStringValue(localFilters.max_price)}
              onChange={(e) => handleInputChange('max_price', e.target.value)}
              placeholder="Max"
            />
          </div>
        </div>

        {/* Quantity Range */}
        <div className="product-filters__field">
          <label className="product-filters__label">
            Stock
          </label>
          <div className="product-filters__range">
            <input
              type="number"
              value={ensureStringValue(localFilters.min_quantity)}
              onChange={(e) => handleInputChange('min_quantity', e.target.value)}
              placeholder="Min"
            />
            <span>à</span>
            <input
              type="number"
              value={ensureStringValue(localFilters.max_quantity)}
              onChange={(e) => handleInputChange('max_quantity', e.target.value)}
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-filters__actions">
        <button
          onClick={handleApplyFilters}
          className="product-filters__btn product-filters__btn--primary"
        >
          Appliquer les filtres
        </button>
        <button
          onClick={handleReset}
          className="product-filters__btn product-filters__btn--secondary"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}