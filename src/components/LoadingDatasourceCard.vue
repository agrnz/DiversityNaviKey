 <template>
  <v-card :color="colortheme.color">
    <v-card-title>
      {{ $t('selectDescriptorAdvancedSearchView.loadingTitle') }} - ({{ $t(loadingmode) }})
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" :color="colortheme.colortext">mdi-information-outline</v-icon>
        </template>
        <span>({{ $t(loadingmode) }}) - {{ $t('selectDescriptorAdvancedSearchView.loadingTextInfo') }}</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>{{ $t('selectDescriptorAdvancedSearchView.loadingText') }} {{currentDatasource}}
      <v-card-text>
        <v-progress-linear indeterminate :color="colortheme.colortext"></v-progress-linear>
      </v-card-text>
      <v-btn :color="colortheme.color" @click="onCancelLoadingClick()">{{ $t('selectDescriptorAdvancedSearchView.cancelLoadingBtnText') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'LoadingDatasourceCard',
  data: () => ({
    datasourceId: 0
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    currentDatasource () {
      let newDB = this.$store.getters.getDataSourceData
      if (this.datasourceid !== newDB.id) {
        this.onDataSourceChangedEvent(newDB.id)
      }
      return newDB.displayName
    },
    loadingmode () {
      return this.$store.getters.getCurrentLoadMode.shortText
    }
  },
  methods: {
    onChangeLang () {
      // change rtl if arabic - ar or hebrew - he
      if (this.$i18n.locale === 'ar' || this.$i18n.locale === 'he') {
        this.$vuetify.rtl = true
      } else {
        this.$vuetify.rtl = false
      }
    },
    onDataSourceChangedEvent (value) {
      if (this.$store.getters.getDataSourceData) {
        const datasourceLanguage = this.$store.getters.getDataSourceData.scheme_lang
        if (datasourceLanguage === 'ar' || datasourceLanguage === 'he' || datasourceLanguage === 'fa' || datasourceLanguage === 'egy') {
          this.$vuetify.rtl = true
        } else {
          this.$vuetify.rtl = false
        }
      }
      this.$emit('onDataSourceChangedEvent')
    },
    onCancelLoadingClick () {
      this.$emit('onCancelLoadingClick')
    }
  }
}
</script>
