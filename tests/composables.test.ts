import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp } from 'vue'
import { useConfirm, useConfirmDialog, useConfirmBatch } from '../src/composables'
import { confirmManager } from '../src/manager'

describe('Composables', () => {
  beforeEach(() => {
    confirmManager.hide()
    vi.clearAllMocks()
  })

  describe('useConfirm', () => {
    it('should provide confirm methods', () => {
      const {
        show,
        hide,
        confirm,
        cancel,
        ask,
        danger,
        success,
        warning,
        isVisible,
        setLoading,
        setDisabled,
        updateMessage,
        updateTitle,
        setGlobalConfig,
        getGlobalConfig,
        state
      } = useConfirm()

      expect(typeof show).toBe('function')
      expect(typeof hide).toBe('function')
      expect(typeof confirm).toBe('function')
      expect(typeof cancel).toBe('function')
      expect(typeof ask).toBe('function')
      expect(typeof danger).toBe('function')
      expect(typeof success).toBe('function')
      expect(typeof warning).toBe('function')
      expect(typeof isVisible).toBe('function')
      expect(typeof setLoading).toBe('function')
      expect(typeof setDisabled).toBe('function')
      expect(typeof updateMessage).toBe('function')
      expect(typeof updateTitle).toBe('function')
      expect(typeof setGlobalConfig).toBe('function')
      expect(typeof getGlobalConfig).toBe('function')
      expect(state).toBeDefined()
    })

    it('should call manager methods correctly', async () => {
      const { ask } = useConfirm()
      
      const promise = ask('Test question?')
      expect(confirmManager.isVisible()).toBe(true)
      
      confirmManager.confirm()
      const result = await promise
      expect(result).toBe(true)
    })
  })

  describe('useConfirmDialog', () => {
    it('should provide dialog creation methods', () => {
      const dialog = useConfirmDialog()

      expect(typeof dialog.default).toBe('function')
      expect(typeof dialog.danger).toBe('function')
      expect(typeof dialog.success).toBe('function')
      expect(typeof dialog.warning).toBe('function')
      expect(typeof dialog.dark).toBe('function')
      expect(typeof dialog.minimal).toBe('function')
      expect(typeof dialog.small).toBe('function')
      expect(typeof dialog.medium).toBe('function')
      expect(typeof dialog.large).toBe('function')
      expect(typeof dialog.fade).toBe('function')
      expect(typeof dialog.scale).toBe('function')
      expect(typeof dialog.slide).toBe('function')
      expect(typeof dialog.none).toBe('function')
      expect(typeof dialog.create).toBe('function')
    })

    it('should create themed dialogs', async () => {
      const dialog = useConfirmDialog()
      
      const promise = dialog.danger('Delete everything?')
      
      expect(confirmManager.state.theme).toBe('danger')
      expect(confirmManager.state.confirmText).toBe('Delete')
      expect(confirmManager.state.icon).toBe('⚠️')
      
      confirmManager.confirm()
      const result = await promise
      expect(result.confirmed).toBe(true)
    })

    it('should create sized dialogs', async () => {
      const dialog = useConfirmDialog()
      
      const promise = dialog.large('Large dialog test')
      
      expect(confirmManager.state.size).toBe('large')
      
      confirmManager.confirm()
      await promise
    })

    it('should create animated dialogs', async () => {
      const dialog = useConfirmDialog()
      
      const promise = dialog.scale('Scale animation test')
      
      expect(confirmManager.state.animation).toBe('scale')
      
      confirmManager.confirm()
      await promise
    })

    it('should handle string and object options', async () => {
      const dialog = useConfirmDialog()
      
      // String option
      const promise1 = dialog.create('Simple message')
      expect(confirmManager.state.message).toBe('Simple message')
      confirmManager.confirm()
      await promise1

      // Object option
      const promise2 = dialog.create({
        message: 'Complex message',
        title: 'Test Title',
        size: 'large'
      })
      expect(confirmManager.state.message).toBe('Complex message')
      expect(confirmManager.state.title).toBe('Test Title')
      expect(confirmManager.state.size).toBe('large')
      confirmManager.confirm()
      await promise2
    })
  })

  describe('useConfirmBatch', () => {
    it('should provide batch methods', () => {
      const { confirmBatch, confirmAll } = useConfirmBatch()

      expect(typeof confirmBatch).toBe('function')
      expect(typeof confirmAll).toBe('function')
    })

    it('should confirm items in batch', async () => {
      const { confirmBatch } = useConfirmBatch()
      const items = ['Item 1', 'Item 2', 'Item 3']
      
      // Mock user interactions
      let confirmCount = 0
      const originalShow = confirmManager.show
      confirmManager.show = vi.fn().mockImplementation(async (options, target) => {
        confirmCount++
        if (confirmCount <= 2) {
          return { confirmed: true, cancelled: false }
        } else {
          return { confirmed: false, cancelled: true }
        }
      })

      const result = await confirmBatch(
        items,
        (item) => `Delete ${item}?`,
        { theme: 'danger' }
      )

      expect(result.confirmed).toHaveLength(2)
      expect(result.cancelled).toHaveLength(1)
      expect(confirmManager.show).toHaveBeenCalledTimes(3)

      // Restore original method
      confirmManager.show = originalShow
    })

    it('should confirm all items at once', async () => {
      const { confirmAll } = useConfirmBatch()
      const items = ['Item 1', 'Item 2', 'Item 3']
      
      // Mock user confirmation
      confirmManager.show = vi.fn().mockResolvedValue({
        confirmed: true,
        cancelled: false
      })

      const result = await confirmAll(
        items,
        'Delete all items?',
        { theme: 'danger' }
      )

      expect(result).toBe(true)
      expect(confirmManager.show).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Delete all items? (3 items)',
          theme: 'danger'
        }),
        document.body
      )
    })
  })
})