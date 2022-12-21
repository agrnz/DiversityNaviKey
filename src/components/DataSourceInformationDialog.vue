<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" height="100%" flat tile>
    <v-card-title>{{ $t('datasourceInformation.title')}}</v-card-title>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('datasourceInformation.dbTitle') }}: {{metadata.DatasetTitle}}
    </v-card-text>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('datasourceInformation.dbDescription') }}: {{metadata.DatasetDetails}}
    </v-card-text>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('datasourceInformation.dbURI') }}: {{metadata.DatasetURI}}
    </v-card-text>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('datasourceInformation.LicenseText') }}: {{metadata.LicenseText}}
    </v-card-text>
    <!-- <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('datasourceInformation.LicenseDetails') }}: {{metadata.LicenseDetails}}
    </v-card-text> -->
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('datasourceInformation.LicenseURI') }}: {{metadata.LicenseURI}}
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'DataSourceInformationDialog',
  components: {
  },
  data: () => ({
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    metadata () {
      let current = this.$store.getters.getDataSourceData
      if (current) {
        let masterInfo = this.$store.getters.getDBMasterMetadata(current)
        if (masterInfo && masterInfo.metadata.length > 0) {
          return masterInfo.metadata[0]
        }
      }
      return []
    }
  },
  methods: {
    onOKDataSourceInfoClicked () {
      this.$emit('onOKDataSourceInfoClicked')
    }
  }
}
</script>
