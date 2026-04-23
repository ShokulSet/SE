"use client"

import { useState } from "react"
import { ReviewItem } from "../../interface"

const BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1`

const RATING_LABELS: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
}

const MAX_DESCRIPTION = 500

interface Props {
    venueId: string
    token: string | null
    userId: string | null
    initialReviews: ReviewItem[]
}

export default function RatingReview({ venueId, token, userId, initialReviews }: Props) {
    const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
    const [hovered, setHovered] = useState(0)
    const [selected, setSelected] = useState(0)
    const [description, setDescription] = useState("")

    const [isEditing, setIsEditing] = useState(false)
    const [editSelected, setEditSelected] = useState(0)
    const [editHovered, setEditHovered] = useState(0)
    const [editDescription, setEditDescription] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const myReview = reviews.find((r) => {
        const uid = typeof r.user === "string" ? r.user : r.user._id
        return uid === userId
    })

    const avg =
        reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : null

    async function handleSubmit() {
        if (!selected || !token) return
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${BASE}/restaurants/${venueId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating: selected,
                    description: description,
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to submit review")
            }

            const json = await res.json()
            setReviews((prev) => [...prev, json.data])
            setSelected(0)
            setDescription("")
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdate() {
        if (!editSelected || !token || !myReview) return
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${BASE}/reviews/${myReview._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating: editSelected,
                    description: editDescription,
                }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to update review")
            }

            const json = await res.json()
            setReviews((prev) => prev.map((r) => (r._id === myReview._id ? json.data : r)))
            setIsEditing(false)
            setEditSelected(0)
            setEditDescription("")
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10 border-t border-yellow-600/20 pt-8">
            <h2 className="font-playfair text-xl text-yellow-500 mb-5">Ratings & Reviews</h2>

            <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl font-bold text-white">{avg ?? "—"}</span>
                <div>
                    <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <span
                                key={s}
                                className={`text-xl ${
                                    avg && parseFloat(avg) >= s ? "text-yellow-400" : "text-gray-700"
                                }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="text-gray-500 text-xs tracking-widest uppercase">
                        {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                </div>
            </div>

            {myReview && !isEditing && (
                <div className="mb-6 p-4 border border-yellow-600/30 bg-yellow-500/5">
                    <span className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                        Your Review
                    </span>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                    key={s}
                                    className={`text-2xl ${
                                        myReview.rating >= s ? "text-yellow-400" : "text-gray-700"
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setEditSelected(myReview.rating)
                                setEditDescription(myReview.description || "")
                                setIsEditing(true)
                            }}
                            className="text-xs text-yellow-500 border border-yellow-500 px-3 py-1
                                       hover:bg-yellow-500 hover:text-black transition-all duration-200"
                        >
                            Edit
                        </button>
                    </div>

                    <p className="text-sm text-gray-300 whitespace-pre-line">
                        {myReview.description?.trim() || "No description"}
                    </p>
                </div>
            )}

            {myReview && isEditing && (
                <div className="mb-6 p-4 border border-yellow-600/30 bg-yellow-500/5">
                    <span className="text-xs text-gray-500 uppercase tracking-widest mb-3 block">
                        Edit Your Review
                    </span>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onMouseEnter={() => setEditHovered(s)}
                                    onMouseLeave={() => setEditHovered(0)}
                                    onClick={() => setEditSelected(s)}
                                    className={`text-3xl transition-all duration-150 ${
                                        (editHovered || editSelected) >= s
                                            ? "text-yellow-400 scale-110"
                                            : "text-gray-700 hover:text-gray-500"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        {(editHovered || editSelected) > 0 && (
                            <span className="text-yellow-400 text-xs font-medium tracking-wide">
                                {RATING_LABELS[editHovered || editSelected]}
                            </span>
                        )}
                    </div>

                    <div className="relative mb-4">
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value.slice(0, MAX_DESCRIPTION))}
                            rows={4}
                            placeholder="Write your review description..."
                            className="w-full bg-black/40 border border-gray-700 px-3 py-2 text-sm text-white
                                       focus:outline-none focus:border-yellow-500 resize-none"
                        />
                        <span className="absolute bottom-2 right-2 text-xs text-gray-600">
                            {editDescription.length}/{MAX_DESCRIPTION}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={loading || !editSelected}
                            className="text-xs px-5 py-1.5 bg-yellow-500 text-black font-medium
                                       hover:bg-yellow-400 transition disabled:opacity-40"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                            onClick={() => {
                                setIsEditing(false)
                                setEditSelected(0)
                                setEditDescription("")
                            }}
                            className="text-xs px-5 py-1.5 border border-gray-700 text-gray-400
                                       hover:border-gray-500 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {!myReview && token && (
                <div className="mb-6 p-4 border border-yellow-600/30 bg-yellow-500/5">
                    <span className="text-xs text-gray-500 uppercase tracking-widest mb-3 block">
                        Leave a Review
                    </span>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onMouseEnter={() => setHovered(s)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setSelected(s)}
                                    className={`text-3xl transition-all duration-150 ${
                                        (hovered || selected) >= s
                                            ? "text-yellow-400 scale-110"
                                            : "text-gray-700 hover:text-gray-500"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        {(hovered || selected) > 0 && (
                            <span className="text-yellow-400 text-xs font-medium tracking-wide">
                                {RATING_LABELS[hovered || selected]}
                            </span>
                        )}
                    </div>

                    <div className="relative mb-4">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION))}
                            rows={4}
                            placeholder="Write your review description..."
                            className="w-full bg-black/40 border border-gray-700 px-3 py-2 text-sm text-white
                                       focus:outline-none focus:border-yellow-500 resize-none"
                        />
                        <span className="absolute bottom-2 right-2 text-xs text-gray-600">
                            {description.length}/{MAX_DESCRIPTION}
                        </span>
                    </div>

                    {!selected && (
                        <p className="text-yellow-700 text-xs mb-3">Please select a star rating before submitting.</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selected}
                        className="text-xs px-5 py-1.5 bg-yellow-500 text-black font-medium
                                   hover:bg-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            )}

            {!token && (
                <p className="text-gray-600 text-sm">
                    <a href="/signin" className="text-yellow-500 hover:underline">
                        Sign in
                    </a>{" "}
                    to leave a review.
                </p>
            )}

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            <div className="mt-8 flex flex-col gap-4">
                {reviews.map((review) => {
                    const userName =
                        typeof review.user === "string"
                            ? "User"
                            : review.user?.name || review.user?.email || "User"

                    return (
                        <div
                            key={review._id}
                            className="border border-yellow-600/10 bg-[#111] p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-300">{userName}</span>
                                <div className="flex gap-0.5">
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
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 whitespace-pre-line">
                                {review.description?.trim() || "No description"}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}