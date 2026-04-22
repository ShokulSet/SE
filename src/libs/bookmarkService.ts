export interface BookmarkedRestaurant {
  id: string
  name: string
}

const STORAGE_KEY = 'bookmarked_restaurants'

function load(): BookmarkedRestaurant[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(items: BookmarkedRestaurant[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getBookmarks(): BookmarkedRestaurant[] {
  return load()
}

export function isBookmarked(id: string): boolean {
  return load().some((r) => r.id === id)
}

export function addBookmark(restaurant: BookmarkedRestaurant): void {
  const items = load()
  if (!items.some((r) => r.id === restaurant.id)) {
    save([...items, restaurant])
  }
}

export function removeBookmark(id: string): void {
  save(load().filter((r) => r.id !== id))
}
