import { createApp } from 'vue'
import App from './App'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import vuetify from './plugins/vuetify'
import { createI18n } from 'vue-i18n'
import messages from './lang'
// TODO vue3 migrate
// Vue.config.productionTip = false
// // catches all vue errors if components do not handle and stop error propagation itself via error boundaris
// Vue.config.errorHandler = (err, vm, info) => {
//   // TODO implement DNKErrorHandler class to deal with Errors
//   console.log('VUE ERROR HANDLER ', err + vm + info)
// }
// To catch every uncaught error inside the browser
// use a global error handler : winodw.onerror
window.onerror = (msg, src, linenum, colnum, error) => {
  // TODO implement DNKErrorHandler class to deal with Errors
  console.log('WINDOW ERROR HANDLER ', msg + src + linenum + colnum + error)
}
// Catch promise exceptions (only works for new browsers)
window.onunhandledrejection = (event) => {
  console.log('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').')
}
const local = navigator.language
export const i18n = createI18n({
  locale: local,
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
