'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { sortRestaurants, SortOption } from '@/libs/searchUtils'
import VenueCatalog from '@/components/VenueCatalog'
import { VenueJson } from '@/../interface'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Default',   value: '' },
  { label: 'Rating ↓',  value: 'rating_desc' },
  { label: 'Rating ↑',  value: 'rating_asc' },
  { label: 'Name A–Z',  value: 'name_asc' },
  { label: 'Name Z–A',  value: 'name_desc' },
]

export default function VenueSortClient({ venuesJson }: { venuesJson: VenueJson }) {
  const [sort, setSort] = useState<SortOption>('')

  const sortedVenuesJson = useMemo((): VenueJson => {
    if (!sort) return venuesJson
    // Cast to RestaurantItem-compatible shape for sortRestaurants
    const sorted = sortRestaurants(venuesJson.data as any, sort) as any
    return { ...venuesJson, data: sorted }
  }, [venuesJson, sort])

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 uppercase tracking-widest">Sort by</span>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-8 py-2 bg-[#0f0f0f] border border-yellow-600/20
                         text-yellow-500 text-xs focus:outline-none focus:border-yellow-500/60
                         transition cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-black">{o.label}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-yellow-500/50 pointer-events-none" />
          </div>
        </div>
      </div>

      <VenueCatalog venuesJson={sortedVenuesJson} />
    </div>
  )
}
