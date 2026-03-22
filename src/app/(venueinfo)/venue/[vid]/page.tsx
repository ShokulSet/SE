import getVenue from '@/libs/getVenue';

export default async function VenueDetailPage({ params }: { params: Promise<{ vid: string }> }) {
    const { vid } = await params;
    const venueDetail = await getVenue(vid);

    return (
        <main className="text-center p-5">
            <h1 className="text-lg font-medium">{venueDetail.data.name}</h1>
            <div className="flex flex-row my-5">
                <img
                    src={venueDetail.data.picture}
                    alt='Venue Picture'
                    className='rounded-lg w-[30%] object-cover'
                />
                <div className='text-md mx-5 text-left'>
                    <div>Name: {venueDetail.data.name}</div>
                    <div>Address: {venueDetail.data.address}</div>
                    <div>District: {venueDetail.data.district}</div>
                    <div>Postal Code: {venueDetail.data.postalcode}</div>
                    <div>Tel: {venueDetail.data.tel}</div>
                    <div>Daily Rate: {venueDetail.data.dailyrate}</div>
                </div>
            </div>
        </main>
    );
}