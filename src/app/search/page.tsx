import { getRestaurants } from '@/libs/getRestaurants'
import SearchClient from './SearchClient'

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  let restaurants: Awaited<ReturnType<typeof getRestaurants>>['data'] = []
  try {
    const json = await getRestaurants()
    restaurants = json.data ?? []
  } catch {
    // API failure — SearchClient shows empty state with clear-filters CTA
  }

  return <SearchClient initialRestaurants={restaurants} />
}
