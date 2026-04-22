import SavedRestaurantList from '@/components/SavedRestaurantList'

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-neutral-900 px-6 py-10">
      <h1 className="font-playfair text-2xl text-yellow-500 mb-8">Saved Restaurants</h1>
      <SavedRestaurantList />
    </main>
  )
}
