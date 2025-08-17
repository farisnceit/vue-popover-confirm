import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmRoot from '../src/ConfirmRoot.vue'
import { confirmManager } from '../src/manager'

describe('ConfirmRoot Component', () => {
  beforeEach(() => {
    confirmManager.hide()
    vi.clearAllMocks()
  })

  it('should not render when not visible', () => {
    const wrapper = mount(ConfirmRoot)
    expect(wrapper.find('.vpc').exists()).toBe(false)
  })

  it('should render when visible', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc').exists()).toBe(true)
    expect(wrapper.find('.vpc__message').text()).toBe('Test message')
  })

  it('should render with title', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      title: 'Test Title'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc__title').exists()).toBe(true)
    expect(wrapper.find('.vpc__title').text()).toBe('Test Title')
  })

  it('should render with icon', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      icon: '⚠️'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc__icon').exists()).toBe(true)
    expect(wrapper.find('.vpc__icon span').text()).toBe('⚠️')
  })

  it('should render with close button', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      showCloseButton: true
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc__close').exists()).toBe(true)
  })

  it('should render loading overlay when loading', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      loading: true
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc__loading-overlay').exists()).toBe(true)
    expect(wrapper.find('.vpc__spinner').exists()).toBe(true)
  })

  it('should apply theme classes', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      theme: 'danger'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc--theme-danger').exists()).toBe(true)
  })

  it('should apply size classes', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      size: 'large'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc--size-large').exists()).toBe(true)
  })

  it('should apply custom class', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      customClass: 'my-custom-class'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.my-custom-class').exists()).toBe(true)
  })

  it('should handle confirm button click', async () => {
    const onConfirm = vi.fn()
    const targetElement = document.createElement('button')
    
    confirmManager.show({
      message: 'Test message',
      onConfirm
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const confirmButton = wrapper.find('.vpc__button--confirm')
    await confirmButton.trigger('click')

    expect(onConfirm).toHaveBeenCalled()
  })

  it('should handle cancel button click', async () => {
    const onCancel = vi.fn()
    const targetElement = document.createElement('button')
    
    confirmManager.show({
      message: 'Test message',
      onCancel
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const cancelButton = wrapper.find('.vpc__button--cancel')
    await cancelButton.trigger('click')

    expect(onCancel).toHaveBeenCalled()
  })

  it('should handle close button click', async () => {
    const onCancel = vi.fn()
    const targetElement = document.createElement('button')
    
    confirmManager.show({
      message: 'Test message',
      showCloseButton: true,
      onCancel
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const closeButton = wrapper.find('.vpc__close')
    await closeButton.trigger('click')

    expect(onCancel).toHaveBeenCalled()
  })

  it('should handle keyboard events', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const popover = wrapper.find('.vpc')

    // Test Escape key
    await popover.trigger('keydown', { key: 'Escape' })
    expect(confirmManager.isVisible()).toBe(false)

    // Reset for next test
    confirmManager.show({ message: 'Test message' }, targetElement)
    await wrapper.vm.$nextTick()

    // Test Enter key
    const confirmSpy = vi.spyOn(confirmManager, 'confirm')
    await popover.trigger('keydown', { key: 'Enter' })
    expect(confirmSpy).toHaveBeenCalled()
  })

  it('should disable buttons when disabled', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      disabled: true
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const confirmButton = wrapper.find('.vpc__button--confirm')
    const cancelButton = wrapper.find('.vpc__button--cancel')

    expect(confirmButton.attributes('disabled')).toBeDefined()
    expect(cancelButton.attributes('disabled')).toBeDefined()
  })

  it('should render HTML content when html option is true', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: '<strong>Bold</strong> message',
      html: true
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const messageElement = wrapper.find('.vpc__message')
    expect(messageElement.html()).toContain('<strong>Bold</strong>')
  })

  it('should apply custom styles', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      zIndex: 9999,
      maxWidth: 400,
      minWidth: 250
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const popover = wrapper.find('.vpc')
    const style = popover.attributes('style')
    
    expect(style).toContain('z-index: 9999')
    expect(style).toContain('max-width: 400px')
    expect(style).toContain('min-width: 250px')
  })

  it('should show button spinner when loading', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      loading: true
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vpc__button-spinner').exists()).toBe(true)
  })

  it('should handle transition animation', async () => {
    const targetElement = document.createElement('button')
    confirmManager.show({
      message: 'Test message',
      animation: 'scale'
    }, targetElement)

    const wrapper = mount(ConfirmRoot)
    await wrapper.vm.$nextTick()

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.props('name')).toBe('vpc-scale')
  })
})