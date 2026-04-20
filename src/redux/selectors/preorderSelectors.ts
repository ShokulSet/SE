import { RootState } from '../store'

export const selectPreorderItems = (state: RootState) => state.preorder.items

export const selectPreorderTotal = (state: RootState) =>
  state.preorder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export const selectPreorderItemCount = (state: RootState) =>
  state.preorder.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectIsInPreorder = (id: string) => (state: RootState) =>
  state.preorder.items.some((item) => item._id === id)

export const selectPreorderQuantity = (id: string) => (state: RootState) =>
  state.preorder.items.find((item) => item._id === id)?.quantity ?? 0
