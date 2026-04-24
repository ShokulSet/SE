export const DEFAULT_CENTER: [number, number] = [13.7563, 100.5018]

export const FALLBACK_COORDS: Record<string, [number, number]> = {
    'ร้านอาหารป่ามหาเฮง V99':    [13.7563, 100.5018],
    'The Grand Palace Dining':     [13.7500, 100.4927],
    'Sushiro Premium Zen':         [13.7450, 100.5340],
    'Pony Sweet Cafe':             [13.7620, 100.5660],
    'ครัวเจ๊ง้อ สาขาต้นตำรับ':   [13.7380, 100.5100],
    'ครัวเจ๊ง้อ สาขา2':           [13.7290, 100.5250],
}

export interface RestaurantPinData {
    _id: string
    name: string
    address: string
    tel?: string
    lat?: number
    lng?: number
}

export function filterPinsWithCoords(restaurants: RestaurantPinData[]): RestaurantPinData[] {
    return restaurants.filter((r) => r.lat !== undefined && r.lng !== undefined)
}

export function resolveCoords(name: string, lat?: number, lng?: number): [number, number] | undefined {
    if (lat !== undefined && lng !== undefined) return [lat, lng]
    return FALLBACK_COORDS[name]
}
