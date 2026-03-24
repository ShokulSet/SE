export interface VenueItem {
    _id: string
    name: string
    address: string
    tel: string
    opentime: string
    closetime: string
    averageRating: string
    reviewCount: number
    reservations?: any[]
    __v: number
}

export interface VenueJson {
    success: boolean
    count: number
    pagination: Object
    data: VenueItem[]
}

export interface BookingItem {
    nameLastname: string
    tel: string
    venue: string
    bookDate: string
}

export interface ReviewItem {
    _id: string
    rating: number
    description?: string
    user: string | { _id: string; name?: string; email?: string }
    restaurant:
        | string
        | {
              _id: string
              name?: string
              address?: string
          }
    createdAt: string
}

export interface ReviewJson {
    success: boolean
    count: number
    data: ReviewItem[]
}