"use client"

import { adminLogout } from "App/server/adminAuth"
import Link from 'next/link'
import 'App/styles/dashboard.scss'

export default function AdminDashboard() {
	const handleLogout = async () => {
		await adminLogout()
		window.location.href = "/admin"
	}

	return (
		<div className="dashboard-page admin">
			{/* Header */}
			<header className="dashboard-header">
				<div className="dashboard-header-content">
					<h1 className="dashboard-title">
						Dashboard Administrateur
					</h1>
					<div className="dashboard-products-section">
						<Link href="/admin/dashboard/products">
							Produits
						</Link>
					</div>
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
		</div>
	)
}