'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MenuForm from '@/components/MenuForm'
import { MenuItem, getAllMenus, updateMenu } from '@/libs/getMenus'
import Link from 'next/link'

export default function EditMenuPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [menu, setMenu] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = (session?.user as any)?.token ?? ''

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin')
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') router.push('/')
  }, [status, session, router])

  useEffect(() => {
    if (!token) return
    getAllMenus(token)
      .then((json) => {
        const found = json.data.find((m) => m._id === id)
        if (!found) { setError('Menu not found'); return }
        setMenu(found)
      })
      .catch(() => setError('Failed to load menu'))
      .finally(() => setLoading(false))
  }, [token, id])

  const handleSubmit = async (data: Parameters<typeof updateMenu>[2]) => {
    try {
      await updateMenu(token, id, data)
      router.push('/admin/menu')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Link href="/admin/menu" className="text-zinc-500 text-sm hover:text-yellow-400 transition">
            ← Back to Menu List
          </Link>
          <h1 className="text-2xl text-yellow-500 font-normal mt-4">Edit Menu Item</h1>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {menu && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <MenuForm
              initial={menu}
              venueId={menu.venueId}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          </div>
        )}
      </div>
    </main>
  )
}
