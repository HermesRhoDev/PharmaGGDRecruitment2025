"use client";

export default function Pagination({ pagination, onPageChange, onPerPageChange }) {
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

  const pageNumbers = generatePageNumbers();

  return (
    <div className="admin-pagination">
      <div className="admin-pagination__info">
        Affichage de {from} à {to} sur {total} produits
      </div>

      <div className="admin-pagination__controls">
        <div className="admin-pagination__per-page">
          <span className="per-page-label">Par page:</span>
          <select
            value={per_page}
            onChange={(e) => onPerPageChange(parseInt(e.target.value))}
            className="per-page-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="admin-pagination__buttons">
          <button
            onClick={() => onPageChange(1)}
            disabled={current_page === 1}
            className={`admin-pagination__button ${current_page === 1 ? "is-disabled" : ""} admin-pagination__button--nav`}
          >
            ««
          </button>

          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
            className={`admin-pagination__button ${current_page === 1 ? "is-disabled" : ""} admin-pagination__button--nav`}
          >
            ‹
          </button>

          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`admin-pagination__button ${pageNum === current_page ? "is-active" : ""}`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === last_page}
            className={`admin-pagination__button ${current_page === last_page ? "is-disabled" : ""} admin-pagination__button--nav`}
          >
            ›
          </button>

          <button
            onClick={() => onPageChange(last_page)}
            disabled={current_page === last_page}
            className={`admin-pagination__button ${current_page === last_page ? "is-disabled" : ""} admin-pagination__button--nav`}
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}