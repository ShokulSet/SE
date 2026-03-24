import Banner from '../components/Banner';
import VenuePage from './(venueinfo)/venue/page';
export default function Home() {
    return (
        <main className="min-h-screen w-full bg-black">
            <Banner />
            <VenuePage />
        </main>
    );
}