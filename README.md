# Vue Popover Confirm

A comprehensive Vue 3 plugin for elegant confirmation dialogs with smart positioning, multiple themes, animations, and extensive customization options.

## ✨ Features

- 🎯 **Smart Positioning** - Automatically positions popovers using Floating UI
- 🎨 **Multiple Themes** - Default, dark, danger, success, warning, and minimal themes
- 🎬 **Smooth Animations** - Fade, scale, slide, or no animation options
- 📏 **Flexible Sizing** - Small, medium, and large size variants
- ♿ **Fully Accessible** - ARIA compliant with keyboard navigation and focus management
- 📱 **Mobile Friendly** - Responsive design that works on all devices
- 🔧 **TypeScript Ready** - Complete TypeScript support with full type definitions
- 🚀 **Lightweight** - Small bundle size (~8KB gzipped) with minimal dependencies
- 🎛️ **Composable API** - Modern Vue 3 composables for programmatic control
- 🔄 **Promise-based** - Async/await support for modern JavaScript workflows
- 🎨 **CSS Variables** - Easy theming with CSS custom properties
- 🔧 **Global Configuration** - Set default options across your entire app

## 📦 Installation

```bash
npm install vue-popover-confirm
```

## 🚀 Quick Start

```typescript
import { createApp } from 'vue'
import VuePopoverConfirm from 'vue-popover-confirm'
import 'vue-popover-confirm/style.css'

const app = createApp(App)

// Install with optional global configuration
app.use(VuePopoverConfirm, {
  theme: 'default',
  animation: 'fade',
  closeOnClickOutside: true
})
```

```vue
<template>
  <div>
    <!-- Simple usage -->
    <button v-confirm="'Are you sure?'">Delete Item</button>
    
    <!-- Advanced usage -->
    <button v-confirm="{
      title: 'Delete Item',
      message: 'This action cannot be undone!',
      theme: 'danger',
      size: 'large',
      icon: '⚠️',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }">
      Delete Item
    </button>
    
    <!-- Required: Include the root component -->
    <VuePopoverConfirmRoot />
  </div>
</template>
```

## 🎨 Theme Showcase

```vue
<template>
  <!-- Default theme -->
  <button v-confirm="{ message: 'Continue?', theme: 'default' }">
    Default
  </button>
  
  <!-- Danger theme for destructive actions -->
  <button v-confirm="{ 
    message: 'Delete permanently?', 
    theme: 'danger',
    icon: '⚠️'
  }">
    Delete
  </button>
  
  <!-- Success theme for positive actions -->
  <button v-confirm="{ 
    message: 'Save changes?', 
    theme: 'success',
    icon: '✅'
  }">
    Save
  </button>
  
  <!-- Warning theme for caution -->
  <button v-confirm="{ 
    message: 'This may have side effects', 
    theme: 'warning',
    icon: '⚠️'
  }">
    Proceed
  </button>
  
  <!-- Dark theme -->
  <button v-confirm="{ message: 'Continue?', theme: 'dark' }">
    Dark
  </button>
  
  <!-- Minimal theme -->
  <button v-confirm="{ message: 'Continue?', theme: 'minimal' }">
    Minimal
  </button>
</template>
```

## 🎬 Animation Examples

```vue
<template>
  <button v-confirm="{ message: 'Fade animation', animation: 'fade' }">
    Fade
  </button>
  
  <button v-confirm="{ message: 'Scale animation', animation: 'scale' }">
    Scale
  </button>
  
  <button v-confirm="{ message: 'Slide animation', animation: 'slide' }">
    Slide
  </button>
  
  <button v-confirm="{ message: 'No animation', animation: 'none' }">
    Instant
  </button>
</template>
```

## 🔧 Composable API

```vue
<script setup>
import { useConfirm, useConfirmDialog } from 'vue-popover-confirm'

// Basic composable
const { ask, danger, success, warning } = useConfirm()

// Simple confirmation
const handleDelete = async () => {
  const confirmed = await ask('Delete this item?')
  if (confirmed) {
    console.log('Item deleted!')
  }
}

// Themed confirmations
const handleDangerousAction = async () => {
  const confirmed = await danger('This will delete ALL data!')
  if (confirmed) {
    console.log('Dangerous action confirmed')
  }
}

// Advanced dialog composable
const dialog = useConfirmDialog()

const handleAdvanced = async () => {
  try {
    const result = await dialog.danger({
      title: 'Confirm Deletion',
      message: 'This will permanently delete the selected items.',
      size: 'large',
      animation: 'scale',
      icon: '🗑️'
    })
    
    if (result.confirmed) {
      console.log('User confirmed deletion')
    }
  } catch (error) {
    console.error('Dialog error:', error)
  }
}
</script>
```

