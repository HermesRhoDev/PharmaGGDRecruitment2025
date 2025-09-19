import { adminAuth } from "./lib/auth-admin"
import { clientAuth } from "./lib/auth-client"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default async function middleware(req) {
	const url = req.nextUrl.pathname

	// Routes autorisées sans auth
	const allowedPrefixes = [
		"/api/",
		"/_next/",
		"/favicon.ico",
		"/robots.txt"
	]

	if (allowedPrefixes.some((prefix) => url.startsWith(prefix))) {
		return NextResponse.next()
	}

	// === GESTION DES ROUTES ADMIN ===
	if (url.startsWith("/admin")) {
		const adminSession = await adminAuth()
		const adminToken = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			cookieName: "admin.session-token"
		})

		// Page de login admin
		if (url === "/admin" || url === "/admin/login") {
			if (adminToken?.laravelAccessToken) {
				// Vérifier si le token Laravel est encore valide
				try {
					const verify = await fetch(`${process.env.BACKEND_URL}/admin/auth/me`, {
						headers: { Authorization: `Bearer ${adminToken.laravelAccessToken}` }
					})

                    console.log(adminToken.laravelAccessToken)

					if (verify.ok) {
						// Token valide, rediriger vers dashboard
						return NextResponse.redirect(new URL("/admin/dashboard", req.url))
					}
				} catch (error) {
					console.error("Erreur vérification token admin:", error)
				}
			}
			// Pas de token valide, afficher la page de login
			return NextResponse.next()
		}

		// Routes protégées admin (dashboard, etc.)
		if (!adminSession || !adminToken?.laravelAccessToken) {
			return NextResponse.redirect(new URL("/admin", req.url))
		}

		// Vérifier la validité du token Laravel
		try {
			const verify = await fetch(`${process.env.BACKEND_URL}/admin/auth/me`, {
				headers: { Authorization: `Bearer ${adminToken.laravelAccessToken}` }
			})

			if (!verify.ok) {
				// Token expiré, supprimer la session et rediriger
				const redirectResponse = NextResponse.redirect(new URL("/admin", req.url))
				redirectResponse.cookies.delete("admin.session-token")
				return redirectResponse
			}
		} catch (error) {
			console.error("Erreur vérification token admin:", error)
			const redirectResponse = NextResponse.redirect(new URL("/admin", req.url))
			redirectResponse.cookies.delete("admin.session-token")
			return redirectResponse
		}

		return NextResponse.next()
	}

	// === GESTION DES ROUTES USER ===
	if (url.startsWith("/user")) {
		const clientSession = await clientAuth()
		const clientToken = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET,
			cookieName: "client.session-token"
		})

		// Page de login user
		if (url === "/user" || url === "/user/login") {
			if (clientToken?.laravelAccessToken) {
				// Vérifier si le token Laravel est encore valide
				try {
					const verify = await fetch(`${process.env.BACKEND_URL}/user/me`, {
						headers: { Authorization: `Bearer ${clientToken.laravelAccessToken}` }
					})

					if (verify.ok) {
						// Token valide, rediriger vers dashboard
						return NextResponse.redirect(new URL("/user/dashboard", req.url))
					}
				} catch (error) {
					console.error("Erreur vérification token user:", error)
				}
			}
			// Pas de token valide, afficher la page de login
			return NextResponse.next()
		}

		// Routes protégées user (dashboard, etc.)
		if (!clientSession || !clientToken?.laravelAccessToken) {
			return NextResponse.redirect(new URL("/user", req.url))
		}

		// Vérifier la validité du token Laravel
		try {
			const verify = await fetch(`${process.env.BACKEND_URL}/user/me`, {
				headers: { Authorization: `Bearer ${clientToken.laravelAccessToken}` }
			})

			if (!verify.ok) {
				// Token expiré, supprimer la session et rediriger
				const redirectResponse = NextResponse.redirect(new URL("/user", req.url))
				redirectResponse.cookies.delete("client.session-token")
				return redirectResponse
			}
		} catch (error) {
			console.error("Erreur vérification token user:", error)
			const redirectResponse = NextResponse.redirect(new URL("/user", req.url))
			redirectResponse.cookies.delete("client.session-token")
			return redirectResponse
		}

		return NextResponse.next()
	}

	// Routes publiques
	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}