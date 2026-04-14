import { renderHook, act } from '@testing-library/react'
import { useMenuFilter } from '../hooks/useMenuFilter'
import { MenuItem } from '../libs/getMenus'

const menus: MenuItem[] = [
  { _id: '1', name: 'Pad Thai', price: 120, category: 'Main', venueId: 'v1', createdAt: '' },
  { _id: '2', name: 'Tom Yum', price: 80, category: 'Soup', venueId: 'v1', createdAt: '' },
  { _id: '3', name: 'Mango Sticky Rice', price: 60, category: 'Dessert', venueId: 'v1', createdAt: '' },
  { _id: '4', name: 'Papaya Salad', price: 70, category: 'Salad', venueId: 'v1', createdAt: '' },
]

describe('useMenuFilter', () => {
  it('returns all menus by default', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    expect(result.current.filtered).toHaveLength(4)
  })

  it('filters by search text', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    act(() => result.current.setSearch('pad'))
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].name).toBe('Pad Thai')
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    act(() => result.current.setCategoryFilter('Soup'))
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].name).toBe('Tom Yum')
  })

  it('sorts by name ascending by default', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    const names = result.current.filtered.map((m) => m.name)
    expect(names).toEqual([...names].sort())
  })

  it('toggleSort switches to descending on second click', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    act(() => result.current.toggleSort('name'))
    act(() => result.current.toggleSort('name'))
    expect(result.current.sortArrow('name')).toBe(' ↓')
  })

  it('sorts by price ascending', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    act(() => result.current.toggleSort('price'))
    const prices = result.current.filtered.map((m) => m.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('extracts unique categories', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    expect(result.current.categories).toEqual(['Dessert', 'Main', 'Salad', 'Soup'])
  })

  it('returns empty when no match', () => {
    const { result } = renderHook(() => useMenuFilter(menus))
    act(() => result.current.setSearch('xxxxxxxx'))
    expect(result.current.filtered).toHaveLength(0)
  })
})
