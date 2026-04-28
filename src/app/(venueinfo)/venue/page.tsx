import getVenues from '@/libs/getVenues'
import VenueSortClient from './VenueSortClient'

export default async function VenuePage() {
    const venuesJson = await getVenues()

    return (
        <div className="min-h-screen bg-black px-6 py-16">

            {/* Header */}
            <div className="text-center mb-16 max-w-2xl mx-auto">

                {/* Tag */}
                <p className="text-yellow-500 text-xs tracking-[0.4em] uppercase mb-6">
                    Our Collection
                </p>

                {/* Title */}
                <h1 className="font-playfair text-3xl font-normal text-white tracking-widest mb-2">
                    Select Your
                </h1>
                <h1 className="font-playfair text-5xl font-bold text-yellow-500 tracking-widest mb-6">
                    Destination
                </h1>

                {/* Divider */}
                <div className="flex items-center gap-4 w-48 mx-auto mb-6">
                    <div className="flex-1 h-px bg-yellow-500/40" />
                    <span className="text-yellow-500/60 text-xs">★</span>
                    <div className="flex-1 h-px bg-yellow-500/40" />
                </div>

                {/* Subtitle */}
                <p className="text-gray-500 text-sm tracking-widest leading-relaxed">
                    Choose from our exclusive collection of signature restaurants,
                    each offering a unique culinary journey
                </p>
            </div>

            {/* Catalog with sort */}
            <VenueSortClient venuesJson={venuesJson} />
        </div>
    )
}