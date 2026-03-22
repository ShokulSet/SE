
import getVenues from '../../../libs/getVenues';
import VenueCatalog from '../../../components/VenueCatalog';

export default function VenuePage() {
    const venuesJson = getVenues();

    return (
        <div className="text-center p-5 ">
            <h1 className="text-2xl font-medium">Select your venue</h1>
            <p className="text-gray-500 " >Explore 3 fabulous venues in our venue catalog</p>
            <VenueCatalog venuesJson={venuesJson} />
        </div>
    );
}