## 🔄 Promise-based API

```vue
<script setup>
import { confirmManager } from 'vue-popover-confirm'

const handleAsyncOperation = async () => {
  try {
    const result = await confirmManager.show({
      title: 'Process Data',
      message: 'This will process all selected items.',
      theme: 'warning',
      onConfirm: async () => {
        // Show loading state
        confirmManager.setLoading(true)
        confirmManager.updateMessage('Processing...')
        
        // Simulate async work
        await processData()
        
        confirmManager.updateMessage('Almost done...')
        await finalizeProcess()
      }
    }, targetElement)
    
    if (result.confirmed) {
      console.log('Operation completed successfully')
    }
  } catch (error) {
    console.error('Operation failed:', error)
  }
}
</script>
```

## 🎛️ Advanced Features

### Loading States

```vue
<template>
  <button v-confirm="{
    message: 'Process data?',
    onConfirm: async () => {
      setLoading(true)
      await longRunningOperation()
    }
  }">
    Process Data
  </button>
</template>
```

### HTML Content

```vue
<template>
  <button v-confirm="{
    message: '<strong>Warning:</strong> This will <em>permanently</em> delete the item.',
    html: true,
    theme: 'danger'
  }">
    Delete with HTML
  </button>
</template>
```

### Custom Positioning

```vue
<template>
  <button v-confirm="{
    message: 'Custom positioned popover',
    placement: 'bottom-end',
    offset: 20
  }">
    Bottom End
  </button>
</template>
```

### Auto-close Timeout

```vue
<template>
  <button v-confirm="{
    message: 'This will auto-close in 3 seconds',
    timeout: 3000
  }">
    Auto Close
  </button>
</template>
```

### Batch Operations

```vue
<script setup>
import { useConfirmBatch } from 'vue-popover-confirm'

const { confirmBatch, confirmAll } = useConfirmBatch()

const handleBatchDelete = async () => {
  // Confirm each item individually
  const { confirmed, cancelled } = await confirmBatch(
    selectedItems,
    (item) => `Delete ${item.name}?`,
    { theme: 'danger' }
  )
  
  console.log(`Confirmed: ${confirmed.length}, Cancelled: ${cancelled.length}`)
}

const handleDeleteAll = async () => {
  // Confirm all items at once
  const allConfirmed = await confirmAll(
    selectedItems,
    'Delete all selected items?',
    { theme: 'danger' }
  )
  
  if (allConfirmed) {
    console.log('All items will be deleted')
  }
}
</script>
```

## 🎨 Custom Styling

Override CSS variables for custom themes:

```css
:root {
  /* Custom theme colors */
  --vpc-bg: #ffffff;
  --vpc-fg: #111827;
  --vpc-border: #e5e7eb;
  --vpc-btn-confirm-bg: #3b82f6;
  --vpc-btn-confirm-hover: #2563eb;
  --vpc-btn-cancel-bg: #f3f4f6;
  --vpc-btn-cancel-hover: #e5e7eb;
  
  /* Custom sizing */
  --vpc-radius: 12px;
  --vpc-padding: 20px;
  --vpc-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --vpc-bg: #1f2937;
    --vpc-fg: #f9fafb;
    --vpc-border: #374151;
  }
}
```

## 📚 Documentation

- [**API Reference**](./API.md) - Complete API documentation with all options
- [**Developer Guide**](./DEVELOPER_GUIDE.md) - Development setup and contribution guide
- [**Changelog**](./CHANGELOG.md) - Version history and breaking changes

## 🌐 Browser Support

- **Vue 3.0+** required
- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Android Chrome 60+
- **Not supported**: Internet Explorer (any version)

## 📦 Bundle Size

- **ESM**: ~8KB minified + gzipped
- **CSS**: ~2KB minified + gzipped
- **Dependencies**: Only `@floating-ui/dom` (~15KB)
- **Tree-shakeable**: Import only what you need

## ♿ Accessibility

Full accessibility support including:

- **ARIA attributes**: Proper roles, labels, and descriptions
- **Keyboard navigation**: Tab, Shift+Tab, Enter, Escape
- **Focus management**: Focus trapping and restoration
- **Screen readers**: Compatible with all major screen readers
- **High contrast**: Supports high contrast mode
- **Reduced motion**: Respects `prefers-reduced-motion`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/vue-popover-confirm.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📄 License

MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Floating UI](https://floating-ui.com/) for smart positioning
- [Vue.js](https://vuejs.org/) for the amazing framework
- All contributors who help make this project better

---

<div align="center">
  <strong>Made with ❤️ for the Vue.js community</strong>
</div>