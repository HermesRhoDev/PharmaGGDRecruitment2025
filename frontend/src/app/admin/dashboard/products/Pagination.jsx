"use client";

export default function Pagination({ pagination, onPageChange, onPerPageChange }) {
  const { current_page, last_page, per_page, total, from, to } = pagination;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);
    
    // Ajuster si on est près de la fin
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
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "5px"
    }}>
      {/* Informations sur les résultats */}
      <div style={{ fontSize: "14px", color: "#6c757d" }}>
        Affichage de {from} à {to} sur {total} produits
      </div>

      {/* Contrôles de pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Sélecteur du nombre d'éléments par page */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "14px" }}>Par page:</span>
          <select 
            value={per_page} 
            onChange={(e) => onPerPageChange(parseInt(e.target.value))}
            style={{
              padding: "4px 8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Boutons de navigation */}
        <div style={{ display: "flex", gap: "5px" }}>
          {/* Première page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={current_page === 1}
            style={{
              padding: "6px 12px",
              border: "1px solid #ddd",
              backgroundColor: current_page === 1 ? "#f8f9fa" : "white",
              color: current_page === 1 ? "#6c757d" : "#10a666",
              borderRadius: "4px",
              cursor: current_page === 1 ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            ««
          </button>

          {/* Page précédente */}
          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
            style={{
              padding: "6px 12px",
              border: "1px solid #ddd",
              backgroundColor: current_page === 1 ? "#f8f9fa" : "white",
              color: current_page === 1 ? "#6c757d" : "#10a666",
              borderRadius: "4px",
              cursor: current_page === 1 ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            ‹
          </button>

          {/* Numéros de page */}
          {pageNumbers.map(pageNum => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={{
                padding: "6px 12px",
                border: "1px solid #ddd",
                backgroundColor: pageNum === current_page ? "#10a666" : "white",
                color: pageNum === current_page ? "white" : "#10a666",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: pageNum === current_page ? "bold" : "normal"
              }}
            >
              {pageNum}
            </button>
          ))}

          {/* Page suivante */}
          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === last_page}
            style={{
              padding: "6px 12px",
              border: "1px solid #ddd",
              backgroundColor: current_page === last_page ? "#f8f9fa" : "white",
              color: current_page === last_page ? "#6c757d" : "#10a666",
              borderRadius: "4px",
              cursor: current_page === last_page ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            ›
          </button>

          {/* Dernière page */}
          <button
            onClick={() => onPageChange(last_page)}
            disabled={current_page === last_page}
            style={{
              padding: "6px 12px",
              border: "1px solid #ddd",
              backgroundColor: current_page === last_page ? "#f8f9fa" : "white",
              color: current_page === last_page ? "#6c757d" : "#10a666",
              borderRadius: "4px",
              cursor: current_page === last_page ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
}