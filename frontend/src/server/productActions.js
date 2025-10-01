"use server"

import { adminAuth } from "App/lib/auth-admin"

export async function getProducts(page = 1, perPage = 10, filters = {}) {
    try {
        // Récupérer la session admin
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        const url = new URL(`${process.env.BACKEND_URL}/admin/products`)
        url.searchParams.append('page', page.toString())
        url.searchParams.append('per_page', perPage.toString())
        
        // Ajouter les filtres à l'URL
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.append(key, value.toString())
            }
        })

        const response = await fetch(url.toString(), {
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
        // Retourner les produits, les informations de pagination et les filtres
        return { 
            success: true, 
            data: data.products,
            pagination: data.pagination,
            filters: data.filters
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function deleteProduct(productId) {
    try {
        // Récupérer la session admin
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        const response = await fetch(`${process.env.BACKEND_URL}/admin/products/${productId}`, {
            method: "DELETE",
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
        return { success: true, message: data.message }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updateProduct(productId, productData) {
    try {
        // Récupérer la session admin
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        console.log("=== DEBUG UPDATE PRODUCT ===")
        console.log("Product ID:", productId)
        console.log("Product Data:", productData)
        console.log("URL:", `${process.env.BACKEND_URL}/admin/products/${productId}`)
        console.log("Token:", session.user.laravelAccessToken ? "Present" : "Missing")

        // Déterminer le type de contenu et les headers
        const isFormData = productData instanceof FormData;
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${session.user.laravelAccessToken}`,
        };

        let body;
        let method;

        if (isFormData) {
            // Pour FormData, utiliser POST avec _method=PUT
            productData.append('_method', 'PUT');
            body = productData;
            method = "POST";
            // Ne pas ajouter Content-Type pour FormData
        } else {
            // Pour JSON, utiliser PUT normal
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(productData);
            method = "PUT";
        }

        const response = await fetch(`${process.env.BACKEND_URL}/admin/products/${productId}`, {
            method: method,
            headers: headers,
            body: body,
        })

        console.log("Response Status:", response.status)
        console.log("Response Headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
            const errorText = await response.text()
            console.error("=== ERROR RESPONSE ===")
            console.error("Status:", response.status)
            console.error("Status Text:", response.statusText)
            console.error("Error Body:", errorText)
            
            // Essayer de parser le JSON d'erreur
            try {
                const errorJson = JSON.parse(errorText)
                throw new Error(`Erreur ${response.status}: ${JSON.stringify(errorJson, null, 2)}`)
            } catch (parseError) {
                throw new Error(`Erreur ${response.status}: ${errorText}`)
            }
        }

        const data = await response.json()
        console.log("=== SUCCESS RESPONSE ===")
        console.log("Response Data:", data)
        
        return { success: true, data: data.product }
    } catch (error) {
        console.error("=== UPDATE PRODUCT ERROR ===")
        console.error("Error:", error)
        return { success: false, error: error.message }
    }
}