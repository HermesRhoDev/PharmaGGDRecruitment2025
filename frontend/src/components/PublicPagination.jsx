"use client";

export default function PublicPagination({ pagination, onPageChange, onPerPageChange }) {
  const { current_page, last_page, per_page, total, from, to } = pagination;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pages = generatePageNumbers();

  if (last_page <= 1) {
    return null;
  }

  return (
    <div className="public-pagination">
      <div className="pagination-info">
        <span>
          Affichage de {from} à {to} sur {total} produits
        </span>
      </div>

      <div className="pagination-controls">
        {/* Bouton précédent */}
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="pagination-button prev"
          aria-label="Page précédente"
        >
          ‹
        </button>

        {/* Première page */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="pagination-button"
            >
              1
            </button>
            {pages[0] > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {/* Pages visibles */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pagination-button ${page === current_page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        {/* Dernière page */}
        {pages[pages.length - 1] < last_page && (
          <>
            {pages[pages.length - 1] < last_page - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              onClick={() => onPageChange(last_page)}
              className="pagination-button"
            >
              {last_page}
            </button>
          </>
        )}

        {/* Bouton suivant */}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="pagination-button next"
          aria-label="Page suivante"
        >
          ›
        </button>
      </div>

      <div className="pagination-per-page">
        <label htmlFor="per-page">Produits par page:</label>
        <select
          id="per-page"
          value={per_page}
          onChange={(e) => onPerPageChange(parseInt(e.target.value))}
          className="per-page-select"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>
    </div>
  );
}