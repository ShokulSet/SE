export default async function getVenues() {
    const response = await fetch("https://a08-venue-explorer-backend.vercel.app/api/v1/venues")
    if(!response.ok) {
        throw new Error("Failed to fetch venues")
    }
    const data = await response.json()

    // แปลง URL จาก uc?id= → thumbnail?id=
    data.data = data.data.map((venue: any) => ({
        ...venue,
        picture: venue.picture.replace(
            /https:\/\/drive\.google\.com\/uc\?id=(.*)/,
            'https://drive.google.com/thumbnail?id=$1'
        )
    }))

    return data
}