import { useState, useMemo } from 'react'
import { MenuItem } from '@/libs/getMenus'

type SortField = 'name' | 'price' | 'category'
type SortOrder = 'asc' | 'desc'

export function useMenuFilter(menus: MenuItem[]) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const categories = useMemo(
    () => Array.from(new Set(menus.map((m) => m.category))).sort(),
    [menus]
  )

  const filtered = useMemo(() => {
    return menus
      .filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
        const matchCategory = !categoryFilter || m.category === categoryFilter
        return matchSearch && matchCategory
      })
      .sort((a, b) => {
        const aVal = sortField === 'price' ? a.price : a[sortField]
        const bVal = sortField === 'price' ? b.price : b[sortField]
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [menus, search, categoryFilter, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortArrow = (field: SortField) =>
    sortField === field ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''

  return {
    search, setSearch,
    categoryFilter, setCategoryFilter,
    sortField, sortOrder, toggleSort, sortArrow,
    categories,
    filtered,
  }
}
