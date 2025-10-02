"use client";

import { useCallback } from 'react';

/**
 * Hook for managing pagination state
 * 
 * @param {Object} state - Current state
 * @param {Function} updateState - State update function
 * @returns {Object} Pagination state management functions
 */
export function usePaginationState(state, updateState) {
  
  const handlePageChange = useCallback((page) => {
    updateState({ page });
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateState]);

  const handlePerPageChange = useCallback((per_page) => {
    updateState({ 
      per_page,
      page: 1
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