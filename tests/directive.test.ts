import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vConfirm } from '../src/directive'
import { confirmManager } from '../src/manager'

describe('vConfirm Directive', () => {
  beforeEach(() => {
    confirmManager.hide()
    vi.clearAllMocks()
  })

  it('should register click handler on mount', () => {
    const wrapper = mount({
      template: '<button v-confirm="\'Are you sure?\'" id="test-btn">Delete</button>',
      directives: { confirm: vConfirm }
    })

    const button = wrapper.find('#test-btn')
    expect(button.exists()).toBe(true)

    // Check if handler is attached (we can't directly test the handler, but we can test the result)
    const element = button.element as any
    expect(element._vConfirmHandler).toBeDefined()
  })

  it('should show confirmation on click with string value', async () => {
    const wrapper = mount({
      template: '<button v-confirm="\'Are you sure?\'" id="test-btn">Delete</button>',
      directives: { confirm: vConfirm }
    })

    const button = wrapper.find('#test-btn')
    await button.trigger('click')

    expect(confirmManager.isVisible()).toBe(true)
    expect(confirmManager.state.message).toBe('Are you sure?')
  })

  it('should show confirmation on click with object value', async () => {
    const wrapper = mount({
      template: '<button v-confirm="options" id="test-btn">Delete</button>',
      data() {
        return {
          options: {
            message: 'Delete this item?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            theme: 'danger'
          }
        }
      },
      directives: { confirm: vConfirm }
    })

    const button = wrapper.find('#test-btn')
    await button.trigger('click')

    expect(confirmManager.isVisible()).toBe(true)
    expect(confirmManager.state.message).toBe('Delete this item?')
    expect(confirmManager.state.confirmText).toBe('Delete')
    expect(confirmManager.state.cancelText).toBe('Cancel')
    expect(confirmManager.state.theme).toBe('danger')
  })

  it('should prevent default click behavior', async () => {
    const clickHandler = vi.fn()
    const wrapper = mount({
      template: '<button v-confirm="\'Are you sure?\'" @click="handleClick" id="test-btn">Delete</button>',
      methods: {
        handleClick: clickHandler
      },
      directives: { confirm: vConfirm }
    })

    const button = wrapper.find('#test-btn')
    await button.trigger('click')

    // The original click handler should not be called due to preventDefault
    expect(clickHandler).not.toHaveBeenCalled()
    expect(confirmManager.isVisible()).toBe(true)
  })

  it('should update when directive value changes', async () => {
    const wrapper = mount({
      template: '<button v-confirm="message" id="test-btn">Delete</button>',
      data() {
        return {
          message: 'First message'
        }
      },
      directives: { confirm: vConfirm }
    })

    // First click
    const button = wrapper.find('#test-btn')
    await button.trigger('click')
    expect(confirmManager.state.message).toBe('First message')
    confirmManager.hide()

    // Update message
    await wrapper.setData({ message: 'Second message' })
    await button.trigger('click')
    expect(confirmManager.state.message).toBe('Second message')
  })

  it('should clean up handler on unmount', () => {
    const wrapper = mount({
      template: '<button v-confirm="\'Are you sure?\'" id="test-btn">Delete</button>',
      directives: { confirm: vConfirm }
    })

    const button = wrapper.find('#test-btn')
    const element = button.element as any
    
    expect(element._vConfirmHandler).toBeDefined()

    wrapper.unmount()

    expect(element._vConfirmHandler).toBeUndefined()
  })

  it('should handle dynamic options with callbacks', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    const wrapper = mount({
      template: '<button v-confirm="options" id="test-btn">Delete</button>',
      data() {
        return {
          options: {
            message: 'Delete item?',
            onConfirm,
            onCancel
          }
        }
      },
      directives: { confirm: vConfirm }
    })

    const button = wrapper.find('#test-btn')
    await button.trigger('click')

    expect(confirmManager.isVisible()).toBe(true)
    expect(confirmManager.state.onConfirm).toBe(onConfirm)
    expect(confirmManager.state.onCancel).toBe(onCancel)
  })

  it('should work with different HTML elements', async () => {
    const wrapper = mount({
      template: `
        <div>
          <a v-confirm="'Link confirm'" href="#" id="link">Link</a>
          <div v-confirm="'Div confirm'" id="div">Div</div>
          <span v-confirm="'Span confirm'" id="span">Span</span>
        </div>
      `,
      directives: { confirm: vConfirm }
    })

    // Test link
    const link = wrapper.find('#link')
    await link.trigger('click')
    expect(confirmManager.state.message).toBe('Link confirm')
    confirmManager.hide()

    // Test div
    const div = wrapper.find('#div')
    await div.trigger('click')
    expect(confirmManager.state.message).toBe('Div confirm')
    confirmManager.hide()

    // Test span
    const span = wrapper.find('#span')
    await span.trigger('click')
    expect(confirmManager.state.message).toBe('Span confirm')
  })
})