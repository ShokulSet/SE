export default async function getAllReviews(token: string) {
    const response = await fetch(
        "https://project-bn-sorawat.vercel.app/api/v1/reviews",
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