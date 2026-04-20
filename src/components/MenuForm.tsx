'use client'

import { useState } from 'react'
import { MenuItem } from '@/libs/getMenus'

interface MenuFormProps {
  initial?: Partial<MenuItem>
  venueId: string
  onSubmit: (data: Omit<MenuItem, '_id' | 'createdAt'>) => Promise<void>
  submitLabel?: string
}

export default function MenuForm({ initial, venueId, onSubmit, submitLabel = 'Save' }: MenuFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(String(initial?.price ?? ''))
  const [category, setCategory] = useState(initial?.category ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Name is required'
    const parsed = parseFloat(price)
    if (!price || isNaN(parsed) || parsed < 0) next.price = 'Price must be a non-negative number'
    if (!category.trim()) next.category = 'Category is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        price: parseFloat(price),
        category: category.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        venueId,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-300 mb-1">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          placeholder="e.g. Grilled Salmon"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1">Price (THB) *</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="text"
          inputMode="decimal"
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          placeholder="e.g. 350"
        />
        {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1">Category *</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          placeholder="e.g. Main Course"
        />
        {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 resize-none"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-1">Image URL</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-500 text-black font-medium py-2 rounded hover:bg-yellow-400 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
