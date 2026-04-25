const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function createReservation(
    restaurantId: string,
    reservationDate: string,
    token: string,
    partySize: number = 1
) {
    const date = reservationDate.split('T')[0]
    const time = reservationDate.split('T')[1]?.slice(0, 5) ?? '18:00'

    const response = await fetch(`${API_URL}/api/v1/reservations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId, date, time, partySize }),
    })
    if (!response.ok) {
        const text = await response.text()
        let msg = "Failed to create reservation"
        try { msg = JSON.parse(text)?.message || msg } catch {}
        throw new Error(msg)
    }
    return await response.json()
}