import Credentials from "next-auth/providers/credentials"

export const clientAuthConfig = {
	secret: process.env.NEXTAUTH_SECRET,
	basePath: "/api/client/auth",
	session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 365 }, // 365j
	cookies: {
		// cookie distinct pour le flux client
		sessionToken: {
			name: "client.session-token",
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
			id: "laravel-client",
			name: "Email & Password",
			credentials: { email: {}, password: {} },
			async authorize(credentials) {
				const res = await fetch(`${process.env.BACKEND_URL}/user/auth/login`, {
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
					id: data.user.id.toString(),
					name: data.user.name,
					email: data.user.email,
					laravelAccessToken: data.token,
					userType: 'user',
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.userType = user.userType
				token.laravelAccessToken = user.laravelAccessToken
			}
			return token
		},
		async session({ session, token }) {
			session.user.userType = token.userType
			session.user.laravelAccessToken = token.laravelAccessToken
			return session
		},
		// Utilisé par le middleware pour protéger les routes client
		authorized: async ({ auth }) => !!auth && auth.user?.userType === "user"
	},
	events: {
		signOut: async ({ token }) => {
			if (token?.laravelAccessToken) {
				try {
					await fetch(`${process.env.BACKEND_URL}/user/logout`, {
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
