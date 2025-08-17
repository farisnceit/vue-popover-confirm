# API Documentation

## Installation

```bash
npm install vue-popover-confirm
```

## Basic Usage

```typescript
import { createApp } from 'vue'
import VuePopoverConfirm from 'vue-popover-confirm'
import 'vue-popover-confirm/style.css'

const app = createApp(App)

// Install with global configuration (optional)
app.use(VuePopoverConfirm, {
  theme: 'default',
  animation: 'fade',
  closeOnClickOutside: true,
  closeOnEscape: true,
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})
```

## Directive Usage

```vue
<template>
  <!-- Simple usage -->
  <button v-confirm="'Are you sure?'">Delete</button>
  
  <!-- Advanced usage -->
  <button v-confirm="{ 
    title: 'Delete Item',
    message: 'This action cannot be undone!',
    theme: 'danger',
    size: 'large',
    animation: 'scale',
    icon: '⚠️',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: handleDelete,
    onCancel: handleCancel
  }">
    Delete Item
  </button>
</template>
```

## Composable API

```typescript
import { useConfirm, useConfirmDialog } from 'vue-popover-confirm'

// Basic composable
const { ask, danger, success, warning, show, hide } = useConfirm()

// Ask for confirmation
const confirmed = await ask('Continue with this action?')

// Themed confirmations
const confirmed = await danger('This will delete all data!')
const confirmed = await success('Operation completed! Continue?')
const confirmed = await warning('This may have side effects.')

// Advanced dialog composable
const dialog = useConfirmDialog()

const result = await dialog.danger({
  title: 'Confirm Deletion',
  message: 'This will permanently delete the selected items.',
  size: 'large',
  animation: 'scale'
})
```

## Programmatic Usage

```typescript
import { confirmManager } from 'vue-popover-confirm'

// Show confirmation and get promise result
const result = await confirmManager.show({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  theme: 'warning'
}, targetElement)

if (result.confirmed) {
  console.log('User confirmed')
} else if (result.cancelled) {
  console.log('User cancelled')
}

// Convenience methods
const confirmed = await confirmManager.ask('Continue?')
const confirmed = await confirmManager.danger('Delete all?')
const confirmed = await confirmManager.success('Save changes?')
const confirmed = await confirmManager.warning('Proceed anyway?')

// State management
confirmManager.setLoading(true)
confirmManager.updateMessage('Processing...')
confirmManager.hide()
```

## Configuration Options

### ConfirmOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | - | **Required.** The confirmation message |
| `title` | `string` | - | Optional title for the popover |
| `confirmText` | `string` | `'Confirm'` | Text for the confirm button |
| `cancelText` | `string` | `'Cancel'` | Text for the cancel button |
| `theme` | `ConfirmTheme` | `'default'` | Visual theme |
| `size` | `ConfirmSize` | `'medium'` | Popover size |
| `animation` | `ConfirmAnimation` | `'fade'` | Entrance animation |
| `placement` | `Placement` | `'top-start'` | Popover placement |
| `offset` | `number` | `12` | Distance from target element |
| `closeOnClickOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape |
| `showCloseButton` | `boolean` | `false` | Show close button |
| `persistent` | `boolean` | `false` | Prevent closing during loading |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable buttons |
| `autoFocus` | `'confirm' \| 'cancel' \| 'none'` | `'confirm'` | Which button to focus |
| `customClass` | `string` | `''` | Additional CSS class |
| `zIndex` | `number` | `10000` | CSS z-index |
| `maxWidth` | `number` | `300` | Maximum width in pixels |
| `minWidth` | `number` | `200` | Minimum width in pixels |
| `icon` | `string \| boolean` | `false` | Icon to display |
| `html` | `boolean` | `false` | Allow HTML in message |
| `timeout` | `number` | `0` | Auto-close timeout in ms |
| `onConfirm` | `() => void \| Promise<void>` | - | Confirm callback |
| `onCancel` | `() => void \| Promise<void>` | - | Cancel callback |
| `onShow` | `() => void` | - | Show callback |
| `onHide` | `() => void` | - | Hide callback |

### Theme Options

- `'default'` - Standard light theme
- `'dark'` - Dark theme
- `'danger'` - Red theme for destructive actions
- `'success'` - Green theme for positive actions
- `'warning'` - Orange theme for cautionary actions
- `'minimal'` - Clean minimal theme

### Size Options

- `'small'` - Compact size for tight spaces
- `'medium'` - Default balanced size
- `'large'` - Spacious size for important confirmations

### Animation Options

- `'fade'` - Fade in/out with slight movement
- `'scale'` - Scale up/down animation
- `'slide'` - Slide in from top
- `'none'` - No animation

## Global Configuration

```typescript
import { confirmManager } from 'vue-popover-confirm'

// Set global defaults
confirmManager.setGlobalConfig({
  theme: 'dark',
  animation: 'scale',
  closeOnClickOutside: true,
  confirmText: 'OK',
  cancelText: 'Cancel'
})

// Get current global config
const config = confirmManager.getGlobalConfig()
```

## Advanced Usage

### Batch Operations

```typescript
import { useConfirmBatch } from 'vue-popover-confirm'

const { confirmBatch, confirmAll } = useConfirmBatch()

// Confirm each item individually
const { confirmed, cancelled } = await confirmBatch(
  items,
  (item, index) => `Delete ${item.name}?`,
  { theme: 'danger' }
)

// Confirm all items at once
const allConfirmed = await confirmAll(
  items,
  'Delete all selected items?',
  { theme: 'danger' }
)
```

### Custom Positioning

```typescript
// Use specific placement
v-confirm="{
  message: 'Confirm action',
  placement: 'bottom-end',
  offset: 20
}"

// Available placements: 'top', 'top-start', 'top-end',
// 'bottom', 'bottom-start', 'bottom-end',
// 'left', 'left-start', 'left-end',
// 'right', 'right-start', 'right-end'
```

### Loading States

```typescript
const { setLoading, updateMessage } = useConfirm()

const handleAsyncAction = async () => {
  const result = await show({
    message: 'Process data?',
    onConfirm: async () => {
      setLoading(true)
      updateMessage('Processing...')
      await processData()
      updateMessage('Almost done...')
      await finalizeProcess()
    }
  }, targetElement)
}
```

### HTML Content

```typescript
v-confirm="{
  message: '<strong>Warning:</strong> This will <em>permanently</em> delete the item.',
  html: true,
  theme: 'danger'
}"
```

## TypeScript Support

The plugin is fully typed with TypeScript. Import types as needed:

```typescript
import type { 
  ConfirmOptions,
  ConfirmResult,
  ConfirmTheme,
  ConfirmSize,
  ConfirmAnimation,
  GlobalConfirmConfig
} from 'vue-popover-confirm'
```

## Accessibility

The plugin includes comprehensive accessibility features:

- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Escape)
- Focus management and trapping
- Screen reader support
- High contrast mode support
- Reduced motion support

## Browser Support

- Vue 3.0+
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills)

## CSS Customization

Override CSS variables for custom styling:

```css
:root {
  --vpc-bg: #ffffff;
  --vpc-fg: #111827;
  --vpc-border: #e5e7eb;
  --vpc-radius: 8px;
  --vpc-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  --vpc-btn-confirm-bg: #3b82f6;
  --vpc-btn-confirm-hover: #2563eb;
  --vpc-btn-cancel-bg: #f3f4f6;
  --vpc-btn-cancel-hover: #e5e7eb;
}
```