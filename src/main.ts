import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initLog, logSymbol } from './data'

const app = createApp(App)

app.provide(logSymbol, initLog())

app.mount('#app')
