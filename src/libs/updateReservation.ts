const API_URL = typeof window !== 'undefined'
    ? ''
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function updateReservation(
    reservationId: string,
    date: string,
    time: string,
    token: string
) {
    const response = await fetch(
        `${API_URL}/api/v1/reservations/${reservationId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date, time }),
        }
    )
    if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to update reservation")
    }
    return await response.json()
}