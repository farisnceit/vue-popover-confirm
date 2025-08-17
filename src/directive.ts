import type { Directive } from 'vue';
import type { ConfirmDirectiveValue, ConfirmOptions } from './types';
import { confirmManager } from './manager';

const parseDirectiveValue = (value: ConfirmDirectiveValue): ConfirmOptions => {
  if (typeof value === 'string') {
    return { message: value };
  }
  return value;
};

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

  updated(el, binding) {
    // Handler remains the same, options are parsed when needed
  },

  unmounted(el) {
    const handler = (el as any)._vConfirmHandler;
    if (handler) {
      el.removeEventListener('click', handler);
      delete (el as any)._vConfirmHandler;
    }
  }
};