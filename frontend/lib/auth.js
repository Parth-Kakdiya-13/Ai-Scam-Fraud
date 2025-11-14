// Frontend utility to attach JWT token to API requests
export function getAuthHeader() {
    if (typeof window === 'undefined') return {}
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function authenticatedFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
    }

    const response = await fetch(url, {
        ...options,
        headers,
    })

    if (response.status === 401) {
        // Token expired or invalid - clear localStorage and redirect
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            window.location.href = '/signin'
        }
    }

    return response
}

export function isAuthenticated() {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
}

export function logout() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    window.location.href = '/signin'
}
