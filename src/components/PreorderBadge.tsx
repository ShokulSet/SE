'use client'

import { usePreorder } from '@/hooks/usePreorder'

export default function PreorderBadge() {
  const { itemCount } = usePreorder()

  if (itemCount === 0) return null

  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-yellow-500 text-black rounded-full font-bold">
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  )
}
