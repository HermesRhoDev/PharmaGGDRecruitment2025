"use client"

import { useState } from "react"
import 'App/styles/auth.scss'
import { adminAuth } from "App/server/adminAuth"
import { redirect } from "next/navigation"

export default function AdminLoginPage() {
	const [email, setEmail] = useState("admin@pharma-gdd.com")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setError("")

		try {
			const result = await adminAuth(email, password)

			if (result?.error) {
				setError("Email ou mot de passe incorrect")
			} else {
				// Redirection sera gérée par le middleware
				redirect("/admin/dashboard")
			}
		} catch (err) {
			setError("Erreur de connexion")
			console.error("Erreur login admin:", err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="login-page admin">
			<div className="login-container">
				<div className="login-card">
					<div className="login-header">
						<h1 className="login-title admin">
							Connexion Administrateur
						</h1>
						<p className="login-subtitle admin">
							Accès réservé aux administrateurs
						</p>
					</div>

					<form className="login-form" onSubmit={handleSubmit}>
						{error && (
							<div className="error-message">
								{error}
							</div>
						)}

						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="password">Mot de passe</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="form-input"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="submit-button admin"
						>
							{isLoading ? "Connexion..." : "Se connecter"}
						</button>

						<div className="login-footer">
							<a href="/" className="back-link admin">
								← Retour à l'accueil
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}