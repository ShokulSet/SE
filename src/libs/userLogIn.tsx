const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function userLogIn(userEmail: string, userPassword: string) {
    const response = await fetch(
        `${API_URL}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
            }),
        }
    );

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody.message || errBody.error || `Login failed (${response.status})`)
    }

    const json = await response.json();
    return {
        ...json.data,
        token: json.token,
    }
}