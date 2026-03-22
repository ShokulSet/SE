import Card from "./Card";
export default async function VenueCatalog({ venuesJson }: { venuesJson: Promise<VenueJson> }) {
    const venueData = await venuesJson;  

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center p-10">
            {venueData.data.map((venue) => (
                <Card
                    key={venue.id}
                    venueName={venue.name}
                    imgSrc={venue.picture}
                    vid={venue.id}
                />
            ))}
        </div>
    );
}