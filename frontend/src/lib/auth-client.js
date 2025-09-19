import NextAuth from "next-auth"
import { clientAuthConfig } from "./auth-client.config.js"

export const { auth: clientAuth, signIn: clientSignIn, signOut: clientSignOut } = NextAuth(clientAuthConfig)