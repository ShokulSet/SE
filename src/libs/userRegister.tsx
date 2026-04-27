const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function userRegister(
    name: string,
    email: string,
    password: string,
    tel: string
) {
    const response = await fetch(
        `${API_URL}/api/v1/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, tel }),
        }
    );

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to register");
    }

    return await response.json();
}