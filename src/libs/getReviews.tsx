const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function getReviews(vid: string, token?: string) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const response = await fetch(
        `${API_URL}/api/v1/restaurants/${vid}/reviews`,
        { headers, cache: "no-store" }
    )
    if (!response.ok) return { data: [] }
    return await response.json()
}