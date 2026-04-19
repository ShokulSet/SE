import preorderReducer, {
  addToPreorder,
  clearPreorder,
} from '../redux/features/preorderSlice'

interface PreorderState {
  items: { _id: string; name: string; price: number; quantity: number; venueId: string }[]
}

const emptyState: PreorderState = { items: [] }

const item = { _id: 'a1', name: 'Tom Yum', price: 80, venueId: 'v1' }
const item2 = { _id: 'a2', name: 'Pad Thai', price: 120, venueId: 'v1' }

describe('Pre-order — add items', () => {
  it('adds an item to an empty cart', () => {
    const state = preorderReducer(emptyState, addToPreorder(item))
    expect(state.items).toHaveLength(1)
    expect(state.items[0]._id).toBe('a1')
    expect(state.items[0].quantity).toBe(1)
  })

  it('increments quantity when adding a duplicate item', () => {
    const after1 = preorderReducer(emptyState, addToPreorder(item))
    const after2 = preorderReducer(after1, addToPreorder(item))
    expect(after2.items).toHaveLength(1)
    expect(after2.items[0].quantity).toBe(2)
  })

  it('adds multiple distinct items', () => {
    const after1 = preorderReducer(emptyState, addToPreorder(item))
    const after2 = preorderReducer(after1, addToPreorder(item2))
    expect(after2.items).toHaveLength(2)
  })

  it('clearPreorder empties the cart', () => {
    const filled = preorderReducer(emptyState, addToPreorder(item))
    const cleared = preorderReducer(filled, clearPreorder())
    expect(cleared.items).toHaveLength(0)
  })

  it('preserves price when adding item', () => {
    const state = preorderReducer(emptyState, addToPreorder(item))
    expect(state.items[0].price).toBe(80)
  })

  it('preserves venueId when adding item', () => {
    const state = preorderReducer(emptyState, addToPreorder(item))
    expect(state.items[0].venueId).toBe('v1')
  })
})
