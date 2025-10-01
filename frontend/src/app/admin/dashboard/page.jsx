"use client";

import AdminLayout from "../../../components/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="dashboard-content">
        <h2 className="dashboard-section-title">
          Bienvenue dans le dashboard administrateur
        </h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Gestion des produits</h3>
            <div className="card-content">
              <p>Gérez votre catalogue de produits pharmaceutiques</p>
              <div className="action-list">
                <li>
                  <a
                    href="/admin/dashboard/products"
                    className="card-button admin">
                    Voir tous les produits
                  </a>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
