import { RATING_LABELS, MAX_DESCRIPTION, buildReviewPayload, validateReviewInput } from '../libs/reviewUtils'

describe('reviewUtils', () => {
  describe('RATING_LABELS', () => {
    it('returns correct label for each star value', () => {
      expect(RATING_LABELS[1]).toBe('Poor')
      expect(RATING_LABELS[2]).toBe('Fair')
      expect(RATING_LABELS[3]).toBe('Good')
      expect(RATING_LABELS[4]).toBe('Very Good')
      expect(RATING_LABELS[5]).toBe('Excellent')
    })
  })

  describe('MAX_DESCRIPTION', () => {
    it('is 500 characters', () => {
      expect(MAX_DESCRIPTION).toBe(500)
    })
  })

  describe('validateReviewInput', () => {
    it('returns error when rating is 0', () => {
      const result = validateReviewInput(0, 'Some comment')
      expect(result).toBe('Please select a star rating')
    })

    it('returns null when rating is valid and description is empty', () => {
      const result = validateReviewInput(3, '')
      expect(result).toBeNull()
    })

    it('returns error when description exceeds max length', () => {
      const longText = 'a'.repeat(501)
      const result = validateReviewInput(4, longText)
      expect(result).toBe('Description must be 500 characters or fewer')
    })

    it('returns null for valid input with description', () => {
      const result = validateReviewInput(5, 'Great food!')
      expect(result).toBeNull()
    })

    it('accepts description at exactly MAX_DESCRIPTION characters', () => {
      const text = 'a'.repeat(500)
      const result = validateReviewInput(3, text)
      expect(result).toBeNull()
    })
  })

  describe('buildReviewPayload', () => {
    it('creates correct payload with rating and description', () => {
      const payload = buildReviewPayload(4, 'Nice place')
      expect(payload).toEqual({ rating: 4, description: 'Nice place' })
    })

    it('trims whitespace from description', () => {
      const payload = buildReviewPayload(3, '  Great food  ')
      expect(payload.description).toBe('Great food')
    })

    it('handles empty description', () => {
      const payload = buildReviewPayload(5, '')
      expect(payload.description).toBe('')
    })
  })
})
