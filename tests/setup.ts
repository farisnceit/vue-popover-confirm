import { vi } from 'vitest'

// Mock Floating UI
vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({
    x: 100,
    y: 100,
    placement: 'top',
    middlewareData: {
      arrow: { x: 10, y: 10 }
    }
  }),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  arrow: vi.fn(),
  autoUpdate: vi.fn().mockReturnValue(() => {})
}))

// Mock window methods
Object.defineProperty(window, 'setTimeout', {
  value: vi.fn((fn) => fn()),
  writable: true
})

Object.defineProperty(window, 'clearTimeout', {
  value: vi.fn(),
  writable: true
})

// Mock document.body for teleport
Object.defineProperty(document, 'body', {
  value: document.createElement('body'),
  writable: true
})

// Mock focus methods
HTMLElement.prototype.focus = vi.fn()
HTMLElement.prototype.blur = vi.fn()

// Mock getBoundingClientRect
HTMLElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: vi.fn()
})