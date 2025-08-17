import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VuePopoverConfirm from './index'

const app = createApp(App)
app.use(VuePopoverConfirm)
app.mount('#app')