'use client'

import { MenuItem } from '@/libs/getMenus'
import { usePreorder } from '@/hooks/usePreorder'
import AddToPreorderButton from './AddToPreorderButton'

interface MenuCardProps {
  menu: MenuItem
  disablePreorder?: boolean
}

export default function MenuCard({ menu, disablePreorder }: MenuCardProps) {
  const { getQuantity } = usePreorder()
  const qty = getQuantity(menu._id)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 transition">
      {menu.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{menu.category}</p>
        <h3 className="text-white font-medium mb-1">{menu.name}</h3>
        {menu.description && (
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{menu.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-yellow-400 font-semibold">฿{menu.price.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            {qty > 0 && (
              <span className="text-xs text-zinc-400">×{qty} in cart</span>
            )}
            <AddToPreorderButton
              item={{
                _id: menu._id,
                name: menu.name,
                price: menu.price,
                category: menu.category,
                venueId: menu.venueId,
              }}
              disabled={disablePreorder}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
