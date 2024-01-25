import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'

const vuetify = createVuetify({
  components,
  directives,
  display: {
    mobileBreakpoint: 'sm'
  }
})
export default vuetify
