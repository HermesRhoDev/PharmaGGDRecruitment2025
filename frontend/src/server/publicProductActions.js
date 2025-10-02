"use server"

export async function getPublicProducts(page = 1, perPage = 12, filters = {}) {
    try {
        const url = new URL(`${process.env.BACKEND_URL}/products`)
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
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erreur ${response.status}: ${errorText}`)
        }

        const data = await response.json()
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

export async function getPublicProduct(productId) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/products/${productId}`, {
            headers: {
                Accept: "application/json",
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erreur ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        return { 
            success: true, 
            data: data.product
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function getRelatedProducts(productId) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/products/${productId}/related`, {
            headers: {
                Accept: "application/json",
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erreur ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        return { 
            success: true, 
            data: data.products
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}