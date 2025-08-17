# Vue Popover Confirm

A Vue 3 plugin that displays confirmation popovers anchored to clicked elements using Floating UI for perfect positioning.

## Features

- ✅ **Simple directive syntax**: Use `v-confirm` on any clickable element
- ✅ **Flexible options**: Support both string and object configuration
- ✅ **Smart positioning**: Uses @floating-ui/dom for collision-aware placement
- ✅ **Accessible**: Full keyboard navigation and screen reader support
- ✅ **Customizable**: CSS variables for easy theming
- ✅ **TypeScript**: Full TypeScript support with proper type definitions
- ✅ **Lightweight**: Small bundle size with zero dependencies (except @floating-ui/dom)

## Installation

### NPM

```bash
npm install vue-popover-confirm
```

```js
import VuePopoverConfirm from 'vue-popover-confirm';
import 'vue-popover-confirm/style.css';

app.use(VuePopoverConfirm);
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/vue-popover-confirm/dist/style.css">
<script src="https://unpkg.com/vue-popover-confirm/dist/vue-popover-confirm.iife.js"></script>
```

```js
app.use(VuePopoverConfirm.default);
```

## Basic Usage

### String Syntax

```vue
<template>
  <button v-confirm="'Are you sure?'">
    Delete Item
  </button>
</template>
```

### Object Syntax

```vue
<template>
  <button v-confirm="confirmOptions">
    Delete Item
  </button>
</template>

<script setup>
const confirmOptions = {
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  onConfirm: async () => {
    // Handle confirmation
    await deleteItem();
  },
  onCancel: () => {
    // Handle cancellation (optional)
    console.log('Cancelled');
  }
};
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | - | The confirmation message to display |
| `confirmText` | `string` | `'Confirm'` | Text for the confirm button |
| `cancelText` | `string` | `'Cancel'` | Text for the cancel button |
| `onConfirm` | `function` | `() => {}` | Callback when confirmed |
| `onCancel` | `function` | `() => {}` | Callback when cancelled |

## Programmatic API

You can also use the confirmation programmatically:

```vue
<script setup>
import { inject } from 'vue';

const $confirm = inject('$confirm');

const showConfirm = (event) => {
  $confirm.show({
    message: 'Custom confirmation',
    onConfirm: () => console.log('Confirmed!')
  }, event.target);
};
</script>
```

## Customization

The plugin uses CSS variables for easy theming:

```css
:root {
  --vpc-z: 10000;
  --vpc-font: system-ui, sans-serif;
  --vpc-bg: #ffffff;
  --vpc-fg: #111827;
  --vpc-border: #e5e7eb;
  --vpc-radius: 8px;
  --vpc-shadow: 0 8px 24px rgba(0,0,0,0.12);
  --vpc-btn-yes-bg: #16a34a;
  --vpc-btn-no-bg: #ef4444;
  --vpc-btn-color: #ffffff;
}
```

### Dark Theme Example

```css
[data-theme="dark"] {
  --vpc-bg: #1f2937;
  --vpc-fg: #f9fafb;
  --vpc-border: #374151;
  --vpc-btn-yes-bg: #059669;
  --vpc-btn-no-bg: #dc2626;
}
```

## Accessibility

- ✅ Proper ARIA attributes (`role="dialog"`, `aria-modal`, `aria-label`)
- ✅ Focus management (traps focus, returns to trigger)
- ✅ Keyboard navigation (Tab, Shift+Tab, Escape)
- ✅ Screen reader announcements

## Browser Support

- Modern browsers that support ES2015+
- Vue 3.0+

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines first.