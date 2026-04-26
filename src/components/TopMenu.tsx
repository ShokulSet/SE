'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  AudioWaveform, BookOpen,
  Receipt, CalendarCheck, Plus, ShoppingBag, ChevronDown,
} from 'lucide-react'
import AuthButton from './AuthButton'

interface DropItem { href: string; icon: React.ReactNode; label: string }

function NavDropdown({
  icon, label, items,
}: {
  icon: React.ReactNode
  label: string
  items: DropItem[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Trigger — icon only, text slides in on hover */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`group flex items-center gap-0 overflow-hidden p-2 border transition-all duration-300 ${
          open
            ? 'bg-yellow-500 text-black border-yellow-500'
            : 'text-yellow-500 border-yellow-500/50 hover:bg-yellow-500 hover:text-black'
        }`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden whitespace-nowrap
                         transition-all duration-300 text-xs font-medium group-hover:ml-1.5">
          {label}
        </span>
        <ChevronDown
          size={10}
          className={`shrink-0 ml-0 group-hover:ml-1 transition-all duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#0f0f0f] border border-yellow-600/30 shadow-2xl z-50">
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-300
                         hover:bg-yellow-500/10 hover:text-yellow-400
                         transition-colors border-b border-yellow-600/10 last:border-b-0"
            >
              <span className="text-yellow-600/60 shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TopMenu() {
  return (
    <div className="h-16 bg-black fixed top-0 w-full z-50 border-b border-yellow-600/40">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <AudioWaveform className="text-yellow-500" size={22} />
          <h1 className="font-playfair text-xl font-bold tracking-widest text-yellow-500">
            PutterLuvMom 
          </h1>
        </Link>

        {/* ── Nav ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Orders — ShoppingBag icon */}
          <NavDropdown
            icon={<ShoppingBag size={16} />}
            label="Orders"
            items={[
              { href: '/menu',          icon: <BookOpen size={13} />,    label: 'Browse Menu' },
              { href: '/my-orders',     icon: <ShoppingBag size={13} />, label: 'My Orders' },
              { href: '/order-history', icon: <Receipt size={13} />,     label: 'Order History' },
            ]}
          />

          {/* Reservations — CalendarCheck icon */}
          <NavDropdown
            icon={<CalendarCheck size={16} />}
            label="Reservations"
            items={[
              { href: '/mybooking', icon: <CalendarCheck size={13} />, label: 'My Reservations' },
            ]}
          />

          {/* ── New Reservation — Plus icon, prominent, text slides on hover */}
          <Link
            href="/booking"
            className="group flex items-center gap-0 overflow-hidden p-2
                       bg-yellow-500 text-black border border-yellow-500
                       hover:bg-yellow-400 active:scale-95
                       transition-all duration-300
                       shadow-[0_0_14px_rgba(234,179,8,0.3)]"
          >
            <Plus size={16} className="shrink-0" />
            <span className="max-w-0 group-hover:max-w-[140px] overflow-hidden whitespace-nowrap
                             transition-all duration-300 text-xs font-bold group-hover:ml-2
                             uppercase tracking-widest">
              Book Now
            </span>
          </Link>

          {/* ── Auth (unchanged) ─────────────────────────── */}
          <AuthButton />
        </div>
      </div>
    </div>
  )
}
