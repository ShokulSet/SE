export default async function getVenue(vid: string){
    const response = await fetch(
        `https://a08-venue-explorer-backend.vercel.app/api/v1/venues/${vid}`
    )
    if (!response.ok) {
        throw new Error("Failed to fetch venue")
    }
    
    const data = await response.json()

    // แปลง URL จาก uc?id= → thumbnail?id=
    data.data.picture = data.data.picture.replace(
        /https:\/\/drive\.google\.com\/uc\?id=(.*)/,
        'https://drive.google.com/thumbnail?id=$1'
    )

    return data
}