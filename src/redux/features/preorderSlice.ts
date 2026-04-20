import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PreorderItem {
  _id: string
  name: string
  price: number
  category: string
  venueId: string
  quantity: number
}

interface PreorderState {
  items: PreorderItem[]
}

const initialState: PreorderState = {
  items: [],
}

const preorderSlice = createSlice({
  name: 'preorder',
  initialState,
  reducers: {
    addToPreorder(state, action: PayloadAction<Omit<PreorderItem, 'quantity'>>) {
      const existing = state.items.find((item) => item._id === action.payload._id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromPreorder(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload)
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i._id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
    },
    clearPreorder(state) {
      state.items = []
    },
    removeAllByVenue(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.venueId !== action.payload)
    },
    setQuantityBounded(
      state,
      action: PayloadAction<{ id: string; quantity: number; min?: number; max?: number }>
    ) {
      const item = state.items.find((i) => i._id === action.payload.id)
      if (item) {
        const min = action.payload.min ?? 1
        const max = action.payload.max ?? 99
        item.quantity = Math.min(max, Math.max(min, action.payload.quantity))
      }
    },
  },
})

export const {
  addToPreorder,
  removeFromPreorder,
  updateQuantity,
  clearPreorder,
  removeAllByVenue,
  setQuantityBounded,
} = preorderSlice.actions

export default preorderSlice.reducer
