import { reactive, nextTick } from "vue";
import type {
  ConfirmState,
  ConfirmOptions,
  GlobalConfirmConfig,
  ConfirmResult,
  ConfirmInstance,
} from "./types";

class ConfirmManager {
  private instances = new Map<string, ConfirmInstance>();
  private instanceCounter = 0;
  private globalConfig: GlobalConfirmConfig = {};

  public state = reactive<ConfirmState>({
    isVisible: false,
    message: "",
    title: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
    onCancel: () => {},
    onShow: () => {},
    onHide: () => {},
    targetElement: null,
    returnFocusElement: null,
    theme: "default",
    size: "medium",
    animation: "fade",
    placement: "top-start",
    offset: 12,
    closeOnClickOutside: true,
    closeOnEscape: true,
    showCloseButton: false,
    persistent: false,
    loading: false,
    disabled: false,
    autoFocus: "confirm",
    customClass: "",
    zIndex: 10000,
    maxWidth: 300,
    minWidth: 200,
    icon: false,
    html: false,
    timeout: 0,
    timeoutId: null,
  });

  setGlobalConfig(config: GlobalConfirmConfig) {
    this.globalConfig = { ...this.globalConfig, ...config };
  }

  getGlobalConfig(): GlobalConfirmConfig {
    return { ...this.globalConfig };
  }

  private generateId(): string {
    return `confirm-${++this.instanceCounter}-${Date.now()}`;
  }

  private mergeOptions(options: ConfirmOptions): ConfirmOptions {
    return {
      ...this.globalConfig,
      ...options,
    };
  }

