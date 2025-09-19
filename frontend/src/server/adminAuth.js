"use server"

import { adminSignIn, adminSignOut } from "App/lib/auth-admin"

export async function adminAuth(email, password) {
    const result = await adminSignIn("laravel-admin", {
        email,
        password,
        redirectTo: "/admin/dashboard",
    })

    return result
}

export async function adminLogout() {
    await adminSignOut({ redirectTo: "/admin" })
}