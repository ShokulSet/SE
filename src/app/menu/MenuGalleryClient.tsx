'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { MenuItem } from '@/libs/getMenus'
import MenuCard from '@/components/MenuCard'
import PreorderList from '@/components/PreorderList'
import { usePreorder } from '@/hooks/usePreorder'
import { confirmPreorder } from '@/libs/getAllPreorders'
import getReservations from '@/libs/getReservations'
import Link from 'next/link'
import { ShoppingBag, Loader2, CheckCircle, X, CalendarX } from 'lucide-react'

interface MenuGalleryClientProps {
  initialMenus: MenuItem[]
  venueName?: string
  venueId?: string
}

export default function MenuGalleryClient({ initialMenus, venueName, venueId }: MenuGalleryClientProps) {
  const { data: session, status: sessionStatus } = useSession()
  const token = (session?.user as any)?.token as string | undefined
  const [categoryFilter, setCategoryFilter] = useState('')
  const { items, itemCount, removeByVenue } = usePreorder()

  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState('')

  // ── Reservation gate ─────────────────────────────────────────────────────
  const [hasReservation, setHasReservation] = useState<boolean | null>(null)

  useEffect(() => {
    if (sessionStatus === 'loading') return
    if (!token || !venueId) { setHasReservation(false); return }

    getReservations(token)
      .then((data) => {
        const active = (data.data ?? []).some(
          (r: any) => r.restaurantId === venueId && r.status !== 'cancelled'
        )
        setHasReservation(active)
      })
      .catch(() => setHasReservation(false))
  }, [token, venueId, sessionStatus])

  const categories = Array.from(new Set(initialMenus.map((m) => m.category))).sort()
  const filtered = categoryFilter ? initialMenus.filter((m) => m.category === categoryFilter) : initialMenus

  // items belonging to this venue only
  const venueItems = venueId ? items.filter((i) => i.venueId === venueId) : items
  const venueTotal = venueItems.reduce((s, i) => s + i.price * i.quantity, 0)

  async function handleConfirm() {
    if (!venueId || venueItems.length === 0) return
    setConfirming(true)
    setConfirmError('')
    try {
      await confirmPreorder(
        venueId,
        venueItems.map((i) => ({ menuId: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        token
      )
      setConfirmed(true)
    } catch (e: any) {
      setConfirmError(e.message || 'Failed to confirm order')
    } finally {
      setConfirming(false)
    }
  }

  function handleDismiss() {
    if (venueId) removeByVenue(venueId)
    setConfirmed(false)
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto flex gap-8">

        {/* ── Menu gallery ─────────────────────────────────────────────── */}
        <div className="flex-1">
          <div className="mb-8">
            <Link href="/menu" className="text-zinc-500 text-xs hover:text-yellow-400 transition mb-2 inline-block">
              ← All Restaurants
            </Link>
            <h1 className="text-2xl text-yellow-500 font-normal">
              {venueName ?? 'Menu'}
            </h1>
            <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1">
              Browse and add items to your pre-order
            </p>
          </div>

          {/* ── Reservation warning banner ─────────────────────────────── */}
          {hasReservation === false && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-yellow-600/30 bg-yellow-500/5 rounded">
              <CalendarX size={16} className="text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-200/70 leading-relaxed">
                <span className="font-medium text-yellow-400">No reservation found.</span>{' '}
                Please make a reservation at this restaurant before placing a pre-order.{' '}
                <Link href="/booking" className="underline text-yellow-400 hover:text-yellow-300 transition">
                  Book a table →
                </Link>
              </div>
            </div>
          )}

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setCategoryFilter('')}
                className={`px-3 py-1 text-xs rounded border transition ${
                  !categoryFilter ? 'bg-yellow-500 text-black border-yellow-500' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1 text-xs rounded border transition ${
                    categoryFilter === c ? 'bg-yellow-500 text-black border-yellow-500' : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-zinc-500">No menu items available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((menu) => (
                <MenuCard key={menu._id} menu={menu} disablePreorder={hasReservation === false} />
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="w-80 shrink-0">
          <div className="sticky top-6 flex flex-col gap-3">
            <PreorderList />

            {/* No-reservation notice in sidebar */}
            {hasReservation === false && (
              <div className="bg-zinc-900 border border-yellow-600/20 rounded-lg p-4 flex items-start gap-3">
                <CalendarX size={15} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Please make a reservation before preordering.
                </p>
              </div>
            )}

            {/* Confirm button — shown when venue has items and reservation exists */}
            {venueItems.length > 0 && !confirmed && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Order Total</span>
                  <span className="text-yellow-400 font-semibold">฿{venueTotal.toFixed(2)}</span>
                </div>

                {confirmError && (
                  <p className="text-red-400 text-xs p-2 border border-red-900/30 bg-red-900/10 rounded">
                    {confirmError}
                  </p>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={confirming || !hasReservation}
                  title={!hasReservation ? 'You need a reservation at this restaurant to preorder' : undefined}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                >
                  {confirming
                    ? <><Loader2 size={14} className="animate-spin" /> Confirming…</>
                    : <><ShoppingBag size={14} /> Confirm Pre-order</>
                  }
                </button>
              </div>
            )}

            {/* Success state */}
            {confirmed && (
              <div className="bg-zinc-900 border border-green-700/40 rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Order Confirmed!</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Your pre-order has been saved and is visible to the admin.
                    </p>
                  </div>
                  <button onClick={handleDismiss} className="text-zinc-600 hover:text-zinc-400 transition ml-auto shrink-0">
                    <X size={14} />
                  </button>
                </div>
                <Link
                  href="/my-orders"
                  className="text-center text-xs text-yellow-500 hover:text-yellow-400 transition border border-yellow-600/30 rounded py-1.5"
                >
                  View My Orders →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
