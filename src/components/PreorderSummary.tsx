'use client'

import { usePreorder } from '@/hooks/usePreorder'

export default function PreorderSummary() {
  const { items, total, itemCount } = usePreorder()

  if (items.length === 0) return null

  return (
    <div className="mt-4 pt-4 border-t border-zinc-700 space-y-1">
      <div className="flex justify-between text-sm text-zinc-400">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="flex justify-between text-sm text-zinc-400">
        <span>Subtotal</span>
        <span>฿{total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-base font-semibold text-yellow-400 pt-1">
        <span>Total</span>
        <span>฿{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
