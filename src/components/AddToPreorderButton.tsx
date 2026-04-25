'use client'

import { usePreorder } from '@/hooks/usePreorder'
import { PreorderItem } from '@/redux/features/preorderSlice'

interface AddToPreorderButtonProps {
  item: Omit<PreorderItem, 'quantity'>
  disabled?: boolean
}

export default function AddToPreorderButton({ item, disabled }: AddToPreorderButtonProps) {
  const { isInCart, add, remove } = usePreorder()
  const inCart = isInCart(item._id)

  return (
    <button
      onClick={() => { if (!disabled) inCart ? remove(item._id) : add(item) }}
      disabled={disabled}
      title={disabled ? 'Make a reservation at this restaurant first' : undefined}
      className={`px-3 py-1 text-xs rounded transition font-medium ${
        disabled
          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          : inCart
            ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
            : 'bg-yellow-500 text-black hover:bg-yellow-400'
      }`}
    >
      {inCart ? 'Remove' : 'Add to Pre-order'}
    </button>
  )
}
