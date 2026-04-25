'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, X, Star, MapPin, Phone, Clock,
  BookOpen, SlidersHorizontal, ChevronDown,
} from 'lucide-react'
import {
  applyFilters, extractCategories, SortOption,
} from '@/libs/searchUtils'
import { RestaurantItem } from '@/libs/getRestaurants'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Default',    value: '' },
  { label: 'Rating ↓',  value: 'rating_desc' },
  { label: 'Rating ↑',  value: 'rating_asc' },
  { label: 'Name A–Z',  value: 'name_asc' },
  { label: 'Name Z–A',  value: 'name_desc' },
]

const RATING_OPTIONS = [
  { label: 'Any',    value: '' },
  { label: '4★ & up', value: '4' },
  { label: '3★ & up', value: '3' },
  { label: '2★ & up', value: '2' },
]

export default function SearchClient({ initialRestaurants }: { initialRestaurants: RestaurantItem[] }) {
  const [query,      setQuery]      = useState('')
  const [category,   setCategory]   = useState('')
  const [minRating,  setMinRating]  = useState('')
  const [sort,       setSort]       = useState<SortOption>('')
  const [showFilter, setShowFilter] = useState(false)

  const categories = useMemo(() => extractCategories(initialRestaurants), [initialRestaurants])
  const filtered   = useMemo(
    () => applyFilters(initialRestaurants, { query, category, minRating, sort }),
    [initialRestaurants, query, category, minRating, sort],
  )

  const activeFilters: { label: string; onRemove: () => void }[] = []
  if (query)     activeFilters.push({ label: `"${query}"`,   onRemove: () => setQuery('') })
  if (category)  activeFilters.push({ label: category,       onRemove: () => setCategory('') })
  if (minRating) activeFilters.push({ label: `${minRating}★+`, onRemove: () => setMinRating('') })
  if (sort)      activeFilters.push({ label: SORT_OPTIONS.find(s => s.value === sort)!.label, onRemove: () => setSort('') })

  const filterCount = [category, minRating].filter(Boolean).length

  function clearAll() {
    setQuery(''); setCategory(''); setMinRating(''); setSort('')
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <p className="text-yellow-500 text-xs tracking-[0.4em] uppercase mb-4">Discover</p>
          <h1 className="font-playfair text-4xl font-bold text-yellow-500 tracking-widest mb-2">
            Find Your Restaurant
          </h1>
          <div className="flex items-center gap-4 w-48 mx-auto mb-4">
            <div className="flex-1 h-px bg-yellow-500/40" />
            <span className="text-yellow-500/60 text-xs">★</span>
            <div className="flex-1 h-px bg-yellow-500/40" />
          </div>
          <p className="text-gray-500 text-sm tracking-wider">
            Search and filter from our curated collection
          </p>
        </div>

        {/* ── Search bar + controls ───────────────────────────────── */}
        <div className="flex gap-3 mb-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500/50" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search restaurants by name or address…"
              className="w-full pl-10 pr-9 py-3 bg-[#0f0f0f] border border-yellow-600/20 text-white text-sm
                         placeholder-gray-600 focus:outline-none focus:border-yellow-500/60 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(f => !f)}
            className={`flex items-center gap-2 px-4 py-3 border text-sm transition ${
              showFilter || filterCount > 0
                ? 'bg-yellow-500 text-black border-yellow-500'
                : 'border-yellow-600/20 text-yellow-500 hover:border-yellow-500'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {filterCount > 0 && (
              <span className="bg-black/30 text-current text-xs px-1.5 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-8 py-3 bg-[#0f0f0f] border border-yellow-600/20
                         text-yellow-500 text-sm focus:outline-none focus:border-yellow-500/60 transition cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-black">{o.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-yellow-500/50 pointer-events-none" />
          </div>
        </div>

        {/* ── Filter panel ────────────────────────────────────────── */}
        {showFilter && (
          <div className="mb-4 p-5 bg-[#0f0f0f] border border-yellow-600/15 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={!category}
                  onClick={() => setCategory('')}
                  label="All"
                />
                {categories.map(c => (
                  <FilterChip
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(category === c ? '' : c)}
                    label={c}
                  />
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Minimum Rating</p>
              <div className="flex flex-wrap gap-2">
                {RATING_OPTIONS.map(o => (
                  <FilterChip
                    key={o.value}
                    active={minRating === o.value}
                    onClick={() => setMinRating(minRating === o.value ? '' : o.value)}
                    label={o.label}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Active filter chips ─────────────────────────────────── */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-600 uppercase tracking-widest">Active:</span>
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.onRemove}
                className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30
                           text-yellow-400 text-xs hover:bg-yellow-500/20 transition"
              >
                {f.label} <X size={10} />
              </button>
            ))}
            <button onClick={clearAll} className="text-xs text-gray-600 hover:text-gray-400 transition ml-1">
              Clear all
            </button>
          </div>
        )}

        {/* ── Result count ────────────────────────────────────────── */}
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-6">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* ── Results ─────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-playfair text-2xl text-yellow-600/30 mb-3">No results found</p>
            <p className="text-gray-600 text-sm mb-6">
              Try adjusting your search or removing some filters.
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2 border border-yellow-500/40 text-yellow-500 text-sm
                         hover:bg-yellow-500 hover:text-black transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(r => <RestaurantCard key={r._id} r={r} />)}
          </div>
        )}
      </div>
    </main>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function FilterChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs border transition ${
        active
          ? 'bg-yellow-500 text-black border-yellow-500'
          : 'border-yellow-600/20 text-gray-400 hover:border-yellow-500/50'
      }`}
    >
      {label}
    </button>
  )
}

