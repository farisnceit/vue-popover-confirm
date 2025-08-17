<template>
  <div class="examples">
    <h1>Vue Popover Confirm Examples</h1>
    
    <!-- Basic Examples -->
    <section>
      <h2>Basic Usage</h2>
      
      <button v-confirm="'Are you sure?'" class="btn">
        Simple Confirm
      </button>
      
      <button v-confirm="basicOptions" class="btn btn--danger">
        With Options
      </button>
    </section>
    
    <!-- Theme Examples -->
    <section>
      <h2>Themes</h2>
      
      <button v-confirm="dangerExample" class="btn btn--danger">
        Danger Theme
      </button>
      
      <button v-confirm="successExample" class="btn btn--success">
        Success Theme
      </button>
      
      <button v-confirm="warningExample" class="btn btn--warning">
        Warning Theme
      </button>
    </section>
    
    <!-- Composable Examples -->
    <section>
      <h2>Composable API</h2>
      
      <button @click="handleComposableExample" class="btn">
        Ask Confirmation
      </button>
      
      <button @click="handleDangerExample" class="btn btn--danger">
        Danger Confirmation
      </button>
      
      <button @click="handleDialogExample" class="btn">
        Custom Dialog
      </button>
    </section>
    
    <!-- Advanced Examples -->
    <section>
      <h2>Advanced Features</h2>
      
      <button v-confirm="loadingExample" class="btn">
        Loading Example
      </button>
      
      <button v-confirm="htmlExample" class="btn">
        HTML Content
      </button>
      
      <button v-confirm="timeoutExample" class="btn">
        Auto Close
      </button>
    </section>
    
    <VuePopoverConfirmRoot />
  </div>
</template>

<script setup lang="ts">
import { useConfirm, useConfirmDialog } from '../src/composables'

const { ask, danger, setLoading, updateMessage } = useConfirm()
const dialog = useConfirmDialog()

// Basic options
const basicOptions = {
  title: 'Delete Item',
  message: 'This action cannot be undone!',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  onConfirm: () => console.log('Item deleted!'),
  onCancel: () => console.log('Cancelled')
}

// Theme examples
const dangerExample = {
  title: 'Danger Zone',
  message: 'This will permanently delete all data!',
  theme: 'danger' as const,
  icon: '⚠️',
  confirmText: 'Delete All',
  cancelText: 'Cancel'
}

const successExample = {
  title: 'Success!',
  message: 'Operation completed successfully!',
  theme: 'success' as const,
  icon: '✅',
  confirmText: 'Continue',
  cancelText: 'Close'
}

const warningExample = {
  title: 'Warning',
  message: 'This action may have side effects.',
  theme: 'warning' as const,
  icon: '⚠️',
  confirmText: 'Proceed',
  cancelText: 'Cancel'
}

// Advanced examples
const loadingExample = {
  message: 'Process data?',
  onConfirm: async () => {
    setLoading(true)
    updateMessage('Processing...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    updateMessage('Almost done...')
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

const htmlExample = {
  message: '<strong>Warning:</strong> This will <em>permanently</em> delete the item.',
  html: true,
  theme: 'danger' as const
}

const timeoutExample = {
  message: 'This will auto-close in 3 seconds',
  timeout: 3000
}

// Composable examples
const handleComposableExample = async () => {
  const confirmed = await ask('Do you want to continue?')
  console.log('User confirmed:', confirmed)
}

const handleDangerExample = async () => {
  const confirmed = await danger('This will delete all data!')
  if (confirmed) {
    console.log('Dangerous action confirmed')
  }
}

const handleDialogExample = async () => {
  try {
    const result = await dialog.danger({
      title: 'Confirm Deletion',
      message: 'This will permanently delete the selected items.',
      size: 'large',
      animation: 'scale',
      icon: '🗑️'
    })
    
    console.log('Dialog result:', result)
  } catch (error) {
    console.error('Dialog error:', error)
  }
}
</script>

<style scoped>
.examples {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

section {
  margin-bottom: 3rem;
}

section h2 {
  color: #374151;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  background: #3b82f6;
  color: white;
}

.btn:hover {
  transform: translateY(-1px);
  background: #2563eb;
}

.btn--danger {
  background: #ef4444;
}

.btn--danger:hover {
  background: #dc2626;
}

.btn--success {
  background: #16a34a;
}

.btn--success:hover {
  background: #15803d;
}

.btn--warning {
  background: #f59e0b;
}

.btn--warning:hover {
  background: #d97706;
}
</style>