# Contributing to Vue Popover Confirm

Thank you for your interest in contributing to Vue Popover Confirm! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different experience levels

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Basic knowledge of Vue 3, TypeScript, and CSS
- Familiarity with Git and GitHub

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vue-popover-confirm.git
   cd vue-popover-confirm
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open your browser** to `http://localhost:5173` to see the demo

### Project Structure Overview

```
src/
├── index.ts              # Plugin entry point
├── types.ts              # TypeScript definitions
├── directive.ts          # v-confirm directive
├── manager.ts            # State management
├── ConfirmRoot.vue       # UI component
├── style.css             # Styles (BEM + CSS variables)
├── App.vue               # Demo application
└── main.ts               # Demo entry point
```

## Development Process

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual feature branches
- `fix/bug-description` - Bug fix branches
- `docs/documentation-update` - Documentation updates

### Workflow

1. **Create a feature branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes** thoroughly using the demo application

4. **Commit your changes** with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add new positioning option"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Provide proper type definitions for all public APIs
- Avoid `any` types - use proper typing or `unknown`
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

```typescript
/**
 * Shows a confirmation popover anchored to the target element
 * @param options - Configuration options for the confirmation
 * @param targetElement - The element to anchor the popover to
 */
show(options: ConfirmOptions, targetElement: HTMLElement): void {
  // Implementation
}
```

### Vue Components

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Use proper prop validation and default values
- Emit events with clear, descriptive names
- Use reactive references appropriately

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Props {
  message: string;
  confirmText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm'
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
```

### CSS/Styling

- Use BEM methodology for class names
- Leverage CSS variables for customization
- Ensure accessibility (contrast ratios, focus states)
- Write mobile-first responsive styles
- Use consistent spacing and typography scales

```css
/* Block */
.vpc { }

/* Elements */
.vpc__message { }
.vpc__button { }

/* Modifiers */
.vpc__button--primary { }
.vpc__button--secondary { }

/* States */
.vpc__button:hover { }
.vpc__button:focus { }
.vpc__button:disabled { }
```

### Accessibility

- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain focus management
- Test with screen readers
- Follow WCAG 2.1 AA guidelines

```html
<div
  role="dialog"
  aria-modal="true"
  aria-label="Confirmation dialog"
  @keydown="handleKeydown"
>
  <!-- Content -->
</div>
```

## Testing Guidelines

### Manual Testing

Use the demo application to test:

1. **Basic functionality**:
   - String directive syntax
   - Object directive syntax
   - Callback execution

2. **Positioning**:
   - Different viewport positions
   - Edge cases (near screen borders)
   - Responsive behavior

3. **Accessibility**:
   - Keyboard navigation (Tab, Shift+Tab, Escape)
   - Focus management
   - Screen reader compatibility

4. **User interactions**:
   - Click outside to close
   - Multiple popovers
   - Dynamic content updates

### Testing Checklist

Before submitting a PR, ensure:

- [ ] All existing functionality still works
- [ ] New features work as expected
- [ ] Accessibility requirements are met
- [ ] No console errors or warnings
- [ ] TypeScript compilation succeeds
- [ ] CSS variables can be overridden
- [ ] Demo application demonstrates the changes

## Documentation

### Code Documentation

- Add JSDoc comments for all public APIs
- Include usage examples in comments
- Document complex algorithms or business logic
- Keep comments up-to-date with code changes

### README Updates

When adding new features:
- Update the features list
- Add usage examples
- Update configuration options table
- Include any breaking changes

### Developer Guide

For architectural changes:
- Update the architecture overview
- Document new patterns or conventions
- Add troubleshooting information
- Update the API reference

## Pull Request Process

### Before Submitting

1. **Rebase your branch** on the latest `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Run the build** to ensure everything compiles:
   ```bash
   npm run build:lib
   ```

3. **Test thoroughly** using the demo application

### PR Description Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Accessibility testing completed
- [ ] Edge cases considered
- [ ] Demo application updated (if applicable)

## Screenshots/GIFs
If applicable, add screenshots or GIFs to demonstrate the changes.

## Checklist
- [ ] Code follows the project's coding standards
- [ ] Self-review of code completed
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks** must pass (TypeScript compilation, build process)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** and merge

## Issue Reporting

### Bug Reports

Use the bug report template and include:

- **Environment**: Browser, Vue version, plugin version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots/code**: Visual aids or minimal reproduction code

### Feature Requests

Use the feature request template and include:

- **Problem description**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you've thought about
- **Use cases**: Real-world scenarios where this would be useful

### Questions and Discussions

For questions or discussions:
- Check existing issues and documentation first
- Use GitHub Discussions for general questions
- Be specific about what you're trying to achieve
- Include relevant code examples

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

For maintainers preparing a release:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped appropriately
- [ ] Library builds successfully
- [ ] Demo application works correctly
- [ ] TypeScript declarations are generated
- [ ] CSS is properly extracted

## Getting Help

If you need help:

1. **Check the documentation** (README.md, DEVELOPER_GUIDE.md)
2. **Search existing issues** on GitHub
3. **Ask in GitHub Discussions** for general questions
4. **Create an issue** for bugs or feature requests

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md for significant contributions
- README.md acknowledgments section

Thank you for contributing to Vue Popover Confirm! 🎉