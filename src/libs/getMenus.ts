const API_URL = typeof window !== 'undefined'
    ? ''
    : (process.env.NEXT_PUBLIC_MENU_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export interface MenuItem {
  _id: string
  name: string
  price: number
  category: string
  description?: string
  imageUrl?: string
  venueId: string
  createdAt: string
}

export interface MenuJson {
  success: boolean
  count: number
  data: MenuItem[]
}

export async function getMenusByVenue(venueId: string): Promise<MenuJson> {
  const res = await fetch(`${API_URL}/api/v1/menus/by-venue/${venueId}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch menus')
  return res.json()
}

export async function getAllMenus(token: string): Promise<MenuJson> {
  const res = await fetch(`${API_URL}/api/v1/menus`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch menus')
  return res.json()
}

export async function createMenu(token: string, data: Omit<MenuItem, '_id' | 'createdAt'>): Promise<MenuItem> {
  const res = await fetch(`${API_URL}/api/v1/menus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create menu')
  }
  const json = await res.json()
  return json.data
}

export async function updateMenu(token: string, id: string, data: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`${API_URL}/api/v1/menus/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update menu')
  }
  const json = await res.json()
  return json.data
}

export async function deleteMenu(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/menus/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to delete menu')
}
