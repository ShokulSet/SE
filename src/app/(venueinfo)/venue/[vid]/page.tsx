import getVenue from '@/libs/getVenue';
import Link from 'next/link';

export default async function VenueDetailPage({ params }: { params: Promise<{ vid: string }> }) {
    const { vid } = await params;
    const venueDetail = await getVenue(vid);
    const v = venueDetail.data;

    return (
        <main className="min-h-screen bg-black text-white px-6 py-12">
            <div className="max-w-7xl px-6 mx-auto">

                {/* Breadcrumb */}
                <p className="text-gray-600 text-xs tracking-widest uppercase mb-8">
                    <Link href="/venue" className="hover:text-yellow-500 transition">Venues</Link>
                    {" / "}
                    <span className="text-gray-400">{v.name}</span>
                </p>

                <div className="flex flex-col md:flex-row gap-10">

                    {/* รูปภาพ */}
                    <div className="w-full md:w-1/2 h-72 overflow-hidden">
                        <img
                            src={v.picture}
                            alt={v.name}
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>

                    {/* ข้อมูล */}
                    <div className="w-full md:w-1/2 flex flex-col justify-between">

                        <div>
                            <h1 className="font-playfair text-3xl font-bold text-yellow-500 mb-6">
                                {v.name}
                            </h1>

                            <div className="flex flex-col gap-4">
                                <DetailRow label="Address" value={v.address} />
                                <DetailRow label="District" value={v.district} />
                                <DetailRow label="Postal Code" value={v.postalcode} />
                                <DetailRow label="Tel" value={v.tel} />
                                <DetailRow label="Daily Rate" value={`฿${v.dailyrate.toLocaleString()}`} />
                            </div>
                        </div>

                        <Link
                            href={`/booking?vid=${vid}&venue=${encodeURIComponent(v.name)}`}
                            className="mt-8 w-fit text-xs font-medium px-6 py-2
                                       text-yellow-500 border border-yellow-500
                                       hover:bg-yellow-500 hover:text-black
                                       transition-all duration-200 tracking-widest uppercase"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-gray-600 text-xs tracking-widest uppercase">{label}</span>
            <span className="text-gray-300 text-sm">{value}</span>
        </div>
    );
}