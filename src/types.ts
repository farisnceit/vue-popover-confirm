export interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

export interface ConfirmState {
  isVisible: boolean;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  targetElement: HTMLElement | null;
  returnFocusElement: HTMLElement | null;
}

export type ConfirmDirectiveValue = string | ConfirmOptions;