'use client'

interface MenuCategoryBadgeProps {
  category: string
}

export default function MenuCategoryBadge({ category }: MenuCategoryBadgeProps) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
      {category}
    </span>
  )
}
