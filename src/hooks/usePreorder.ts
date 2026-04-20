import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/redux/store'
import {
  addToPreorder,
  removeFromPreorder,
  updateQuantity,
  clearPreorder,
  removeAllByVenue,
  setQuantityBounded,
  PreorderItem,
} from '@/redux/features/preorderSlice'

export function usePreorder() {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => state.preorder.items)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const add = (item: Omit<PreorderItem, 'quantity'>) => dispatch(addToPreorder(item))
  const remove = (id: string) => dispatch(removeFromPreorder(id))
  const removeByVenue = (venueId: string) => dispatch(removeAllByVenue(venueId))
  const setQuantity = (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity }))
  const setQuantityWithBounds = (id: string, quantity: number, min = 1, max = 99) =>
    dispatch(setQuantityBounded({ id, quantity, min, max }))
  const clear = () => dispatch(clearPreorder())
  const isInCart = (id: string) => items.some((i) => i._id === id)
  const getQuantity = (id: string) => items.find((i) => i._id === id)?.quantity ?? 0

  return {
    items, total, itemCount,
    add, remove, removeByVenue,
    setQuantity, setQuantityWithBounds,
    clear, isInCart, getQuantity,
  }
}
