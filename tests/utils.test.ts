import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate, slugify, parseJsonField } from '@/lib/utils'

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format cents to dollar amount', () => {
      expect(formatPrice(1999)).toBe('$19.99')
      expect(formatPrice(100)).toBe('$1.00')
      expect(formatPrice(0)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('should format date string', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('Jan')
    })
  })

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Advanced UI Kit Pro')).toBe('advanced-ui-kit-pro')
      expect(slugify('Test   Multiple    Spaces')).toBe('test-multiple-spaces')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello@World!')).toBe('helloworld')
      expect(slugify('Test & Demo')).toBe('test-demo')
    })
  })

  describe('parseJsonField', () => {
    it('should parse valid JSON', () => {
      expect(parseJsonField<string[]>('["tag1","tag2"]', [])).toEqual(['tag1', 'tag2'])
      expect(parseJsonField<Record<string, string>>('{"key":"value"}', {})).toEqual({ key: 'value' })
    })

    it('should return fallback for invalid JSON', () => {
      expect(parseJsonField<string[]>('invalid', [])).toEqual([])
      expect(parseJsonField<string[]>('', ['default'])).toEqual(['default'])
    })
  })
})
