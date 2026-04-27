export interface RestaurantDetail {
  _id: string
  name: string
  description: string
  address: string
  province: string
  postalcode: string
  tel: string
  picture: string
  dailyrate?: number
  opentime: string
  closetime: string
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

export default async function getRestaurantDetail(id: string): Promise<{ data: RestaurantDetail }> {
  if (!id) throw new Error('Restaurant ID is required')
  const response = await fetch(`${API_URL}/api/v1/restaurants/${id}`, {
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant: ${id}`)
  }
  return await response.json()
}
