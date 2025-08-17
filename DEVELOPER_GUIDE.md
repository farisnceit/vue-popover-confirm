# Developer Guide

This guide provides detailed information for developers who want to contribute to or understand the internals of vue-popover-confirm.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Development Setup](#development-setup)
- [Building the Plugin](#building-the-plugin)
- [Testing](#testing)
- [Contributing](#contributing)
- [Release Process](#release-process)

## Architecture Overview

The plugin follows a modular architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   v-confirm     │    │  ConfirmManager │    │  ConfirmRoot    │
│   Directive     │───▶│   (Singleton)   │───▶│   Component     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Click Handler   │    │ Reactive State  │    │ Floating UI     │
│ Event Binding   │    │ Show/Hide Logic │    │ Positioning     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Design Principles

1. **Single Responsibility**: Each module has a clear, focused purpose
2. **Reactive State Management**: Uses Vue's reactivity system for state synchronization
3. **Accessibility First**: Built with ARIA compliance and keyboard navigation
4. **Flexible Positioning**: Leverages Floating UI for smart popover placement
5. **Customizable Styling**: CSS variables enable complete theme customization

## Project Structure

```
src/
├── index.ts              # Plugin entry point and registration
├── types.ts              # TypeScript type definitions
├── directive.ts          # v-confirm directive implementation
├── manager.ts            # Singleton state manager
├── ConfirmRoot.vue       # Popover UI component
├── style.css             # BEM-based styles with CSS variables
├── App.vue               # Demo application
└── main.ts               # Demo entry point
```

## Core Components

### 1. Plugin Registration (`src/index.ts`)

The main plugin file that:
- Registers the `v-confirm` directive globally
- Registers the `VuePopoverConfirmRoot` component
- Provides the programmatic API via `$confirm` and injection

```typescript
const VuePopoverConfirm: VuePopoverConfirmPlugin = {
  install(app: App) {
    app.directive('confirm', vConfirm);
    app.component('VuePopoverConfirmRoot', ConfirmRoot);
    
    const confirmAPI: ConfirmAPI = {
      show: (options, targetElement) => confirmManager.show(options, targetElement),
      hide: () => confirmManager.hide()
    };
    
    app.config.globalProperties.$confirm = confirmAPI;
    app.provide('$confirm', confirmAPI);
  }
};
```

### 2. Directive Implementation (`src/directive.ts`)

Handles the `v-confirm` directive lifecycle:
- **mounted**: Attaches click event listeners
- **updated**: Handles directive value changes
- **unmounted**: Cleans up event listeners

```typescript
export const vConfirm: Directive<HTMLElement, ConfirmDirectiveValue> = {
  mounted(el, binding) {
    const handleClick = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      
      const options = parseDirectiveValue(binding.value);
      confirmManager.show(options, el);
    };

    el.addEventListener('click', handleClick);
    (el as any)._vConfirmHandler = handleClick;
  },
  // ... other lifecycle hooks
};
```

### 3. State Manager (`src/manager.ts`)

Centralized state management using Vue's reactive system:

```typescript
class ConfirmManager {
  public state = reactive<ConfirmState>({
    isVisible: false,
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
    targetElement: null,
    returnFocusElement: null
  });

  show(options: ConfirmOptions, targetElement: HTMLElement) {
    // Update state and show popover
  }

  hide() {
    // Hide popover and restore focus
  }
}
```

### 4. UI Component (`src/ConfirmRoot.vue`)

The popover component that:
- Uses Teleport to render in document.body
- Implements Floating UI for positioning
- Handles keyboard navigation and accessibility
- Manages focus trap and restoration

Key features:
- **Positioning**: Uses `@floating-ui/dom` with flip, shift, and arrow middleware
- **Accessibility**: Proper ARIA attributes and focus management
- **Keyboard Navigation**: Tab cycling and Escape key handling
- **Click Outside**: Closes popover when clicking outside

### 5. Styling System (`src/style.css`)

BEM-based CSS with extensive customization via CSS variables:

```css
/* Block */
.vpc { /* Main popover container */ }

/* Elements */
.vpc__message { /* Message text */ }
.vpc__actions { /* Button container */ }
.vpc__button { /* Base button styles */ }
.vpc__arrow { /* Positioning arrow */ }

/* Modifiers */
.vpc__button--yes { /* Confirm button */ }
.vpc__button--no { /* Cancel button */ }
.vpc__arrow--top { /* Arrow pointing up */ }
```

## Development Setup

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Vue 3.0+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vue-popover-confirm

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Start dev server with demo
npm run dev

# Build library for production
npm run build:lib

# Build demo for production  
npm run build

# Preview production build
npm run preview

# Type checking
vue-tsc --noEmit
```

## Building the Plugin

The build process uses Vite in library mode to generate multiple output formats:

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'VuePopoverConfirm',
          formats: ['es', 'cjs', 'iife'],
          fileName: (format) => `vue-popover-confirm.${format === 'es' ? 'es' : format}.js`
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: { vue: 'Vue' }
          }
        }
      }
    }
  }
  // ... dev config
});
```

### Output Files

```
dist/
├── vue-popover-confirm.es.js      # ES modules
├── vue-popover-confirm.cjs.js     # CommonJS
├── vue-popover-confirm.iife.js    # IIFE for CDN
├── style.css                      # Extracted styles
└── index.d.ts                     # TypeScript declarations
```

## Testing

### Manual Testing

The demo application (`src/App.vue`) provides comprehensive testing scenarios:

1. **Basic Usage**: Simple string and object syntax
2. **Dynamic Lists**: Testing with reactive data
3. **Edge Cases**: Positioning near viewport edges
4. **Accessibility**: Keyboard navigation and screen readers
5. **Theming**: CSS variable customization

### Testing Checklist

- [ ] String directive syntax works
- [ ] Object directive syntax works
- [ ] Callbacks are executed correctly
- [ ] Popover positions correctly in all viewport areas
- [ ] Keyboard navigation (Tab, Shift+Tab, Escape)
- [ ] Focus management (trap and restoration)
- [ ] Click outside closes popover
- [ ] ARIA attributes are present
- [ ] CSS variables can be overridden
- [ ] Multiple instances don't conflict

## Contributing

### Code Style

- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use BEM methodology for CSS classes
- Maintain accessibility standards
- Write self-documenting code with clear variable names

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly using the demo application
5. Update documentation if needed
6. Commit with clear messages: `git commit -m 'Add amazing feature'`
7. Push to your fork: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Release Process

### Version Bumping

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

### Publishing

```bash
# Build the library
npm run build:lib

# Publish to npm
npm publish
```

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version is bumped appropriately
- [ ] CHANGELOG.md is updated
- [ ] Library builds successfully
- [ ] Demo application works correctly
- [ ] TypeScript declarations are generated
- [ ] CSS is properly extracted

## Troubleshooting

### Common Issues

1. **Popover not showing**: Ensure `VuePopoverConfirmRoot` is included in your app template
2. **Positioning issues**: Check that target element is properly positioned
3. **Focus not restoring**: Verify the trigger element is still in the DOM
4. **Styles not applied**: Make sure to import the CSS file
5. **TypeScript errors**: Check that types are properly imported

### Debug Mode

Enable debug logging by setting:

```javascript
window.__VPC_DEBUG__ = true;
```

This will log state changes and positioning calculations to the console.

## Performance Considerations

- The plugin uses a singleton manager to minimize memory usage
- Event listeners are properly cleaned up to prevent memory leaks
- Floating UI calculations are optimized and cached
- CSS variables enable efficient theme switching
- Teleport ensures popovers don't affect layout performance

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+)
- **IE11**: Not supported (uses modern JavaScript features)
- **Mobile**: Full support on iOS Safari 12+ and Android Chrome 60+

## API Reference

### Types

```typescript
interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

type ConfirmDirectiveValue = string | ConfirmOptions;
```

### CSS Variables

```css
:root {
  --vpc-z: 10000;                    /* Z-index */
  --vpc-font: system-ui, sans-serif; /* Font family */
  --vpc-font-size: 14px;             /* Base font size */
  --vpc-bg: #ffffff;                 /* Background color */
  --vpc-fg: #111827;                 /* Text color */
  --vpc-border: #e5e7eb;             /* Border color */
  --vpc-radius: 8px;                 /* Border radius */
  --vpc-shadow: 0 8px 24px rgba(0,0,0,0.12); /* Box shadow */
  --vpc-padding: 16px;               /* Internal padding */
  --vpc-gap: 12px;                   /* Element spacing */
  --vpc-btn-padding: 8px 16px;       /* Button padding */
  --vpc-btn-radius: 6px;             /* Button radius */
  --vpc-btn-font-size: 13px;         /* Button font size */
  --vpc-btn-font-weight: 500;        /* Button font weight */
  --vpc-btn-yes-bg: #16a34a;         /* Confirm button background */
  --vpc-btn-yes-hover: #15803d;      /* Confirm button hover */
  --vpc-btn-no-bg: #ef4444;          /* Cancel button background */
  --vpc-btn-no-hover: #dc2626;       /* Cancel button hover */
  --vpc-btn-color: #ffffff;          /* Button text color */
  --vpc-arrow-size: 8px;             /* Arrow size */
}
```