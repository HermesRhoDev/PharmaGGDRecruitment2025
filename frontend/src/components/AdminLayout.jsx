"use client";

import { adminLogout } from "App/server/adminAuth";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = "/admin";
  };

  return (
    <div className="dashboard-page admin">
      {/* Header with navigation menu */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            <Link href="/admin/dashboard">
              Dashboard Administrateur
            </Link>
          </h1>
          
          <nav className="dashboard-nav">
            <Link 
              href="/admin/dashboard" 
              className={`nav-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}
            >
              Accueil
            </Link>
            <Link 
              href="/admin/dashboard/products" 
              className={`nav-link ${pathname.startsWith('/admin/dashboard/products') ? 'active' : ''}`}
            >
              Produits
            </Link>
          </nav>

          <div className="dashboard-user-section">
            <button
              onClick={handleLogout}
              className="logout-button admin"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}