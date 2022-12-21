<template>
  <v-select v-model="comLanguageSelect" @hover="$t('languageSwitcher.selectLanguage')"
  @change="onChangeLang" :items="langs" item-text="key" item-value="key" :aria-labelledby="$t('languageSwitcher.selectLanguage')"
  style="max-width: min-content" :color="colortheme.colortext" hide-details
  :item-color="colortheme.colortext">
  </v-select>
</template>
<script>
import appLanguages from '../settings/appLanguages.json'
export default {
  name: 'LanguageSwitcher',
  computed: {
    langs () {
      if (appLanguages && appLanguages.length > 0) {
        return appLanguages
      }
      return [{ key: 'en', languageText: 'English' }]
    },
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    comLanguageSelect: {
      get () {
        return this.$store.getters.getCurrentLanguage
      },
      set (value) {
      }
    }
  },
  methods: {
    onChangeLang (value) {
      if (this.comLanguageSelect && this.comLanguageSelect.key === value) {
        // console.log('nothing to change')
        return
      }
      let navLang = this.langs.filter(k => k.key === value)
      if (navLang && navLang.length > 0) {
        this.$i18n.locale = navLang[0].key
        if (this.$i18n.locale === 'ar' || this.$i18n.locale === 'he') {
          this.$vuetify.rtl = true
        } else {
          this.$vuetify.rtl = false
        }
        this.$store.dispatch('passCurrentLanguage', navLang[0])
      }
    }
  }
}
</script>
