import { FALLBACK_COORDS, DEFAULT_CENTER, filterPinsWithCoords } from '../libs/mapUtils'

describe('mapUtils', () => {
  describe('DEFAULT_CENTER', () => {
    it('is set to Bangkok coordinates', () => {
      expect(DEFAULT_CENTER[0]).toBeCloseTo(13.7563, 2)
      expect(DEFAULT_CENTER[1]).toBeCloseTo(100.5018, 2)
    })
  })

  describe('FALLBACK_COORDS', () => {
    it('contains known restaurant names', () => {
      expect(FALLBACK_COORDS['The Grand Palace Dining']).toBeDefined()
      expect(FALLBACK_COORDS['Sushiro Premium Zen']).toBeDefined()
    })

    it('all coordinates are valid lat/lng tuples', () => {
      for (const [, coords] of Object.entries(FALLBACK_COORDS)) {
        const [lat, lng] = coords
        expect(lat).toBeGreaterThan(-90)
        expect(lat).toBeLessThan(90)
        expect(lng).toBeGreaterThan(-180)
        expect(lng).toBeLessThan(180)
      }
    })
  })

  describe('filterPinsWithCoords', () => {
    it('removes restaurants without lat/lng', () => {
      const restaurants = [
        { _id: '1', name: 'A', address: 'Addr 1', lat: 13.7, lng: 100.5 },
        { _id: '2', name: 'B', address: 'Addr 2' },
        { _id: '3', name: 'C', address: 'Addr 3', lat: 13.8, lng: 100.6 },
      ]
      const pins = filterPinsWithCoords(restaurants)
      expect(pins).toHaveLength(2)
      expect(pins.map((p) => p._id)).toEqual(['1', '3'])
    })

    it('returns empty array when no restaurants have coords', () => {
      const restaurants = [
        { _id: '1', name: 'A', address: 'Addr 1' },
      ]
      expect(filterPinsWithCoords(restaurants)).toHaveLength(0)
    })

    it('returns all when all have coords', () => {
      const restaurants = [
        { _id: '1', name: 'A', address: 'Addr 1', lat: 13.7, lng: 100.5 },
        { _id: '2', name: 'B', address: 'Addr 2', lat: 13.8, lng: 100.6 },
      ]
      expect(filterPinsWithCoords(restaurants)).toHaveLength(2)
    })

    it('returns empty array for empty input', () => {
      expect(filterPinsWithCoords([])).toHaveLength(0)
    })
  })
})
