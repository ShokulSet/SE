const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface PreorderItemData {
  menuId: string
  name: string
  price: number
  quantity: number
}

export interface PreorderData {
  _id: string
  venueId: string
  items: PreorderItemData[]
  total: number
  updatedAt: string
}

export async function getAllPreorders(token: string): Promise<{ success: boolean; data: PreorderData[] }> {
  const res = await fetch(`${API_URL}/api/v1/preorders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch preorders')
  return res.json()
}

export async function updatePreorderItemQty(venueId: string, menuId: string, quantity: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/preorders/${venueId}/items/${menuId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
  if (!res.ok) throw new Error('Failed to update item')
}

export async function removePreorderItem(venueId: string, menuId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/preorders/${venueId}/items/${menuId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to remove item')
}

export async function confirmPreorder(
  venueId: string,
  items: { menuId: string; name: string; price: number; quantity: number }[]
): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/preorders/${venueId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error('Failed to confirm preorder')
}
