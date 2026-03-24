"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, Star, Store, User, CalendarDays } from "lucide-react"
import dayjs from "dayjs"
import getAllReviews from "@/libs/getAllReviews"
import { ReviewItem } from "../../interface"

type RestaurantGroup = {
    restaurantId: string
    restaurantName: string
    reviews: ReviewItem[]
    avgRating: string
}

export default function AdminReviewList() {
    const { data: session } = useSession()
    const token = (session?.user as any)?.token

    const [reviews, setReviews] = useState<ReviewItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchReviews = async () => {
            if (!token) return

            try {
                setLoading(true)
                setError("")
                const data = await getAllReviews(token)
                setReviews(data.data || [])
            } catch (err: any) {
                setError(err.message || "Failed to load reviews")
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [token])

    const groupedReviews = useMemo<RestaurantGroup[]>(() => {
        const map = new Map<string, RestaurantGroup>()

        for (const review of reviews) {
            const restaurantId =
                typeof review.restaurant === "string"
                    ? review.restaurant
                    : review.restaurant?._id || "unknown"

            const restaurantName =
                typeof review.restaurant === "string"
                    ? review.restaurant
                    : review.restaurant?.name || "Unknown Restaurant"

            if (!map.has(restaurantId)) {
                map.set(restaurantId, {
                    restaurantId,
                    restaurantName,
                    reviews: [],
                    avgRating: "0.0",
                })
            }

            map.get(restaurantId)!.reviews.push(review)
        }

        const result = Array.from(map.values()).map((group) => {
            const avg =
                group.reviews.reduce((sum, r) => sum + r.rating, 0) / group.reviews.length

            return {
                ...group,
                avgRating: avg.toFixed(1),
            }
        })

        result.sort((a, b) => a.restaurantName.localeCompare(b.restaurantName))
        return result
    }, [reviews])

    if (loading) {
        return (
            <p className="text-gray-600 text-sm tracking-widest uppercase">
                Loading reviews...
            </p>
        )
    }

    if (error) {
        return (
            <p className="text-red-500 text-sm tracking-widest uppercase">
                {error}
            </p>
        )
    }

    if (groupedReviews.length === 0) {
        return (
            <p className="text-gray-600 text-sm tracking-widest uppercase">
                No Reviews Found
            </p>
        )
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {groupedReviews.map((group) => (
                <div
                    key={group.restaurantId}
                    className="bg-[#111] border border-yellow-600/20 p-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 pb-5 border-b border-yellow-600/10">
                        <div>
                            <div className="flex items-center gap-2 text-yellow-500 mb-1">
                                <Store size={16} />
                                <h3 className="text-lg">{group.restaurantName}</h3>
                            </div>
                            <p className="text-gray-500 text-xs tracking-widest uppercase">
                                {group.reviews.length}{" "}
                                {group.reviews.length === 1 ? "review" : "reviews"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Star size={15} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-white">{group.avgRating}</span>
                            <span className="text-gray-500">average rating</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {group.reviews.map((review) => {
                            const userName =
                                typeof review.user === "string"
                                    ? review.user
                                    : review.user?.name || review.user?._id || "Unknown User"

                            return (
                                <div
                                    key={review._id}
                                    className="border border-gray-800 bg-black/30 p-4"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                       <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-gray-300 text-sm">
        <User size={13} className="text-yellow-600/60" />
        <span>{userName}</span>
    </div>

    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
            <span
                key={s}
                className={`text-lg ${
                    review.rating >= s ? "text-yellow-400" : "text-gray-700"
                }`}
            >
                ★
            </span>
        ))}
        <span className="ml-2 text-gray-400 text-sm">{review.rating}/5</span>
    </div>

    <p className="text-sm text-gray-400 whitespace-pre-line">
        {review.description?.trim() || "No description"}
    </p>
</div>

                                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                                            <CalendarDays size={13} className="text-yellow-600/60" />
                                            {dayjs(review.createdAt).format("DD MMM YYYY HH:mm")}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}