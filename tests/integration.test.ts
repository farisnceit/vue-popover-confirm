import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp } from 'vue'
import { mount } from '@vue/test-utils'
import VuePopoverConfirm from '../src/index'
import { confirmManager } from '../src/manager'

describe('Integration Tests', () => {
  beforeEach(() => {
    confirmManager.hide()
    vi.clearAllMocks()
  })

  it('should install plugin correctly', () => {
    const app = createApp({})
    
    expect(() => {
      app.use(VuePopoverConfirm)
    }).not.toThrow()

    // Check if directive is registered
    expect(app._context.directives.confirm).toBeDefined()
    
    // Check if component is registered
    expect(app._context.components.VuePopoverConfirmRoot).toBeDefined()
  })

  it('should install plugin with global configuration', () => {
    const app = createApp({})
    const globalConfig = {
      theme: 'dark' as const,
      animation: 'scale' as const,
      confirmText: 'OK',
      cancelText: 'No'
    }
    
    app.use(VuePopoverConfirm, globalConfig)
    
    const retrievedConfig = confirmManager.getGlobalConfig()
    expect(retrievedConfig).toEqual(globalConfig)
  })

  it('should work end-to-end with directive', async () => {
    const app = createApp({})
    app.use(VuePopoverConfirm)

    const onConfirm = vi.fn()
    const wrapper = mount({
      template: `
        <div>
          <button 
            v-confirm="{
              message: 'Delete item?',
              confirmText: 'Delete',
              cancelText: 'Cancel',
              onConfirm: handleConfirm
            }"
            id="delete-btn"
          >
            Delete
          </button>
          <VuePopoverConfirmRoot />
        </div>
      `,
      methods: {
        handleConfirm: onConfirm
      }
    }, {
      global: {
        plugins: [VuePopoverConfirm]
      }
    })

    // Click the button
    const button = wrapper.find('#delete-btn')
    await button.trigger('click')

    // Check if popover is visible
    expect(wrapper.find('.vpc').exists()).toBe(true)
    expect(wrapper.find('.vpc__message').text()).toBe('Delete item?')

    // Click confirm button
    const confirmButton = wrapper.find('.vpc__button--confirm')
    await confirmButton.trigger('click')

    // Check if callback was called
    expect(onConfirm).toHaveBeenCalled()
  })

  it('should work with global properties', async () => {
    const app = createApp({})
    app.use(VuePopoverConfirm)

    const wrapper = mount({
      template: `
        <div>
          <button @click="showConfirm" id="show-btn">Show</button>
          <VuePopoverConfirmRoot />
        </div>
      `,
      methods: {
        showConfirm(event: Event) {
          this.$confirm.show({
            message: 'Global API test'
          }, event.target as HTMLElement)
        }
      }
    }, {
      global: {
        plugins: [VuePopoverConfirm]
      }
    })

    const button = wrapper.find('#show-btn')
    await button.trigger('click')

    expect(wrapper.find('.vpc').exists()).toBe(true)
    expect(wrapper.find('.vpc__message').text()).toBe('Global API test')
  })

  it('should handle complex workflow', async () => {
    const app = createApp({})
    app.use(VuePopoverConfirm, {
      theme: 'danger',
      confirmText: 'Delete'
    })

    const items = ['Item 1', 'Item 2', 'Item 3']
    const deletedItems: string[] = []

    const wrapper = mount({
      template: `
        <div>
          <div v-for="(item, index) in items" :key="item" class="item">
            <span>{{ item }}</span>
            <button 
              v-confirm="{
                title: 'Delete Item',
                message: \`Delete \${item}?\`,
                icon: '🗑️',
                onConfirm: () => deleteItem(index)
              }"
              :data-testid="\`delete-\${index}\`"
            >
              Delete
            </button>
          </div>
          <VuePopoverConfirmRoot />
        </div>
      `,
      data() {
        return { items: [...items] }
      },
      methods: {
        deleteItem(index: number) {
          const item = this.items[index]
          deletedItems.push(item)
          this.items.splice(index, 1)
        }
      }
    }, {
      global: {
        plugins: [VuePopoverConfirm]
      }
    })

    // Delete first item
    const deleteBtn1 = wrapper.find('[data-testid="delete-0"]')
    await deleteBtn1.trigger('click')

    expect(wrapper.find('.vpc').exists()).toBe(true)
    expect(wrapper.find('.vpc__title').text()).toBe('Delete Item')
    expect(wrapper.find('.vpc__message').text()).toBe('Delete Item 1?')
    expect(wrapper.find('.vpc__icon').text()).toBe('🗑️')
    expect(wrapper.find('.vpc--theme-danger').exists()).toBe(true)

    const confirmButton = wrapper.find('.vpc__button--confirm')
    expect(confirmButton.text()).toBe('Delete') // Global config applied
    await confirmButton.trigger('click')

    await wrapper.vm.$nextTick()

    expect(deletedItems).toContain('Item 1')
    expect(wrapper.findAll('.item')).toHaveLength(2)
  })

  it('should handle async operations with loading states', async () => {
    const app = createApp({})
    app.use(VuePopoverConfirm)

    let resolveAsync: () => void
    const asyncOperation = new Promise<void>((resolve) => {
      resolveAsync = resolve
    })

    const wrapper = mount({
      template: `
        <div>
          <button 
            v-confirm="{
              message: 'Process data?',
              onConfirm: handleAsyncConfirm
            }"
            id="async-btn"
          >
            Process
          </button>
          <VuePopoverConfirmRoot />
        </div>
      `,
      methods: {
        async handleAsyncConfirm() {
          confirmManager.setLoading(true)
          confirmManager.updateMessage('Processing...')
          await asyncOperation
        }
      }
    }, {
      global: {
        plugins: [VuePopoverConfirm]
      }
    })

    // Click button
    const button = wrapper.find('#async-btn')
    await button.trigger('click')

    // Click confirm
    const confirmButton = wrapper.find('.vpc__button--confirm')
    await confirmButton.trigger('click')

    await wrapper.vm.$nextTick()

    // Check loading state
    expect(wrapper.find('.vpc__loading-overlay').exists()).toBe(true)
    expect(wrapper.find('.vpc__message').text()).toBe('Processing...')

    // Resolve async operation
    resolveAsync!()
    await asyncOperation
    await wrapper.vm.$nextTick()

    // Should be hidden after completion
    expect(wrapper.find('.vpc').exists()).toBe(false)
  })

  it('should handle error scenarios gracefully', async () => {
    const app = createApp({})
    app.use(VuePopoverConfirm)

    const errorCallback = vi.fn().mockRejectedValue(new Error('Test error'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount({
      template: `
        <div>
          <button 
            v-confirm="{
              message: 'This will error',
              onConfirm: errorCallback
            }"
            id="error-btn"
          >
            Error
          </button>
          <VuePopoverConfirmRoot />
        </div>
      `,
      methods: {
        errorCallback
      }
    }, {
      global: {
        plugins: [VuePopoverConfirm]
      }
    })

    const button = wrapper.find('#error-btn')
    await button.trigger('click')

    const confirmButton = wrapper.find('.vpc__button--confirm')
    await confirmButton.trigger('click')

    // Wait for error handling
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(errorCallback).toHaveBeenCalled()
    // Popover should be hidden even after error
    expect(wrapper.find('.vpc').exists()).toBe(false)

    consoleError.mockRestore()
  })
})