"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Hook personnalisé pour gérer l'état dans les URL Search Params
 * Suit le principe de responsabilité unique (SRP) - gère uniquement la synchronisation URL/état
 * Suit le principe ouvert/fermé (OCP) - extensible via la configuration
 * 
 * @param {Object} defaultState - État par défaut
 * @param {Object} config - Configuration optionnelle
 * @returns {Array} [state, setState, resetState]
 */
export function useUrlState(defaultState = {}, config = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const {
    // Transformateurs pour encoder/décoder les valeurs
    serializers = {},
    deserializers = {},
    // Clés à exclure de l'URL (pour des données sensibles)
    excludeFromUrl = [],
    // Debounce pour éviter trop de mises à jour d'URL
    debounceMs = 100
  } = config;

  // État local synchronisé avec l'URL
  const [state, setState] = useState(() => {
    return initializeStateFromUrl(searchParams, defaultState, deserializers);
  });

  // Utiliser useRef pour le timeout pour éviter les re-renders
  const updateTimeoutRef = useRef(null);

  /**
   * Initialise l'état depuis les paramètres URL
   */
  function initializeStateFromUrl(searchParams, defaultState, deserializers) {
    const urlState = { ...defaultState };
    
    for (const [key, defaultValue] of Object.entries(defaultState)) {
      const urlValue = searchParams.get(key);
      
      if (urlValue !== null) {
        // Utilise un désérialiseur personnalisé si disponible
        if (deserializers[key]) {
          urlState[key] = deserializers[key](urlValue);
        } else {
          // Désérialisation automatique basée sur le type par défaut
          urlState[key] = deserializeValue(urlValue, defaultValue);
        }
      }
    }
    
    return urlState;
  }

  /**
   * Désérialise une valeur selon son type
   */
  function deserializeValue(value, defaultValue) {
    if (typeof defaultValue === 'number') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    if (typeof defaultValue === 'boolean') {
      return value === 'true';
    }
    return value;
  }

  /**
   * Sérialise une valeur pour l'URL
   */
  function serializeValue(key, value) {
    if (serializers[key]) {
      return serializers[key](value);
    }
    return String(value);
  }

  /**
   * Met à jour l'URL avec le nouvel état
   */
  const updateUrl = useCallback((newState) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      
      for (const [key, value] of Object.entries(newState)) {
        // Exclut les clés spécifiées et les valeurs vides/par défaut
        if (
          !excludeFromUrl.includes(key) &&
          value !== '' &&
          value !== null &&
          value !== undefined &&
          value !== defaultState[key]
        ) {
          params.set(key, serializeValue(key, value));
        }
      }

      const newUrl = params.toString() 
        ? `${pathname}?${params.toString()}`
        : pathname;
      
      router.replace(newUrl, { scroll: false });
    }, debounceMs);
  }, [pathname, router, excludeFromUrl, serializers, debounceMs]);

  /**
   * Met à jour l'état et l'URL
   */
  const updateState = useCallback((updates) => {
    setState(prevState => {
      const newState = typeof updates === 'function' 
        ? updates(prevState)
        : { ...prevState, ...updates };
      
      updateUrl(newState);
      return newState;
    });
  }, [updateUrl]);

  /**
   * Remet l'état aux valeurs par défaut
   */
  const resetState = useCallback(() => {
    setState(defaultState);
    router.replace(pathname, { scroll: false });
  }, [defaultState, pathname, router]);

  // Synchronise l'état quand les paramètres URL changent (navigation navigateur)
  useEffect(() => {
    const newState = initializeStateFromUrl(searchParams, defaultState, deserializers);
    setState(newState);
  }, [searchParams]);

  // Cleanup du timeout
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return [state, updateState, resetState];
}

// Constantes pour éviter les re-créations
const DEFAULT_FILTERS = {
  search: '',
  brand: '',
  min_price: '',
  max_price: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  page: 1,
  per_page: 12
};

const FILTERS_CONFIG = {
  deserializers: {
    page: (value) => Math.max(1, parseInt(value, 10) || 1),
    per_page: (value) => {
      const parsed = parseInt(value, 10);
      return [12, 24, 48].includes(parsed) ? parsed : 12;
    }
  },
  debounceMs: 300
};

/**
 * Hook spécialisé pour les filtres de produits
 * Suit le principe de substitution de Liskov (LSP) - peut remplacer useUrlState
 */
export function useProductFiltersState() {
  return useUrlState(DEFAULT_FILTERS, FILTERS_CONFIG);
}