'use client'

interface EditSuccessBannerProps {
  visible: boolean
}

export default function EditSuccessBanner({ visible }: EditSuccessBannerProps) {
  if (!visible) return null
  return (
    <div className="mb-4 px-4 py-2 bg-green-900/40 border border-green-700 text-green-400 text-sm rounded">
      Menu item updated successfully.
    </div>
  )
}
