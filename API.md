# API Reference

Complete API documentation for vue-popover-confirm.

## Table of Contents

- [Installation](#installation)
- [Plugin Registration](#plugin-registration)
- [Directive Usage](#directive-usage)
- [Programmatic API](#programmatic-api)
- [TypeScript Types](#typescript-types)
- [CSS Variables](#css-variables)
- [Component API](#component-api)
- [Events](#events)
- [Accessibility](#accessibility)

## Installation

### NPM Installation

```bash
npm install vue-popover-confirm
```

```typescript
import { createApp } from 'vue';
import VuePopoverConfirm from 'vue-popover-confirm';
import 'vue-popover-confirm/style.css';

const app = createApp(App);
app.use(VuePopoverConfirm);
```

### CDN Installation

```html
<link rel="stylesheet" href="https://unpkg.com/vue-popover-confirm/dist/style.css">
<script src="https://unpkg.com/vue-popover-confirm/dist/vue-popover-confirm.iife.js"></script>
```

```javascript
const { createApp } = Vue;
const app = createApp(App);
app.use(VuePopoverConfirm.default);
```

## Plugin Registration

### `VuePopoverConfirm.install(app: App): void`

Registers the plugin with a Vue application instance.

**What it registers:**
- `v-confirm` directive globally
- `VuePopoverConfirmRoot` component globally
- `$confirm` API on component instances
- `$confirm` injection key for Composition API

```typescript
import VuePopoverConfirm from 'vue-popover-confirm';

app.use(VuePopoverConfirm);
```

## Directive Usage

### `v-confirm`

The main directive for attaching confirmation popovers to elements.

#### String Syntax

```vue
<template>
  <button v-confirm="'Are you sure?'">
    Delete Item
  </button>
</template>
```

#### Object Syntax

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
    await deleteItem();
  },
  onCancel: () => {
    console.log('Cancelled');
  }
};
</script>
```

#### Dynamic Values

```vue
<template>
  <button 
    v-for="item in items" 
    :key="item.id"
    v-confirm="{
      message: `Delete ${item.name}?`,
      onConfirm: () => deleteItem(item.id)
    }"
  >
    Delete {{ item.name }}
  </button>
</template>
```

## Programmatic API

### Composition API

```vue
<script setup>
import { inject } from 'vue';

const $confirm = inject('$confirm');

const showConfirmation = (event) => {
  $confirm.show({
    message: 'Custom confirmation',
    confirmText: 'Yes',
    cancelText: 'No',
    onConfirm: () => console.log('Confirmed!')
  }, event.target);
};
</script>
```

### Options API

```vue
<script>
export default {
  methods: {
    showConfirmation(event) {
      this.$confirm.show({
        message: 'Custom confirmation',
        onConfirm: () => console.log('Confirmed!')
      }, event.target);
    }
  }
}
</script>
```

### API Methods

#### `$confirm.show(options: ConfirmOptions, targetElement: HTMLElement): void`

Shows a confirmation popover anchored to the target element.

**Parameters:**
- `options`: Configuration object (see ConfirmOptions)
- `targetElement`: DOM element to anchor the popover to

#### `$confirm.hide(): void`

Hides the currently visible confirmation popover.

## TypeScript Types

### `ConfirmOptions`

Configuration object for confirmation popovers.

```typescript
interface ConfirmOptions {
  /** The confirmation message to display */
  message: string;
  
  /** Text for the confirm button (default: 'Confirm') */
  confirmText?: string;
  
  /** Text for the cancel button (default: 'Cancel') */
  cancelText?: string;
  
  /** Callback executed when confirmed */
  onConfirm?: () => void | Promise<void>;
  
  /** Callback executed when cancelled */
  onCancel?: () => void | Promise<void>;
}
```

### `ConfirmDirectiveValue`

Union type for directive values.

```typescript
type ConfirmDirectiveValue = string | ConfirmOptions;
```

### `ConfirmState`

Internal state interface (for advanced usage).

```typescript
interface ConfirmState {
  isVisible: boolean;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  targetElement: HTMLElement | null;
  returnFocusElement: HTMLElement | null;
}
```

### `ConfirmAPI`

Programmatic API interface.

```typescript
interface ConfirmAPI {
  show(options: ConfirmOptions, targetElement: HTMLElement): void;
  hide(): void;
}
```

## CSS Variables

Complete list of CSS variables for customization.

### Layout & Positioning

```css
:root {
  --vpc-z: 10000;                    /* Z-index for popover */
  --vpc-padding: 16px;               /* Internal padding */
  --vpc-gap: 12px;                   /* Gap between elements */
  --vpc-arrow-size: 8px;             /* Size of positioning arrow */
}
```

### Typography

```css
:root {
  --vpc-font: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --vpc-font-size: 14px;             /* Base font size */
  --vpc-btn-font-size: 13px;         /* Button font size */
  --vpc-btn-font-weight: 500;        /* Button font weight */
}
```

### Colors

```css
:root {
  --vpc-bg: #ffffff;                 /* Background color */
  --vpc-fg: #111827;                 /* Text color */
  --vpc-border: #e5e7eb;             /* Border color */
  --vpc-btn-color: #ffffff;          /* Button text color */
  --vpc-btn-yes-bg: #16a34a;         /* Confirm button background */
  --vpc-btn-yes-hover: #15803d;      /* Confirm button hover */
  --vpc-btn-no-bg: #ef4444;          /* Cancel button background */
  --vpc-btn-no-hover: #dc2626;       /* Cancel button hover */
}
```

### Visual Effects

```css
:root {
  --vpc-radius: 8px;                 /* Border radius */
  --vpc-btn-radius: 6px;             /* Button border radius */
  --vpc-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); /* Box shadow */
  --vpc-btn-padding: 8px 16px;       /* Button padding */
}
```

### Theme Examples

#### Dark Theme

```css
[data-theme="dark"] {
  --vpc-bg: #1f2937;
  --vpc-fg: #f9fafb;
  --vpc-border: #374151;
  --vpc-btn-yes-bg: #059669;
  --vpc-btn-no-bg: #dc2626;
}
```

#### Minimal Theme

```css
.minimal-theme {
  --vpc-radius: 4px;
  --vpc-btn-radius: 4px;
  --vpc-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --vpc-padding: 12px;
  --vpc-gap: 8px;
}
```

## Component API

### `VuePopoverConfirmRoot`

The root component that renders confirmation popovers.

#### Usage

```vue
<template>
  <div id="app">
    <!-- Your app content -->
    
    <!-- Required: Include the root component -->
    <VuePopoverConfirmRoot />
  </div>
</template>
```

#### Props

The component doesn't accept props - it's controlled entirely through the global state manager.

#### Features

- **Teleport Rendering**: Renders into `document.body` for proper z-index handling
- **Smart Positioning**: Uses Floating UI for collision-aware placement
- **Focus Management**: Traps focus and restores it when closed
- **Keyboard Navigation**: Handles Tab, Shift+Tab, and Escape keys
- **Click Outside**: Closes when clicking outside the popover

## Events

### Callback Events

Callbacks are executed as part of the confirmation flow:

```typescript
const options = {
  message: 'Delete item?',
  onConfirm: async () => {
    // Called when user clicks confirm
    // Can be async - popover waits for completion
    await deleteItem();
  },
  onCancel: () => {
    // Called when user clicks cancel or presses Escape
    console.log('User cancelled');
  }
};
```

### Event Handling

The plugin handles these DOM events internally:

- **Click**: On directive-bound elements to show popover
- **Click Outside**: To close popover when clicking elsewhere
- **Keydown**: For keyboard navigation (Tab, Shift+Tab, Escape)
- **Resize/Scroll**: To reposition popover when viewport changes

## Accessibility

### ARIA Attributes

The popover includes proper ARIA attributes:

```html
<div
  class="vpc"
  role="dialog"
  aria-modal="true"
  aria-label="Confirmation message text"
>
  <!-- Popover content -->
</div>
```

### Keyboard Navigation

- **Tab**: Move focus to next button
- **Shift+Tab**: Move focus to previous button
- **Escape**: Close popover and return focus
- **Enter/Space**: Activate focused button

### Focus Management

1. **Focus Trap**: Focus is trapped within the popover
2. **Initial Focus**: Confirm button receives focus when opened
3. **Focus Restoration**: Focus returns to trigger element when closed
4. **Focus Indicators**: Clear visual focus indicators on all interactive elements

### Screen Reader Support

- Popover is announced as a dialog
- Message content is read automatically
- Button labels are clear and descriptive
- State changes are communicated appropriately

### Color Contrast

Default theme meets WCAG 2.1 AA standards:
- Text contrast ratio: 4.5:1 minimum
- Button contrast ratio: 3:1 minimum
- Focus indicators: High contrast borders

## Browser Support

### Supported Browsers

- **Chrome**: 60+ (ES2015+ support)
- **Firefox**: 55+ (ES2015+ support)
- **Safari**: 12+ (ES2015+ support)
- **Edge**: 79+ (Chromium-based)

### Mobile Support

- **iOS Safari**: 12+
- **Android Chrome**: 60+
- **Samsung Internet**: 8+

### Not Supported

- **Internet Explorer**: Any version (uses modern JavaScript features)
- **Legacy Edge**: Pre-Chromium versions

## Performance Considerations

### Memory Usage

- Singleton state manager minimizes memory footprint
- Event listeners are properly cleaned up
- No memory leaks from directive lifecycle

### Rendering Performance

- Teleport rendering prevents layout thrashing
- CSS transforms used for positioning (GPU accelerated)
- Minimal DOM manipulation during positioning updates

### Bundle Size

- **ESM**: ~8KB minified + gzipped
- **CSS**: ~2KB minified + gzipped
- **Dependencies**: Only @floating-ui/dom (~15KB)

### Optimization Tips

1. **CSS Variables**: Use CSS variables for theme switching instead of class toggling
2. **Event Delegation**: Plugin uses efficient event handling patterns
3. **Positioning Cache**: Floating UI caches calculations when possible
4. **Tree Shaking**: ESM build supports tree shaking for optimal bundle size

## Migration Guide

### From Other Confirmation Libraries

Common patterns when migrating from other libraries:

#### From `vue-confirm-dialog`

```typescript
// Before
this.$confirm('Delete item?').then(() => {
  deleteItem();
});

// After
<button v-confirm="{
  message: 'Delete item?',
  onConfirm: () => deleteItem()
}">
  Delete
</button>
```

#### From `sweetalert2`

```typescript
// Before
Swal.fire({
  title: 'Are you sure?',
  text: 'Delete this item?',
  showCancelButton: true
}).then((result) => {
  if (result.isConfirmed) {
    deleteItem();
  }
});

// After
<button v-confirm="{
  message: 'Delete this item?',
  onConfirm: () => deleteItem()
}">
  Delete
</button>
```

## Troubleshooting

### Common Issues

1. **Popover not showing**
   - Ensure `VuePopoverConfirmRoot` is included in your template
   - Check that the plugin is properly registered

2. **Positioning issues**
   - Verify target element has proper positioning context
   - Check for CSS conflicts with z-index

3. **Focus not restoring**
   - Ensure trigger element remains in DOM after confirmation
   - Check for JavaScript errors preventing cleanup

4. **Styles not applied**
   - Import the CSS file: `import 'vue-popover-confirm/style.css'`
   - Check for CSS specificity conflicts

### Debug Mode

Enable debug logging:

```javascript
// In development
window.__VPC_DEBUG__ = true;
```

This logs state changes and positioning calculations to the console.