import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/lang/en'
import axios from 'axios'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocal: 'en',
  messages
})

const loadedLanguages = ['en'] // preloaded default language

function setI18nLanguage (lang) {
    i18n.locale = lang
    axios.defaults.headers.common['Accept-Language'] = lang
    document.querySelector('html').setAttribute('lang', lang)
    return lang
}

export function loadLanguageAsync (lang) {
    if (i18n.locale === lang) {
        return Promise.resolve(setI18nLanguage(lang))
    }

    if (loadedLanguages.includes(lang)) {
        return Promise.resolve(setI18nLanguage(lang))
    }

    return import(/* webpackChunkName: "lang-[request]" */ `@/i18n/messages/${lang}.js`).then(
        messages => {
            i18n.setLocaleMessage(lang, messages.default)
            loadedLanguages.push(lang)
            return setI18nLanguage(lang)
        }
    )
}