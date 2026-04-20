import {
  selectPreorderItems,
  selectPreorderTotal,
  selectPreorderItemCount,
  selectIsInPreorder,
  selectPreorderQuantity,
} from '../redux/selectors/preorderSelectors'

const mockState = {
  preorder: {
    items: [
      { id: 'a', name: 'Pad Thai', price: 120, category: 'Main', venueId: 'v1', quantity: 2 },
      { id: 'b', name: 'Tom Yum', price: 80, category: 'Soup', venueId: 'v1', quantity: 1 },
    ],
  },
} as any

describe('preorderSelectors', () => {
  it('selectPreorderItems returns all items', () => {
    expect(selectPreorderItems(mockState)).toHaveLength(2)
  })

  it('selectPreorderTotal calculates correct total', () => {
    expect(selectPreorderTotal(mockState)).toBe(320) // 120*2 + 80*1
  })

  it('selectPreorderItemCount sums all quantities', () => {
    expect(selectPreorderItemCount(mockState)).toBe(3) // 2+1
  })

  it('selectIsInPreorder returns true for existing item', () => {
    expect(selectIsInPreorder('a')(mockState)).toBe(true)
  })

  it('selectIsInPreorder returns false for missing item', () => {
    expect(selectIsInPreorder('z')(mockState)).toBe(false)
  })

  it('selectPreorderQuantity returns correct quantity', () => {
    expect(selectPreorderQuantity('b')(mockState)).toBe(1)
  })

  it('selectPreorderQuantity returns 0 for missing item', () => {
    expect(selectPreorderQuantity('z')(mockState)).toBe(0)
  })
})
