"use server"

import { adminAuth } from "App/lib/auth-admin"

export async function getProducts() {
    try {
        // Récupérer la session admin
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        const response = await fetch(`${process.env.BACKEND_URL}/admin/products`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${session.user.laravelAccessToken}`,
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erreur ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        // Extraire le tableau products de la réponse
        return { success: true, data: data.products }
    } catch (error) {
        return { success: false, error: error.message }
    }
}