  show(
    options: ConfirmOptions,
    targetElement: HTMLElement
  ): Promise<ConfirmResult> {
    return new Promise((resolve, reject) => {
      const id = this.generateId();
      const mergedOptions = this.mergeOptions(options);

      // Clear any existing timeout
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
        this.state.timeoutId = null;
      }

      // Store instance for potential cleanup
      const instance: ConfirmInstance = {
        id,
        options: mergedOptions,
        targetElement,
        resolve,
        reject,
      };

      this.instances.set(id, instance);

      // Update state
      this.state.isVisible = true;
      this.state.message = mergedOptions.message;
      this.state.title = mergedOptions.title || "";
      this.state.confirmText =
        mergedOptions.confirmText || this.globalConfig.confirmText || "Confirm";
      this.state.cancelText =
        mergedOptions.cancelText || this.globalConfig.cancelText || "Cancel";
      this.state.onConfirm = mergedOptions.onConfirm || (() => {});
      this.state.onCancel = mergedOptions.onCancel || (() => {});
      this.state.onShow = mergedOptions.onShow || (() => {});
      this.state.onHide = mergedOptions.onHide || (() => {});
      this.state.targetElement = targetElement;
      this.state.returnFocusElement = document.activeElement as HTMLElement;
      this.state.theme =
        mergedOptions.theme || this.globalConfig.theme || "default";
      this.state.size =
        mergedOptions.size || this.globalConfig.size || "medium";
      this.state.animation =
        mergedOptions.animation || this.globalConfig.animation || "fade";
      this.state.placement =
        mergedOptions.placement || this.globalConfig.placement || "top-start";
      this.state.offset =
        mergedOptions.offset ?? this.globalConfig.offset ?? 12;
      this.state.closeOnClickOutside =
        mergedOptions.closeOnClickOutside ??
        this.globalConfig.closeOnClickOutside ??
        true;
      this.state.closeOnEscape =
        mergedOptions.closeOnEscape ?? this.globalConfig.closeOnEscape ?? true;
      this.state.showCloseButton =
        mergedOptions.showCloseButton ??
        this.globalConfig.showCloseButton ??
        false;
      this.state.persistent = mergedOptions.persistent ?? false;
      this.state.loading = mergedOptions.loading ?? false;
      this.state.disabled = mergedOptions.disabled ?? false;
      this.state.autoFocus =
        mergedOptions.autoFocus || this.globalConfig.autoFocus || "confirm";
      this.state.customClass = mergedOptions.customClass || "";
      this.state.zIndex =
        mergedOptions.zIndex || this.globalConfig.zIndex || 10000;
      this.state.maxWidth =
        mergedOptions.maxWidth || this.globalConfig.maxWidth || 300;
      this.state.minWidth =
        mergedOptions.minWidth || this.globalConfig.minWidth || 200;
      this.state.icon = mergedOptions.icon ?? false;
      this.state.html = mergedOptions.html ?? false;
      this.state.timeout = mergedOptions.timeout || 0;

      // Set up timeout if specified
      if (this.state.timeout > 0) {
        this.state.timeoutId = window.setTimeout(() => {
          this.cancel();
        }, this.state.timeout);
      }

      // Call onShow callback
      nextTick(() => {
        this.state.onShow();
      });
    });
  }

  hide() {
    if (!this.state.isVisible) return;

    // Clear timeout
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
      this.state.timeoutId = null;
    }

    this.state.isVisible = false;

    // Call onHide callback
    this.state.onHide();

    // Return focus to the trigger element
    if (this.state.returnFocusElement) {
      this.state.returnFocusElement.focus();
    }

    // Clean up instances
    this.instances.clear();

    // Reset state
    this.state.targetElement = null;
    this.state.returnFocusElement = null;
    this.state.loading = false;
    this.state.disabled = false;
  }

  async confirm() {
    if (this.state.disabled || this.state.loading) return;

    this.state.loading = true;

    try {
      await this.state.onConfirm();

      // Resolve all instances with confirmed result
      this.instances.forEach((instance) => {
        instance.resolve({ confirmed: true, cancelled: false });
      });
    } catch (error) {
      // Reject all instances with error
      this.instances.forEach((instance) => {
        instance.reject(error as Error);
      });
    } finally {
      this.hide();
    }
  }

  async cancel() {
    if (this.state.disabled || (this.state.loading && this.state.persistent))
      return;

    this.state.loading = true;

    try {
      await this.state.onCancel();

      // Resolve all instances with cancelled result
      this.instances.forEach((instance) => {
        instance.resolve({ confirmed: false, cancelled: true });
      });
    } catch (error) {
      // Reject all instances with error
      this.instances.forEach((instance) => {
        instance.reject(error as Error);
      });
    } finally {
      this.hide();
    }
  }

  // Utility methods
  isVisible(): boolean {
    return this.state.isVisible;
  }

  setLoading(loading: boolean) {
    this.state.loading = loading;
  }

  setDisabled(disabled: boolean) {
    this.state.disabled = disabled;
  }

  updateMessage(message: string) {
    this.state.message = message;
  }

  updateTitle(title: string) {
    this.state.title = title;
  }

  // Promise-based convenience methods
  async ask(message: string, targetElement?: HTMLElement): Promise<boolean> {
    if (!targetElement) {
      targetElement = document.body;
    }

    const result = await this.show({ message }, targetElement);
    return result.confirmed;
  }



  async danger(message: string, targetElement?: HTMLElement): Promise<boolean> {
    if (!targetElement) {
      targetElement = document.body;
    }

    const result = await this.show(
      {
        message,
        theme: "danger",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
      targetElement
    );
    return result.confirmed;
  }

  async success(
    message: string,
    targetElement?: HTMLElement
  ): Promise<boolean> {
    if (!targetElement) {
      targetElement = document.body;
    }

    const result = await this.show(
      {
        message,
        theme: "success",
        confirmText: "Continue",
        cancelText: "Cancel",
      },
      targetElement
    );
    return result.confirmed;
  }

  async warning(
    message: string,
    targetElement?: HTMLElement
  ): Promise<boolean> {
    if (!targetElement) {
      targetElement = document.body;
    }

    const result = await this.show(
      {
        message,
        theme: "warning",
        confirmText: "Proceed",
        cancelText: "Cancel",
      },
      targetElement
    );
    return result.confirmed;
  }
}

export const confirmManager = new ConfirmManager();
