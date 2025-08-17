import type { App } from "vue";
import { vConfirm } from "./directive";
import { confirmManager } from "./manager";
import ConfirmRoot from "./ConfirmRoot.vue";
import { ConfirmInjectionKey } from "./composables";
import type {
  ConfirmOptions,
  ConfirmResult,
  GlobalConfirmConfig,
} from "./types";

export interface VuePopoverConfirmPlugin {
  install(app: App, options?: GlobalConfirmConfig): void;
}

export interface ConfirmAPI {
  // Core methods
  show(
    options: ConfirmOptions,
    targetElement: HTMLElement
  ): Promise<ConfirmResult>;
  hide(): void;
  confirm(): Promise<void>;
  cancel(): Promise<void>;

  // Convenience methods
  ask(message: string, targetElement?: HTMLElement): Promise<boolean>;
  danger(message: string, targetElement?: HTMLElement): Promise<boolean>;
  success(message: string, targetElement?: HTMLElement): Promise<boolean>;
  warning(message: string, targetElement?: HTMLElement): Promise<boolean>;

  // State management
  isVisible(): boolean;
  setLoading(loading: boolean): void;
  setDisabled(disabled: boolean): void;
  updateMessage(message: string): void;
  updateTitle(title: string): void;

  // Configuration
  setGlobalConfig(config: GlobalConfirmConfig): void;
  getGlobalConfig(): GlobalConfirmConfig;
}

const VuePopoverConfirm: VuePopoverConfirmPlugin = {
  install(app: App, options: GlobalConfirmConfig = {}) {
    // Set global configuration
    if (options) {
      confirmManager.setGlobalConfig(options);
    }

    // Register the directive
    app.directive("confirm", vConfirm);

    // Register the confirm root component globally
    app.component("VuePopoverConfirmRoot", ConfirmRoot);

    // Provide the confirm manager for composables
    app.provide(ConfirmInjectionKey, confirmManager);

    // Provide the confirm API
    const confirmAPI: ConfirmAPI = {
      // Core methods
      show: (options: ConfirmOptions, targetElement: HTMLElement) =>
        confirmManager.show(options, targetElement),
      hide: () => confirmManager.hide(),
      confirm: () => confirmManager.confirm(),
      cancel: () => confirmManager.cancel(),

      // Convenience methods
      ask: (message: string, targetElement?: HTMLElement) =>
        confirmManager.ask(message, targetElement),
      danger: (message: string, targetElement?: HTMLElement) =>
        confirmManager.danger(message, targetElement),
      success: (message: string, targetElement?: HTMLElement) =>
        confirmManager.success(message, targetElement),
      warning: (message: string, targetElement?: HTMLElement) =>
        confirmManager.warning(message, targetElement),

      // State management
      isVisible: () => confirmManager.isVisible(),
      setLoading: (loading: boolean) => confirmManager.setLoading(loading),
      setDisabled: (disabled: boolean) => confirmManager.setDisabled(disabled),
      updateMessage: (message: string) => confirmManager.updateMessage(message),
      updateTitle: (title: string) => confirmManager.updateTitle(title),

      // Configuration
      setGlobalConfig: (config: GlobalConfirmConfig) =>
        confirmManager.setGlobalConfig(config),
      getGlobalConfig: () => confirmManager.getGlobalConfig(),
    };

    app.config.globalProperties.$confirm = confirmAPI;
    app.provide("$confirm", confirmAPI);
  },
};

export default VuePopoverConfirm;

// Export components and utilities
export { ConfirmRoot, vConfirm, confirmManager };

// Export composables
export {
  useConfirm,
  useConfirmDialog,
  useConfirmBatch,
  ConfirmInjectionKey,
} from "./composables";

// Export types
export type {
  ConfirmOptions,
  ConfirmDirectiveValue,
  ConfirmResult,
  ConfirmState,
  ConfirmTheme,
  ConfirmSize,
  ConfirmAnimation,
  GlobalConfirmConfig,
  ConfirmInstance,
} from "./types";
