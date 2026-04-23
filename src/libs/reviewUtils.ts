export const RATING_LABELS: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
}

export const MAX_DESCRIPTION = 500

export function validateReviewInput(rating: number, description: string): string | null {
    if (!rating || rating < 1) return 'Please select a star rating'
    if (description.length > MAX_DESCRIPTION) return `Description must be ${MAX_DESCRIPTION} characters or fewer`
    return null
}

export function buildReviewPayload(rating: number, description: string) {
    return {
        rating,
        description: description.trim(),
    }
}
