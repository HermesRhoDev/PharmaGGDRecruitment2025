import NextAuth from "next-auth"
import { adminAuthConfig } from "./auth-admin.config.js"

export const { auth: adminAuth, signIn: adminSignIn, signOut: adminSignOut } = NextAuth(adminAuthConfig)