function RestaurantCard({ r }: { r: RestaurantItem }) {
  const ratingNum = parseFloat(String(r.averageRating))
  const hasRating = !isNaN(ratingNum)

  return (
    <div className="group bg-[#0f0f0f] border border-yellow-600/15 hover:border-yellow-500/50
                    hover:bg-[#141414] transition-all duration-300 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <Link href={`/venue/${r._id}`} className="flex-1 pr-2">
          <h2 className="font-playfair text-lg text-yellow-500 font-bold leading-snug hover:text-yellow-400 transition">
            {r.name}
          </h2>
          {r.category && (
            <span className="text-xs text-yellow-600/50 uppercase tracking-wider">{r.category}</span>
          )}
        </Link>
        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 shrink-0">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 text-xs font-medium">
            {hasRating ? ratingNum.toFixed(1) : '—'}
          </span>
        </div>
      </div>

      <div className="h-px bg-yellow-600/10 group-hover:bg-yellow-600/20 transition-colors" />

      <div className="flex flex-col gap-2.5 flex-1">
        <div className="flex items-start gap-2">
          <MapPin size={12} className="text-yellow-600/50 mt-0.5 shrink-0" />
          <p className="text-gray-400 text-xs leading-relaxed">{r.address}</p>
        </div>
        {r.tel && (
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-yellow-600/50 shrink-0" />
            <p className="text-gray-500 text-xs">{r.tel}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-yellow-600/10">
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-green-500/70" />
          <span className="text-green-500/80 text-xs">{r.opentime} – {r.closetime}</span>
        </div>
        <span className="text-gray-700 text-xs">
          {r.reviewCount} {r.reviewCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        <Link
          href={`/venue/${r._id}`}
          className="flex-1 text-center text-xs py-1.5 px-3 text-yellow-500 border border-yellow-500/40
                     hover:bg-yellow-500 hover:text-black transition-all duration-200"
        >
          View Details
        </Link>
        <Link
          href={`/menu?venueId=${r._id}&venueName=${encodeURIComponent(r.name)}`}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 px-3
                     text-black bg-yellow-500 hover:bg-yellow-400 transition-all duration-200"
        >
          <BookOpen size={11} /> Menu
        </Link>
      </div>
    </div>
  )
}
