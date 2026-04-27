const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function getVenues() {
    const response = await fetch(`${API_URL}/api/v1/restaurants`)
    if (!response.ok) {
        throw new Error("Failed to fetch restaurants")
    }
    return await response.json()
}