import { renderHook, act } from '@testing-library/react'
import { useBookmark, useBookmarkList } from '@/hooks/useBookmark'
import * as bookmarkService from '@/libs/bookmarkService'

jest.mock('@/libs/bookmarkService')

const mockAddBookmark = bookmarkService.addBookmark as jest.MockedFunction<typeof bookmarkService.addBookmark>
const mockRemoveBookmark = bookmarkService.removeBookmark as jest.MockedFunction<typeof bookmarkService.removeBookmark>
const mockIsBookmarked = bookmarkService.isBookmarked as jest.MockedFunction<typeof bookmarkService.isBookmarked>
const mockGetBookmarks = bookmarkService.getBookmarks as jest.MockedFunction<typeof bookmarkService.getBookmarks>

beforeEach(() => {
  jest.clearAllMocks()
  mockIsBookmarked.mockReturnValue(false)
  mockGetBookmarks.mockReturnValue([])
})

describe('useBookmark', () => {
  it('initialises saved state from isBookmarked', () => {
    mockIsBookmarked.mockReturnValue(true)
    const { result } = renderHook(() => useBookmark('r1', 'Restaurant A'))
    expect(result.current.saved).toBe(true)
  })

  it('toggles from unsaved to saved', () => {
    mockIsBookmarked.mockReturnValue(false)
    const { result } = renderHook(() => useBookmark('r1', 'Restaurant A'))
    act(() => { result.current.toggle() })
    expect(mockAddBookmark).toHaveBeenCalledWith({ id: 'r1', name: 'Restaurant A' })
    expect(result.current.saved).toBe(true)
  })

  it('toggles from saved to unsaved', () => {
    mockIsBookmarked.mockReturnValue(true)
    const { result } = renderHook(() => useBookmark('r1', 'Restaurant A'))
    act(() => { result.current.toggle() })
    expect(mockRemoveBookmark).toHaveBeenCalledWith('r1')
    expect(result.current.saved).toBe(false)
  })
})

describe('useBookmarkList', () => {
  it('loads bookmarks on mount', () => {
    mockGetBookmarks.mockReturnValue([{ id: 'r1', name: 'A' }, { id: 'r2', name: 'B' }])
    const { result } = renderHook(() => useBookmarkList())
    expect(result.current.bookmarks).toHaveLength(2)
  })

  it('removes bookmark from list', () => {
    mockGetBookmarks.mockReturnValue([{ id: 'r1', name: 'A' }, { id: 'r2', name: 'B' }])
    const { result } = renderHook(() => useBookmarkList())
    act(() => { result.current.remove('r1') })
    expect(mockRemoveBookmark).toHaveBeenCalledWith('r1')
    expect(result.current.bookmarks.map((r) => r.id)).toEqual(['r2'])
  })
})
