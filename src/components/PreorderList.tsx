'use client'

import { usePreorder } from '@/hooks/usePreorder'
import PreorderItemRow from './PreorderItem'
import PreorderSummary from './PreorderSummary'

export default function PreorderList() {
  const { items, itemCount, remove, setQuantity, clear } = usePreorder()

  if (items.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-white font-medium mb-2">Pre-order List</h2>
        <p className="text-zinc-500 text-sm">No items added yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">
          Pre-order List
          <span className="ml-2 text-xs text-zinc-500">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
        </h2>
        <button
          onClick={clear}
          className="text-xs text-zinc-500 hover:text-red-400 transition"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <PreorderItemRow
            key={item._id}
            item={item}
            onQuantityChange={setQuantity}
            onRemove={remove}
          />
        ))}
      </div>

      <PreorderSummary />
    </div>
  )
}
