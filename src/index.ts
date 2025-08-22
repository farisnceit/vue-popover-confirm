import type { App } from 'vue';
import { vConfirm } from './directive';
import { confirmManager } from './manager';
import ConfirmRoot from './ConfirmRoot.vue';
import type { ConfirmOptions } from './types';
import './style.css';

export interface VuePopoverConfirmPlugin {
  install(app: App): void;
}

export interface ConfirmAPI {
  show(options: ConfirmOptions, targetElement: HTMLElement): void;
  hide(): void;
}

const VuePopoverConfirm: VuePopoverConfirmPlugin = {
  install(app: App) {
    // Register the directive
    app.directive('confirm', vConfirm);
    
    // Register the confirm root component globally
    app.component('VuePopoverConfirmRoot', ConfirmRoot);
    
    // Provide the confirm API
    const confirmAPI: ConfirmAPI = {
      show: (options: ConfirmOptions, targetElement: HTMLElement) => {
        confirmManager.show(options, targetElement);
      },
      hide: () => {
        confirmManager.hide();
      }
    };
    
    app.config.globalProperties.$confirm = confirmAPI;
    app.provide('$confirm', confirmAPI);
  }
};

export default VuePopoverConfirm;
export { ConfirmRoot, vConfirm, confirmManager };
export type { ConfirmOptions, ConfirmDirectiveValue } from './types';