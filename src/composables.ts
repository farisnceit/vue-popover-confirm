import { inject, type InjectionKey } from 'vue';
import { confirmManager } from './manager';
import type { ConfirmOptions, ConfirmResult, GlobalConfirmConfig } from './types';

export const ConfirmInjectionKey: InjectionKey<typeof confirmManager> = Symbol('confirm');

/**
 * Composable for using the confirm plugin
 */
export function useConfirm() {
  const confirm = inject(ConfirmInjectionKey, confirmManager);

  return {
    // Core methods
    show: (options: ConfirmOptions, targetElement: HTMLElement): Promise<ConfirmResult> => 
      confirm.show(options, targetElement),
    
    hide: () => confirm.hide(),
    
    confirm: () => confirm.confirm(),
    
    cancel: () => confirm.cancel(),

    // Convenience methods
    ask: (message: string, targetElement?: HTMLElement): Promise<boolean> => 
      confirm.ask(message, targetElement),

    danger: (message: string, targetElement?: HTMLElement): Promise<boolean> => 
      confirm.danger(message, targetElement),

    success: (message: string, targetElement?: HTMLElement): Promise<boolean> => 
      confirm.success(message, targetElement),

    warning: (message: string, targetElement?: HTMLElement): Promise<boolean> => 
      confirm.warning(message, targetElement),

    // State management
    isVisible: () => confirm.isVisible(),
    
    setLoading: (loading: boolean) => confirm.setLoading(loading),
    
    setDisabled: (disabled: boolean) => confirm.setDisabled(disabled),
    
    updateMessage: (message: string) => confirm.updateMessage(message),
    
    updateTitle: (title: string) => confirm.updateTitle(title),

    // Configuration
    setGlobalConfig: (config: GlobalConfirmConfig) => confirm.setGlobalConfig(config),
    
    getGlobalConfig: () => confirm.getGlobalConfig(),

    // State access
    state: confirm.state
  };
}

/**
 * Composable for creating confirm dialogs with specific themes
 */
export function useConfirmDialog() {
  const { show } = useConfirm();

  const createDialog = (defaultOptions: Partial<ConfirmOptions> = {}) => {
    return (options: ConfirmOptions | string, targetElement?: HTMLElement): Promise<ConfirmResult> => {
      const finalOptions = typeof options === 'string' 
        ? { ...defaultOptions, message: options }
        : { ...defaultOptions, ...options };
      
      const target = targetElement || document.body;
      return show(finalOptions, target);
    };
  };

  return {
    // Theme-based dialogs
    default: createDialog({ theme: 'default' }),
    danger: createDialog({ theme: 'danger', confirmText: 'Delete', icon: '⚠️' }),
    success: createDialog({ theme: 'success', confirmText: 'Continue', icon: '✅' }),
    warning: createDialog({ theme: 'warning', confirmText: 'Proceed', icon: '⚠️' }),
    dark: createDialog({ theme: 'dark' }),
    minimal: createDialog({ theme: 'minimal' }),

    // Size-based dialogs
    small: createDialog({ size: 'small' }),
    medium: createDialog({ size: 'medium' }),
    large: createDialog({ size: 'large' }),

    // Animation-based dialogs
    fade: createDialog({ animation: 'fade' }),
    scale: createDialog({ animation: 'scale' }),
    slide: createDialog({ animation: 'slide' }),
    none: createDialog({ animation: 'none' }),

    // Custom dialog creator
    create: createDialog
  };
}

/**
 * Composable for batch operations with confirmation
 */
export function useConfirmBatch() {
  const { show } = useConfirm();

  const confirmBatch = async (
    items: any[],
    getMessage: (item: any, index: number) => string,
    options: Partial<ConfirmOptions> = {}
  ): Promise<{ confirmed: any[], cancelled: any[] }> => {
    const confirmed: any[] = [];
    const cancelled: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const message = getMessage(item, i);
      
      try {
        const result = await show(
          { ...options, message },
          document.body
        );
        
        if (result.confirmed) {
          confirmed.push(item);
        } else {
          cancelled.push(item);
        }
      } catch (error) {
        cancelled.push(item);
      }
    }

    return { confirmed, cancelled };
  };

  return {
    confirmBatch,
    
    confirmAll: async (
      items: any[],
      message: string,
      options: Partial<ConfirmOptions> = {}
    ): Promise<boolean> => {
      const result = await show(
        { 
          ...options, 
          message: `${message} (${items.length} items)` 
        },
        document.body
      );
      return result.confirmed;
    }
  };
}