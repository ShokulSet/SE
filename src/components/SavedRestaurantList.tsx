'use client'

import { useBookmarkList } from '@/hooks/useBookmark'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function SavedRestaurantList() {
  const { bookmarks, remove } = useBookmarkList()

  if (bookmarks.length === 0) {
    return (
      <p className="text-zinc-400 text-sm">No saved restaurants yet.</p>
    )
  }

  return (
    <ul className="space-y-3">
      {bookmarks.map((r) => (
        <li
          key={r.id}
          className="flex items-center justify-between px-4 py-3 bg-neutral-800 border border-yellow-600/20"
        >
          <Link
            href={`/venue/${r.id}`}
            className="text-yellow-400 hover:underline text-sm font-medium"
          >
            {r.name}
          </Link>
          <button
            onClick={() => remove(r.id)}
            aria-label={`Remove ${r.name} from saved`}
            className="text-zinc-500 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </li>
      ))}
    </ul>
  )
}
