const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function getVenue(vid: string) {
    const response = await fetch(
        `${API_URL}/api/v1/restaurants/${vid}`
    )
    if (!response.ok) {
        throw new Error("Failed to fetch restaurant")
    }
    return await response.json()
}