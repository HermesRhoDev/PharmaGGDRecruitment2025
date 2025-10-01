"use client";

import { useState, useEffect, useCallback } from 'react';

export default function SearchBar({ 
  onSearch, 
  placeholder = "Rechercher des produits...", 
  initialValue = "",
  debounceMs = 300,
  enableLiveSearch = true 
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!enableLiveSearch) return;

    const timeoutId = setTimeout(() => {
      if (searchTerm !== initialValue) {
        setIsSearching(true);
        onSearch(searchTerm);
        // Simuler un petit délai pour l'indicateur de chargement
        setTimeout(() => setIsSearching(false), 200);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch, debounceMs, enableLiveSearch, initialValue]);

  // Synchroniser avec la valeur initiale
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enableLiveSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onSearch("");
  }, [onSearch]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Si la recherche en direct est désactivée, ne pas déclencher automatiquement
    if (!enableLiveSearch) return;
    
    // Si l'utilisateur efface complètement, rechercher immédiatement
    if (value === "") {
      onSearch("");
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }, [onSearch, enableLiveSearch]);

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
        />
        
        {/* Indicateur de recherche en cours */}
        {isSearching && enableLiveSearch && (
          <div className="search-loading-indicator">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="search-spinner"
            >
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeDasharray="31.416" 
                strokeDashoffset="31.416"
              >
                <animate 
                  attributeName="stroke-dasharray" 
                  dur="2s" 
                  values="0 31.416;15.708 15.708;0 31.416;0 31.416" 
                  repeatCount="indefinite"
                />
                <animate 
                  attributeName="stroke-dashoffset" 
                  dur="2s" 
                  values="0;-15.708;-31.416;-31.416" 
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
        
        {/* Bouton d'effacement */}
        {searchTerm && !isSearching && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            aria-label="Effacer la recherche"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Bouton de recherche - optionnel si recherche en direct activée */}
      {!enableLiveSearch && (
        <button type="submit" className="search-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Rechercher
        </button>
      )}
    </form>
  );
}