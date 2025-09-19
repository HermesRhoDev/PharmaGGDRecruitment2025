import Credentials from "next-auth/providers/credentials"

export const adminAuthConfig = {
	secret: process.env.NEXTAUTH_SECRET,
	basePath: "/api/admin/auth",
	session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 365 }, // 365j
	cookies: {
		// cookie distinct pour le flux admin
		sessionToken: {
			name: "admin.session-token",
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production"
			}
		}
	},
	providers: [
		Credentials({
			id: "laravel-admin",
			name: "Email & Password",
			credentials: { email: {}, password: {} },
			async authorize(credentials) {
				const res = await fetch(`${process.env.BACKEND_URL}/admin/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password
					})
				})
				if (!res.ok) return null
				const data = await res.json()
				return {
					id: data.admin.id.toString(),
					name: data.admin.name,
					email: data.admin.email,
					laravelAccessToken: data.token,
					userType: 'admin',
					role: data.admin.role,
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role
				token.userType = user.userType
				token.laravelAccessToken = user.laravelAccessToken
			}
			return token
		},
		async session({ session, token }) {
			session.user.role = token.role
			session.user.userType = token.userType
			session.user.laravelAccessToken = token.laravelAccessToken
			return session
		},
		// Utilisé par le middleware pour protéger les routes admin
		authorized: async ({ auth }) => !!auth && auth.user?.userType === "admin"
	},
	events: {
		signOut: async ({ token }) => {
			if (token?.laravelAccessToken) {
				try {
					await fetch(`${process.env.BACKEND_URL}/admin/logout`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token.laravelAccessToken}`,
							"Content-Type": "application/json"
						}
					})

					return true
				} catch (err) {
					console.error("Erreur logout Laravel :", err)
				}
			}
		}
	}
}
