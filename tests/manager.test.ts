import { describe, it, expect, beforeEach, vi } from 'vitest'
import { confirmManager } from '../src/manager'
import type { ConfirmOptions } from '../src/types'

describe('ConfirmManager', () => {
  beforeEach(() => {
    // Reset manager state before each test
    confirmManager.hide()
    vi.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('should initialize with default state', () => {
      expect(confirmManager.isVisible()).toBe(false)
      expect(confirmManager.state.theme).toBe('default')
      expect(confirmManager.state.size).toBe('medium')
      expect(confirmManager.state.animation).toBe('fade')
    })

    it('should show confirmation with basic options', async () => {
      const targetElement = document.createElement('button')
      const options: ConfirmOptions = {
        message: 'Are you sure?'
      }

      const promise = confirmManager.show(options, targetElement)
      
      expect(confirmManager.isVisible()).toBe(true)
      expect(confirmManager.state.message).toBe('Are you sure?')
      expect(confirmManager.state.targetElement).toBe(targetElement)

      // Simulate confirm
      confirmManager.confirm()
      const result = await promise
      
      expect(result.confirmed).toBe(true)
      expect(result.cancelled).toBe(false)
    })

    it('should hide confirmation', () => {
      const targetElement = document.createElement('button')
      confirmManager.show({ message: 'Test' }, targetElement)
      
      expect(confirmManager.isVisible()).toBe(true)
      
      confirmManager.hide()
      
      expect(confirmManager.isVisible()).toBe(false)
    })
  })

  describe('Configuration', () => {
    it('should set and get global configuration', () => {
      const config = {
        theme: 'dark' as const,
        animation: 'scale' as const,
        confirmText: 'OK',
        cancelText: 'No'
      }

      confirmManager.setGlobalConfig(config)
      const retrievedConfig = confirmManager.getGlobalConfig()

      expect(retrievedConfig).toEqual(config)
    })

    it('should merge global config with options', async () => {
      confirmManager.setGlobalConfig({
        theme: 'danger',
        confirmText: 'Delete'
      })

      const targetElement = document.createElement('button')
      const promise = confirmManager.show({
        message: 'Delete item?',
        cancelText: 'Keep'
      }, targetElement)

      expect(confirmManager.state.theme).toBe('danger')
      expect(confirmManager.state.confirmText).toBe('Delete')
      expect(confirmManager.state.cancelText).toBe('Keep')

      confirmManager.confirm()
      await promise
    })
  })

  describe('Convenience methods', () => {
    it('should ask for confirmation', async () => {
      const promise = confirmManager.ask('Continue?')
      
      expect(confirmManager.isVisible()).toBe(true)
      expect(confirmManager.state.message).toBe('Continue?')

      confirmManager.confirm()
      const result = await promise
      
      expect(result).toBe(true)
    })

    it('should show danger confirmation', async () => {
      const promise = confirmManager.danger('Delete all?')
      
      expect(confirmManager.state.theme).toBe('danger')
      expect(confirmManager.state.confirmText).toBe('Delete')

      confirmManager.confirm()
      const result = await promise
      
      expect(result).toBe(true)
    })

    it('should show success confirmation', async () => {
      const promise = confirmManager.success('Save changes?')
      
      expect(confirmManager.state.theme).toBe('success')
      expect(confirmManager.state.confirmText).toBe('Continue')

      confirmManager.confirm()
      const result = await promise
      
      expect(result).toBe(true)
    })

    it('should show warning confirmation', async () => {
      const promise = confirmManager.warning('Proceed anyway?')
      
      expect(confirmManager.state.theme).toBe('warning')
      expect(confirmManager.state.confirmText).toBe('Proceed')

      confirmManager.confirm()
      const result = await promise
      
      expect(result).toBe(true)
    })
  })

  describe('State management', () => {
    it('should set loading state', () => {
      confirmManager.setLoading(true)
      expect(confirmManager.state.loading).toBe(true)

      confirmManager.setLoading(false)
      expect(confirmManager.state.loading).toBe(false)
    })

    it('should set disabled state', () => {
      confirmManager.setDisabled(true)
      expect(confirmManager.state.disabled).toBe(true)

      confirmManager.setDisabled(false)
      expect(confirmManager.state.disabled).toBe(false)
    })

    it('should update message', () => {
      confirmManager.updateMessage('New message')
      expect(confirmManager.state.message).toBe('New message')
    })

    it('should update title', () => {
      confirmManager.updateTitle('New title')
      expect(confirmManager.state.title).toBe('New title')
    })
  })

  describe('Callbacks', () => {
    it('should call onConfirm callback', async () => {
      const onConfirm = vi.fn()
      const targetElement = document.createElement('button')
      
      const promise = confirmManager.show({
        message: 'Test',
        onConfirm
      }, targetElement)

      confirmManager.confirm()
      await promise

      expect(onConfirm).toHaveBeenCalled()
    })

    it('should call onCancel callback', async () => {
      const onCancel = vi.fn()
      const targetElement = document.createElement('button')
      
      const promise = confirmManager.show({
        message: 'Test',
        onCancel
      }, targetElement)

      confirmManager.cancel()
      await promise

      expect(onCancel).toHaveBeenCalled()
    })

    it('should handle async callbacks', async () => {
      const asyncCallback = vi.fn().mockResolvedValue(undefined)
      const targetElement = document.createElement('button')
      
      const promise = confirmManager.show({
        message: 'Test',
        onConfirm: asyncCallback
      }, targetElement)

      confirmManager.confirm()
      await promise

      expect(asyncCallback).toHaveBeenCalled()
    })
  })

  describe('Timeout functionality', () => {
    it('should auto-close after timeout', async () => {
      vi.useFakeTimers()
      
      const targetElement = document.createElement('button')
      const promise = confirmManager.show({
        message: 'Test',
        timeout: 1000
      }, targetElement)

      expect(confirmManager.isVisible()).toBe(true)

      // Fast-forward time
      vi.advanceTimersByTime(1000)

      const result = await promise
      expect(result.cancelled).toBe(true)
      expect(confirmManager.isVisible()).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('Error handling', () => {
    it('should handle callback errors', async () => {
      const errorCallback = vi.fn().mockRejectedValue(new Error('Test error'))
      const targetElement = document.createElement('button')
      
      const promise = confirmManager.show({
        message: 'Test',
        onConfirm: errorCallback
      }, targetElement)

      confirmManager.confirm()
      
      await expect(promise).rejects.toThrow('Test error')
    })
  })

  describe('Advanced options', () => {
    it('should handle all advanced options', async () => {
      const targetElement = document.createElement('button')
      const options: ConfirmOptions = {
        message: 'Advanced test',
        title: 'Test Title',
        theme: 'warning',
        size: 'large',
        animation: 'scale',
        placement: 'bottom',
        offset: 20,
        closeOnClickOutside: false,
        closeOnEscape: false,
        showCloseButton: true,
        persistent: true,
        autoFocus: 'cancel',
        customClass: 'custom-class',
        zIndex: 9999,
        maxWidth: 400,
        minWidth: 250,
        icon: '⚠️',
        html: true
      }

      const promise = confirmManager.show(options, targetElement)

      expect(confirmManager.state.title).toBe('Test Title')
      expect(confirmManager.state.theme).toBe('warning')
      expect(confirmManager.state.size).toBe('large')
      expect(confirmManager.state.animation).toBe('scale')
      expect(confirmManager.state.placement).toBe('bottom')
      expect(confirmManager.state.offset).toBe(20)
      expect(confirmManager.state.closeOnClickOutside).toBe(false)
      expect(confirmManager.state.closeOnEscape).toBe(false)
      expect(confirmManager.state.showCloseButton).toBe(true)
      expect(confirmManager.state.persistent).toBe(true)
      expect(confirmManager.state.autoFocus).toBe('cancel')
      expect(confirmManager.state.customClass).toBe('custom-class')
      expect(confirmManager.state.zIndex).toBe(9999)
      expect(confirmManager.state.maxWidth).toBe(400)
      expect(confirmManager.state.minWidth).toBe(250)
      expect(confirmManager.state.icon).toBe('⚠️')
      expect(confirmManager.state.html).toBe(true)

      confirmManager.confirm()
      await promise
    })
  })
})