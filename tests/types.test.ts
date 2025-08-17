import { describe, it, expect } from 'vitest'
import type {
  ConfirmOptions,
  ConfirmResult,
  ConfirmState,
  ConfirmTheme,
  ConfirmSize,
  ConfirmAnimation,
  GlobalConfirmConfig,
  ConfirmInstance,
  ConfirmDirectiveValue
} from '../src/types'

describe('TypeScript Types', () => {
  it('should have correct ConfirmOptions type', () => {
    const options: ConfirmOptions = {
      message: 'Test message',
      title: 'Test Title',
      confirmText: 'OK',
      cancelText: 'Cancel',
      theme: 'danger',
      size: 'large',
      animation: 'scale',
      placement: 'bottom',
      offset: 20,
      closeOnClickOutside: false,
      closeOnEscape: true,
      showCloseButton: true,
      persistent: false,
      loading: false,
      disabled: false,
      autoFocus: 'cancel',
      customClass: 'custom',
      zIndex: 9999,
      maxWidth: 400,
      minWidth: 200,
      icon: '⚠️',
      html: true,
      timeout: 5000,
      onConfirm: async () => {},
      onCancel: () => {},
      onShow: () => {},
      onHide: () => {}
    }

    expect(options.message).toBe('Test message')
    expect(options.theme).toBe('danger')
    expect(options.size).toBe('large')
    expect(options.animation).toBe('scale')
  })

  it('should have correct ConfirmResult type', () => {
    const result: ConfirmResult = {
      confirmed: true,
      cancelled: false,
      value: 'test'
    }

    expect(result.confirmed).toBe(true)
    expect(result.cancelled).toBe(false)
    expect(result.value).toBe('test')
  })

  it('should have correct theme types', () => {
    const themes: ConfirmTheme[] = [
      'default',
      'dark',
      'danger',
      'success',
      'warning',
      'minimal'
    ]

    expect(themes).toHaveLength(6)
    expect(themes).toContain('danger')
  })

  it('should have correct size types', () => {
    const sizes: ConfirmSize[] = ['small', 'medium', 'large']

    expect(sizes).toHaveLength(3)
    expect(sizes).toContain('medium')
  })

  it('should have correct animation types', () => {
    const animations: ConfirmAnimation[] = ['fade', 'scale', 'slide', 'none']

    expect(animations).toHaveLength(4)
    expect(animations).toContain('scale')
  })

  it('should have correct GlobalConfirmConfig type', () => {
    const config: GlobalConfirmConfig = {
      confirmText: 'OK',
      cancelText: 'No',
      theme: 'dark',
      size: 'small',
      animation: 'fade',
      placement: 'top',
      offset: 10,
      closeOnClickOutside: true,
      closeOnEscape: false,
      showCloseButton: true,
      autoFocus: 'none',
      zIndex: 8888,
      maxWidth: 350,
      minWidth: 150
    }

    expect(config.theme).toBe('dark')
    expect(config.confirmText).toBe('OK')
  })

  it('should have correct ConfirmDirectiveValue type', () => {
    // String value
    const stringValue: ConfirmDirectiveValue = 'Are you sure?'
    expect(typeof stringValue).toBe('string')

    // Object value
    const objectValue: ConfirmDirectiveValue = {
      message: 'Delete item?',
      theme: 'danger'
    }
    expect(typeof objectValue).toBe('object')
    expect(objectValue.message).toBe('Delete item?')
  })

  it('should have correct ConfirmInstance type', () => {
    const instance: ConfirmInstance = {
      id: 'test-id',
      options: { message: 'Test' },
      targetElement: document.createElement('button'),
      resolve: () => {},
      reject: () => {}
    }

    expect(instance.id).toBe('test-id')
    expect(instance.options.message).toBe('Test')
    expect(instance.targetElement.tagName).toBe('BUTTON')
  })

  it('should allow partial options', () => {
    // Minimal required options
    const minimalOptions: ConfirmOptions = {
      message: 'Just a message'
    }

    expect(minimalOptions.message).toBe('Just a message')

    // Partial options
    const partialOptions: ConfirmOptions = {
      message: 'Partial message',
      theme: 'success',
      size: 'large'
    }

    expect(partialOptions.theme).toBe('success')
    expect(partialOptions.size).toBe('large')
  })

  it('should support callback function types', () => {
    const syncCallback = () => {
      console.log('sync')
    }

    const asyncCallback = async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    const options: ConfirmOptions = {
      message: 'Test',
      onConfirm: syncCallback,
      onCancel: asyncCallback
    }

    expect(typeof options.onConfirm).toBe('function')
    expect(typeof options.onCancel).toBe('function')
  })

  it('should support icon types', () => {
    // String icon
    const stringIcon: ConfirmOptions = {
      message: 'Test',
      icon: '⚠️'
    }

    // Boolean icon
    const booleanIcon: ConfirmOptions = {
      message: 'Test',
      icon: true
    }

    // No icon
    const noIcon: ConfirmOptions = {
      message: 'Test',
      icon: false
    }

    expect(stringIcon.icon).toBe('⚠️')
    expect(booleanIcon.icon).toBe(true)
    expect(noIcon.icon).toBe(false)
  })
})