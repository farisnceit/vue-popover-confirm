import type { Placement } from '@floating-ui/dom';

export type ConfirmTheme = 'default' | 'dark' | 'minimal' | 'danger' | 'success' | 'warning';
export type ConfirmSize = 'small' | 'medium' | 'large';
export type ConfirmAnimation = 'fade' | 'scale' | 'slide' | 'none';

export interface ConfirmOptions {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onShow?: () => void;
  onHide?: () => void;
  theme?: ConfirmTheme;
  size?: ConfirmSize;
  animation?: ConfirmAnimation;
  placement?: Placement;
  offset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  persistent?: boolean;
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: 'confirm' | 'cancel' | 'none';
  customClass?: string;
  zIndex?: number;
  maxWidth?: number;
  minWidth?: number;
  icon?: string | boolean;
  html?: boolean;
  timeout?: number;
}

export interface ConfirmState {
  isVisible: boolean;
  message: string;
  title: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  onShow: () => void;
  onHide: () => void;
  targetElement: HTMLElement | null;
  returnFocusElement: HTMLElement | null;
  theme: ConfirmTheme;
  size: ConfirmSize;
  animation: ConfirmAnimation;
  placement: Placement;
  offset: number;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
  showCloseButton: boolean;
  persistent: boolean;
  loading: boolean;
  disabled: boolean;
  autoFocus: 'confirm' | 'cancel' | 'none';
  customClass: string;
  zIndex: number;
  maxWidth: number;
  minWidth: number;
  icon: string | boolean;
  html: boolean;
  timeout: number | null;
  timeoutId: number | null;
}

export interface GlobalConfirmConfig {
  confirmText?: string;
  cancelText?: string;
  theme?: ConfirmTheme;
  size?: ConfirmSize;
  animation?: ConfirmAnimation;
  placement?: Placement;
  offset?: number;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  autoFocus?: 'confirm' | 'cancel' | 'none';
  zIndex?: number;
  maxWidth?: number;
  minWidth?: number;
}

export interface ConfirmResult {
  confirmed: boolean;
  cancelled: boolean;
  value?: any;
}

export type ConfirmDirectiveValue = string | ConfirmOptions;

export interface ConfirmInstance {
  id: string;
  options: ConfirmOptions;
  targetElement: HTMLElement;
  resolve: (result: ConfirmResult) => void;
  reject: (error: Error) => void;
}