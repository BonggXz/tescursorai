import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toHaveClass('bg-destructive')
  })
})

// Example utility function test
import { formatPrice, slugify, formatBytes } from '@/lib/utils'

describe('Utility Functions', () => {
  it('formats price correctly', () => {
    expect(formatPrice(1499)).toBe('$14.99')
    expect(formatPrice(0)).toBe('$0.00')
    expect(formatPrice(10000)).toBe('$100.00')
  })

  it('slugifies text correctly', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Advanced Combat System')).toBe('advanced-combat-system')
    expect(slugify('UI Kit (Modern)')).toBe('ui-kit-modern')
  })

  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1048576)).toBe('1 MB')
  })
})
