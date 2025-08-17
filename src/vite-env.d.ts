/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Extend Vue global properties
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $confirm: import('./index').ConfirmAPI
  }
}