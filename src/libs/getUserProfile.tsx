export default async function getUserProfile(token: string) {
    const response = await fetch(
        "https://a08-venue-explorer-backend-2.vercel.app/api/v1/auth/me",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to get user profile");
    }

    return await response.json();
}