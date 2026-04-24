'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, Navigation, Loader2 } from 'lucide-react'
import { Suspense } from 'react'

const RestaurantMap = dynamic(() => import('@/components/RestaurantMap'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[500px] bg-[#0a0a0a] border border-yellow-600/20">
      <Loader2 size={28} className="text-yellow-500 animate-spin mb-3" />
      <p className="text-zinc-500 text-sm">Loading map…</p>
    </div>
  ),
})

export default function MapPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/venue" className="text-zinc-500 text-xs hover:text-yellow-400 transition mb-2 inline-block">
            ← All Restaurants
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <MapPin size={22} className="text-yellow-500" />
            <h1 className="text-2xl text-yellow-500 font-normal">Nearby Restaurants</h1>
          </div>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2 ml-9">
            Find restaurants near your current location
          </p>
        </div>

        {/* Info strip */}
        <div className="flex items-center gap-2 mb-5 px-4 py-2.5 border border-yellow-600/20 bg-yellow-500/5 rounded text-xs text-zinc-400">
          <Navigation size={13} className="text-yellow-500 shrink-0" />
          <span>
            Allow location access to see restaurants near you. Click a pin to view details.
          </span>
        </div>

        {/* Map */}
        <div className="rounded overflow-hidden border border-yellow-600/20 shadow-lg">
          <Suspense>
            <RestaurantMap />
          </Suspense>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Your location</span>
          </div>
        </div>
      </div>
    </main>
  )
}
