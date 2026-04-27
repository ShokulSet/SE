const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function getUserProfile(token: string) {
    const response = await fetch(
        `${API_URL}/api/v1/auth/me`,
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