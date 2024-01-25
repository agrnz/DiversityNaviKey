<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" height="100%" flat tile>
    <v-card-title>{{ $t('about.infoTitle')}}</v-card-title>
    <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('about.infoShortTitle')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
              <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('about.appURLText') }}: {{url}}
    </v-card-text>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('about.appVersionText') }}: {{appVersion}}
    </v-card-text>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('about.appInfoURLTitle') }}:
        <v-btn small :color="colortheme.colortext" class="ml-2" variant="text" :href="furtherInfoURL" target="_blank">{{ $t('about.appInfoURLText') }}</v-btn>
    </v-card-text>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('about.appDataSourceInfoURLTitle') }}:
        <v-btn small :color="colortheme.colortext" class="ml-2" variant="text" :href="dataSourceInfoURL" target="_blank">{{ $t('about.appDataSourceInfoURLText') }}</v-btn>
    </v-card-text>
       </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>
<script>
export default {
  name: 'AboutDivNaviKey',
  components: {
  },
  data: () => ({
    url: process.env.VUE_APP_ROOT_API,
    appVersion: process.env.VUE_APP_VERSION,
    furtherInfoURL: process.env.VUE_APP_FURTHERINFO_URL,
    dataSourceInfoURL: process.env.VUE_APP_DATASOURCEINFO_URL
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  }
}
</script>
