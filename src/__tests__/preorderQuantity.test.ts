import preorderReducer, {
  addToPreorder,
  updateQuantity,
  setQuantityBounded,
} from '../redux/features/preorderSlice'

interface PreorderState {
  items: { _id: string; name: string; price: number; quantity: number; venueId: string }[]
}

const emptyState: PreorderState = { items: [] }
const item = { _id: 'q1', name: 'Tom Yum', price: 80, venueId: 'v1' }

function stateWithItem(): PreorderState {
  return preorderReducer(emptyState, addToPreorder(item))
}

describe('Pre-order — edit quantity', () => {
  it('initial quantity after add is 1', () => {
    const state = stateWithItem()
    expect(state.items[0].quantity).toBe(1)
  })

  it('updateQuantity sets a new quantity', () => {
    const state = stateWithItem()
    const next = preorderReducer(state, updateQuantity({ id: 'q1', quantity: 3 }))
    expect(next.items[0].quantity).toBe(3)
  })

  it('updateQuantity enforces minimum of 1', () => {
    const state = stateWithItem()
    const next = preorderReducer(state, updateQuantity({ id: 'q1', quantity: 0 }))
    expect(next.items[0].quantity).toBe(1)
  })

  it('setQuantityBounded clamps to min', () => {
    const state = stateWithItem()
    const next = preorderReducer(state, setQuantityBounded({ id: 'q1', quantity: -5 }))
    expect(next.items[0].quantity).toBeGreaterThanOrEqual(1)
  })

  it('setQuantityBounded clamps to max', () => {
    const state = stateWithItem()
    const next = preorderReducer(state, setQuantityBounded({ id: 'q1', quantity: 1000, max: 99 }))
    expect(next.items[0].quantity).toBeLessThanOrEqual(99)
  })

  it('quantity update does not affect other items', () => {
    const item2 = { _id: 'q2', name: 'Pad Thai', price: 120, venueId: 'v1' }
    const s1 = preorderReducer(emptyState, addToPreorder(item))
    const s2 = preorderReducer(s1, addToPreorder(item2))
    const s3 = preorderReducer(s2, updateQuantity({ id: 'q1', quantity: 5 }))
    const q2 = s3.items.find((i) => i._id === 'q2')
    expect(q2?.quantity).toBe(1)
  })
})
