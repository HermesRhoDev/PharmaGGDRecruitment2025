"use server"

import { adminAuth } from "App/lib/auth-admin"

export async function getProducts(page = 1, perPage = 10, filters = {}) {
    try {
        // Get admin session
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        const url = new URL(`${process.env.BACKEND_URL}/admin/products`)
        url.searchParams.append('page', page.toString())
        url.searchParams.append('per_page', perPage.toString())
        
        // Add filters to URL
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
        // Return products, pagination info, and filters    
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
        // Get admin session
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
        // Get admin session
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        // Determine content type and headers
        const isFormData = productData instanceof FormData;
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${session.user.laravelAccessToken}`,
        };

        let body;
        let method;

        if (isFormData) {
            // FormData: use POST with _method=PUT
            productData.append('_method', 'PUT');
            body = productData;
            method = "POST";
        } else {
            // JSON: use normal PUT
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(productData);
            method = "PUT";
        }

        const response = await fetch(`${process.env.BACKEND_URL}/admin/products/${productId}`, {
            method: method,
            headers: headers,
            body: body,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("=== ERROR RESPONSE ===")
            console.error("Status:", response.status)
            console.error("Status Text:", response.statusText)
            console.error("Error Body:", errorText)
            
            // Try to parse JSON error body
            try {
                const errorJson = JSON.parse(errorText)
                throw new Error(`Erreur ${response.status}: ${JSON.stringify(errorJson, null, 2)}`)
            } catch (parseError) {
                throw new Error(`Erreur ${response.status}: ${errorText}`)
            }
        }

        const data = await response.json()

        return { success: true, data: data.product }
    } catch (error) {
        console.error("=== UPDATE PRODUCT ERROR ===")
        console.error("Error:", error)
        return { success: false, error: error.message }
    }
}

export async function createProduct(productData) {
    try {
        // Get admin session
        const session = await adminAuth()
        
        if (!session || !session.user?.laravelAccessToken) {
            throw new Error("Non authentifié")
        }

        // Determine content type and headers   
        const isFormData = productData instanceof FormData;
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${session.user.laravelAccessToken}`,
        };

        let body;

        if (isFormData) {
            // FormData: don't add Content-Type
            body = productData;
        } else {
            // JSON: use normal POST
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(productData);
        }

        const response = await fetch(`${process.env.BACKEND_URL}/admin/products`, {
            method: "POST",
            headers: headers,
            body: body,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("=== ERROR RESPONSE ===")
            console.error("Status:", response.status)
            console.error("Status Text:", response.statusText)
            console.error("Error Body:", errorText)
            
            // Try to parse JSON error body
            try {
                const errorJson = JSON.parse(errorText)
                throw new Error(`Erreur ${response.status}: ${JSON.stringify(errorJson, null, 2)}`)
            } catch (parseError) {
                throw new Error(`Erreur ${response.status}: ${errorText}`)
            }
        }

        const data = await response.json()
        
        return { success: true, data: data.product }
    } catch (error) {
        console.error("=== CREATE PRODUCT ERROR ===")
        console.error("Error:", error)
        return { success: false, error: error.message }
    }
}