"use client";

import { useCallback } from 'react';

/**
 * Hook pour gérer la logique de pagination
 * Suit le principe de responsabilité unique (SRP)
 * 
 * @param {Object} state - État actuel
 * @param {Function} updateState - Fonction de mise à jour de l'état
 * @returns {Object} Fonctions de gestion de la pagination
 */
export function usePaginationState(state, updateState) {
  
  const handlePageChange = useCallback((page) => {
    updateState({ page });
    // Scroll vers le haut pour une meilleure UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateState]);

  const handlePerPageChange = useCallback((per_page) => {
    updateState({ 
      per_page,
      page: 1 // Reset à la première page
    });
  }, [updateState]);

  const resetPagination = useCallback(() => {
    updateState({ page: 1 });
  }, [updateState]);

  return {
    currentPage: state.page,
    perPage: state.per_page,
    handlePageChange,
    handlePerPageChange,
    resetPagination
  };
}