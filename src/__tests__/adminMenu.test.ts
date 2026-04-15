import { validateMenuForm } from '../libs/menuValidation'

describe('Admin Menu — normal, empty, and failure cases', () => {
  describe('normal case', () => {
    it('valid menu data passes validation', () => {
      const errors = validateMenuForm({ name: 'Green Curry', price: '150', category: 'Main' })
      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('accepts decimal price', () => {
      const errors = validateMenuForm({ name: 'Coffee', price: '49.50', category: 'Beverage' })
      expect(errors.price).toBeUndefined()
    })

    it('accepts price of zero (complimentary item)', () => {
      const errors = validateMenuForm({ name: 'Complimentary Bread', price: '0', category: 'Extra' })
      expect(errors.price).toBeUndefined()
    })
  })

  describe('empty case', () => {
    it('returns error for empty name', () => {
      const errors = validateMenuForm({ name: '', price: '100', category: 'Main' })
      expect(errors.name).toBeDefined()
    })

    it('returns error for empty category', () => {
      const errors = validateMenuForm({ name: 'Pad Thai', price: '120', category: '' })
      expect(errors.category).toBeDefined()
    })

    it('returns error for empty price', () => {
      const errors = validateMenuForm({ name: 'Pad Thai', price: '', category: 'Main' })
      expect(errors.price).toBeDefined()
    })

    it('returns all errors when all fields empty', () => {
      const errors = validateMenuForm({ name: '', price: '', category: '' })
      expect(Object.keys(errors)).toHaveLength(3)
    })
  })

  describe('failure case', () => {
    it('rejects negative price', () => {
      const errors = validateMenuForm({ name: 'Pad Thai', price: '-10', category: 'Main' })
      expect(errors.price).toBeDefined()
    })

    it('rejects non-numeric price', () => {
      const errors = validateMenuForm({ name: 'Pad Thai', price: 'free', category: 'Main' })
      expect(errors.price).toBeDefined()
    })

    it('rejects single character name', () => {
      const errors = validateMenuForm({ name: 'A', price: '100', category: 'Main' })
      expect(errors.name).toBeDefined()
    })
  })
})
