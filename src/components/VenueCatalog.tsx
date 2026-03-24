import Card from "./Card";
import { VenueJson, VenueItem } from "@/../interface";

export default async function VenueCatalog({ venuesJson }: { venuesJson: Promise<VenueJson> }) {
    const venueData = await venuesJson;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {venueData.data.map((venue: VenueItem) => (
                    <Card
                        key={venue.id}
                        venueName={venue.name}
                        imgSrc={venue.picture}
                        vid={venue.id}
                        address={venue.address}
                        district={venue.district}
                        province={venue.province}
                    />
                ))}
            </div>
        </div>
    );
}