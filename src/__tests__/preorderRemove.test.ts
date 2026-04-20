import preorderReducer, {
  addToPreorder,
  removeFromPreorder,
  clearPreorder,
  removeAllByVenue,
} from '../redux/features/preorderSlice'

interface PreorderState {
  items: { _id: string; name: string; price: number; quantity: number; venueId: string }[]
}

const emptyState: PreorderState = { items: [] }

const itemA = { _id: 'r1', name: 'Tom Yum', price: 80, venueId: 'v1' }
const itemB = { _id: 'r2', name: 'Pad Thai', price: 120, venueId: 'v1' }
const itemC = { _id: 'r3', name: 'Green Curry', price: 90, venueId: 'v2' }

function stateWith(...items: typeof itemA[]): PreorderState {
  return items.reduce(
    (s, i) => preorderReducer(s, addToPreorder(i)),
    emptyState,
  )
}

describe('Pre-order — remove items', () => {
  it('removes a single item by id', () => {
    const state = stateWith(itemA, itemB)
    const next = preorderReducer(state, removeFromPreorder('r1'))
    expect(next.items).toHaveLength(1)
    expect(next.items[0]._id).toBe('r2')
  })

  it('removes nothing when id not found', () => {
    const state = stateWith(itemA)
    const next = preorderReducer(state, removeFromPreorder('nonexistent'))
    expect(next.items).toHaveLength(1)
  })

  it('clearPreorder removes all items', () => {
    const state = stateWith(itemA, itemB)
    const next = preorderReducer(state, clearPreorder())
    expect(next.items).toHaveLength(0)
  })

  it('removeAllByVenue removes only items from that venue', () => {
    const state = stateWith(itemA, itemB, itemC)
    const next = preorderReducer(state, removeAllByVenue('v1'))
    expect(next.items).toHaveLength(1)
    expect(next.items[0].venueId).toBe('v2')
  })

  it('list is empty after removing the last item', () => {
    const state = stateWith(itemA)
    const next = preorderReducer(state, removeFromPreorder('r1'))
    expect(next.items).toHaveLength(0)
  })
})
