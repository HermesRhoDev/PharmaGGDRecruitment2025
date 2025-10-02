"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Custom hook for managing state in URL Search Params
 * 
 * @param {Object} defaultState - Default state
 * @param {Object} config - Optional configuration
 * @returns {Array} [state, setState, resetState]
 */
export function useUrlState(defaultState = {}, config = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const {
    // Transformers for encoding/decoding values
    serializers = {},
    deserializers = {},
    // Keys to exclude from URL (for sensitive data)
    excludeFromUrl = [],
    // Debounce to avoid too many URL updates
    debounceMs = 100
  } = config;

  // Local state synchronized with URL
  const [state, setState] = useState(() => {
    return initializeStateFromUrl(searchParams, defaultState, deserializers);
  });

  // Use ref to store timeout for debouncing URL updates
  const updateTimeoutRef = useRef(null);

  /**
   * Initializes state from URL search params
   */
  function initializeStateFromUrl(searchParams, defaultState, deserializers) {
    const urlState = { ...defaultState };
    
    for (const [key, defaultValue] of Object.entries(defaultState)) {
      const urlValue = searchParams.get(key);
      
      if (urlValue !== null) {
        // Use custom deserializer if available
        if (deserializers[key]) {
          urlState[key] = deserializers[key](urlValue);
        } else {
          // Automatic deserialization based on default type
          urlState[key] = deserializeValue(urlValue, defaultValue);
        }
      }
    }
    
    return urlState;
  }

  /**
   * Deserializes a value based on its type
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
   * Serializes a value for URL
   */
  function serializeValue(key, value) {
    if (serializers[key]) {
      return serializers[key](value);
    }
    return String(value);
  }

  /**
   * Updates URL with new state 
   */
  const updateUrl = useCallback((newState) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      
      for (const [key, value] of Object.entries(newState)) {
        // Exclude specified keys and default/empty values
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
   * Updates state and URL with new values  
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
   * Resets state to default values
   */
  const resetState = useCallback(() => {
    setState(defaultState);
    router.replace(pathname, { scroll: false });
  }, [defaultState, pathname, router]);

  // Synchronizes state when URL search params change (browser navigation)
  useEffect(() => {
    const newState = initializeStateFromUrl(searchParams, defaultState, deserializers);
    setState(newState);
  }, [searchParams]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return [state, updateState, resetState];
}

// Constants to avoid re-creation on each render
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
 * Specialized hook for product filters state
 */
export function useProductFiltersState() {
  return useUrlState(DEFAULT_FILTERS, FILTERS_CONFIG);
}