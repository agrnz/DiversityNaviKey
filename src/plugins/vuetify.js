import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  breakpoint: {
    mobileBreakpoint: 'sm' // This is equivalent to a value of 960
  }
  // lang: {
  //   locales: { cs },
  //   current: 'cs'
  // }
  // lang: {
  //   t: (key, ...params) => i18n.t(key, params)
  // }
  // rtl: true // for changing direction this.$vuetify.rtl = true
})
