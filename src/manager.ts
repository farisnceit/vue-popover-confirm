import { reactive } from 'vue';
import type { ConfirmState, ConfirmOptions } from './types';

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
    this.state.isVisible = true;
    this.state.message = options.message;
    this.state.confirmText = options.confirmText || 'Confirm';
    this.state.cancelText = options.cancelText || 'Cancel';
    this.state.onConfirm = options.onConfirm || (() => {});
    this.state.onCancel = options.onCancel || (() => {});
    this.state.targetElement = targetElement;
    this.state.returnFocusElement = document.activeElement as HTMLElement;
  }

  hide() {
    this.state.isVisible = false;
    
    // Return focus to the trigger element
    if (this.state.returnFocusElement) {
      this.state.returnFocusElement.focus();
    }

    // Reset state
    this.state.targetElement = null;
    this.state.returnFocusElement = null;
  }

  async confirm() {
    try {
      await this.state.onConfirm();
    } finally {
      this.hide();
    }
  }

  async cancel() {
    try {
      await this.state.onCancel();
    } finally {
      this.hide();
    }
  }
}

export const confirmManager = new ConfirmManager();