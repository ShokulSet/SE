const API_URL = typeof window !== 'undefined'
    ? ''
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function getAllReviews(token: string) {
    const response = await fetch(
        `${API_URL}/api/v1/reviews`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    )

    if (!response.ok) {
        throw new Error("Failed to fetch all reviews")
    }

    return await response.json()
}