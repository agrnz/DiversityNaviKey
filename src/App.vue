<template>
  <v-app>
    <navikey-toolbar/>
    <v-main>
      <transition>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </transition>
    </v-main>
    <v-footer v-if="false" color="light-green darken-4" app>
      <span class="white--text">&copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
import NaviKeyToolbar from './components/NaviToolbar'
import ColorThemes from './settings/colorthemes.json'
import LoadingModes from './settings/loadingModes.json'
import AppLanguages from './settings/appLanguages.json'
// import Home from './views/Home'

export default {
  name: 'App',
  async created () {
    try {
      await this.$store.dispatch('loadAllAvailableDatasources')
    } catch (err) {
      console.log('loading list of datasources not possible', err)
    }
    this.$store.dispatch('passLoadedAllDatasources', true)
  },
  beforeMount () {
    window.addEventListener('beforeunload', this.preventNav)
    // console.log('addeventlistenenr')
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', this.preventNav)
    })
  },
  mounted () {
    const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
    if (localStorage.getItem(localStorageName + '/username')) {
      let username = (localStorage.getItem(localStorageName + '/username'))
      this.$store.dispatch('passUsername', username)
    }
    if (localStorage.getItem(localStorageName + '/diversitySynchronizeLanguage')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversitySynchronizeLanguage') === 'true')
      this.$store.dispatch('passSynchronizeDataSourceLanguage', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diversityNaviKeyLoadingMode')) {
      let loading = LoadingModes.filter(k => k.key === localStorage.getItem(localStorageName + '/diversityNaviKeyLoadingMode'))
      if (loading && loading.length > 0) {
        this.$store.dispatch('passCurrentLoadMode', loading[0])
      }
    }
    if (localStorage.getItem(localStorageName + '/diversityDefaultDatasourceID')) {
      let id = localStorage.getItem(localStorageName + '/diversityDefaultDatasourceID')
      this.$store.dispatch('passSelectedDefaultDatasourceId', id)
    }
    if (localStorage.getItem(localStorageName + '/diversityNaviKeyColorTheme')) {
      let navColorTheme = ColorThemes.filter(k => k.key === localStorage.getItem(localStorageName + '/diversityNaviKeyColorTheme'))
      if (navColorTheme && navColorTheme.length > 0) {
        this.$store.dispatch('passGuiColorTheme', navColorTheme[0])
      } else {
        this.$store.dispatch('passGuiColorTheme', ColorThemes[0])
      }
    } else {
      // default color
      if (ColorThemes && ColorThemes.length > 0) {
        this.$store.dispatch('passGuiColorTheme', ColorThemes[0])
      }
    }
    if (localStorage.getItem(localStorageName + '/diversityNaviKeyCategoricalToleranceMode')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversityNaviKeyCategoricalToleranceMode') === 'true')
      this.$store.dispatch('passIsCategoricalToleranceMode', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diversityNaviKeyPositiveCategoricalToleranceMode')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversityNaviKeyPositiveCategoricalToleranceMode') === 'true')
      this.$store.dispatch('passIsPositiveCategoricalToleranceMode', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diversityNaviKeyNumFilterIncludeExtremeValues')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversityNaviKeyNumFilterIncludeExtremeValues') === 'true')
      this.$store.dispatch('passNumFilterIncludeExtremeValues', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diversityKeyboardSelectType')) {
      this.$store.dispatch('passSwitchType', localStorage.getItem(localStorageName + '/diversityKeyboardSelectType'))
    }
    if (localStorage.getItem(localStorageName + '/diversityNoDatasourceDialog')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversityNoDatasourceDialog') === 'true')
      this.$store.dispatch('passNoDatasourceDialog', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diverstiyUseRestrictFilter')) {
      let isSet = (localStorage.getItem(localStorageName + '/diverstiyUseRestrictFilter') === 'true')
      this.$store.dispatch('passUseRestrictFilter', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diversityResultPerPageSettings')) {
      this.$store.dispatch('passResultsPerPageSetting', Number(localStorage.getItem(localStorageName + '/diversityResultPerPageSettings')))
    }
    if (localStorage.getItem(localStorageName + '/diversityNaviKeyLanguage')) {
      let lang = AppLanguages.filter(k => k.key === localStorage.getItem(localStorageName + '/diversityNaviKeyLanguage'))
      if (lang && lang.length > 0) {
        this.$i18n.locale = lang[0].key
        if (this.$i18n.locale === 'ar' || this.$i18n.locale === 'he') {
          this.$vuetify.rtl = true
        } else {
          this.$vuetify.rtl = false
        }
        this.$store.dispatch('passCurrentLanguage', lang[0])
      }
    } else {
      if (this.$i18n.locale) {
        let lang = AppLanguages.filter(k => k.key === this.$i18n.locale)
        if (lang && lang.length > 0) {
          if (this.$i18n.locale === 'ar' || this.$i18n.locale === 'he') {
            this.$vuetify.rtl = true
          } else {
            this.$vuetify.rtl = false
          }
          this.$store.dispatch('passCurrentLanguage', lang[0])
        }
      }
    }
    if (localStorage.getItem(localStorageName + '/diversitySortSettings')) {
      let sortSettings = localStorage.getItem(localStorageName + '/diversitySortSettings')
      this.$store.dispatch('passSortSettings', JSON.parse(sortSettings))
    }
    if (localStorage.getItem(localStorageName + '/diversityUseTaxonScopeInfo')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversityUseTaxonScopeInfo') === 'true')
      this.$store.dispatch('passUseTaxonScope', isSet)
    }
    if (localStorage.getItem(localStorageName + '/diversityUseTaxonSinAuthor')) {
      let isSet = (localStorage.getItem(localStorageName + '/diversityUseTaxonSinAuthor') === 'true')
      this.$store.dispatch('passUseTaxonSinAuthors', isSet)
    }
    if (localStorage.getItem(localStorageName + '/showDescriptorStateImagesIfAvailable')) {
      let isSet = (localStorage.getItem(localStorageName + '/showDescriptorStateImagesIfAvailable') === 'true')
      this.$store.dispatch('passShowDescriptorStateImagesIfAvailable', isSet)
    }
    if (localStorage.getItem(localStorageName + '/showItemImagesIfAvailable')) {
      let isSet = (localStorage.getItem(localStorageName + '/showItemImagesIfAvailable') === 'true')
      this.$store.dispatch('passShowItemImagesIfAvailable', isSet)
    }
  },
  components: {
    'navikey-toolbar': NaviKeyToolbar
    // 'home': Home
  },
  methods: {
    preventNav (event) {
      // if (!this.isEditing) return
      event.preventDefault()
      event.returnValue = ''
    }
  }
}
</script>
