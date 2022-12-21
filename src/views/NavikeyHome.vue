<template>
  <v-card class="navikey-home" :color="colortheme.color"  height="100%"  v-touch="{ left: () => swipe('Left') }">
    <v-dialog data-app v-model="available">
      <v-card :color="colortheme.color">
        <v-card-title>
          {{ $t('naviKeyHome.loadingTitle') }}
        </v-card-title>
        <v-card-text>{{ $t('navikeyHome.loadingDatasourcesText') }}
        <v-card-text>
        <v-progress-linear indeterminate :color="colortheme.colortext"></v-progress-linear>
        </v-card-text>
        </v-card-text>
      </v-card>
    </v-dialog>
    <template v-if="apiLoading">
      <v-dialog data-app v-model="apiLoading" persistent>
        <loading-datasource-card v-on:onCancelLoadingClick="onCancelLoadingClick()"></loading-datasource-card> <!--  v-on:onDataSourceChangedEvent="onDataSourceChangedEvent()" -->
      </v-dialog>
    </template>
    <template>
      <v-dialog data-app v-model="userLoggedOutPrompt">
         <v-card :color="colortheme.color">
        <v-card-title>
          {{ $t('naviKeyHome.loginExpired') }}
        </v-card-title>
        <v-card-text>{{ $t('navikeyHome.userLoginExpiredText') }}
        </v-card-text>
      </v-card>
      </v-dialog>
    </template>
    <v-snackbar v-if="!apiLoading" top right vertical :value="updateExists" :timeout="-1" :color="colortheme.color">
      {{ $t('navikeyHome.updateAvailable') }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" @click="refreshApp" :color="colortheme.colortext">
        {{ $t('navikeyHome.updateBtn') }}
        </v-btn>
      </template>
    </v-snackbar>
    <template v-if="!available">
      <v-dialog data-app v-model="showDatasourcSelectComponent">
        <data-source-select-component v-on:onDatasourceSet="onDatasourceSetEvent()" v-on:onCancel="onCancelDatasourceSelect()" class="pt-4 pl-2"/>
      </v-dialog>
    </template>
    <!-- <template v-if="newVersionsInfoDialog">
      <v-dialog data-app v-model="newVersionsInfoDialog" persistent>
        <v-card :color="colortheme.color">
          <v-card-title>
            {{ $t('navikeyHome.newVersionsInfoTitle') }}
          </v-card-title>
          <v-card-text>{{ $t('navikeyHome.newVersionsInfoText') }}</v-card-text>
          <v-card-text>
          <v-btn :color="colortheme.color" @click="onOkNewVersionClick()">{{ $t('general.okButton') }}
          </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template> -->
    <div v-if="!expertMode">
        <select-descriptor/>
    </div>
    <div v-if="expertMode">
        <expert-select/>
    </div>
  </v-card>
</template>

<script>
import SelectDescriptor from '../components/SelectDescriptorSearchView'
import ExpertSelectDescriptor from '../components/SelectDescriptorAdvancedSearchView'
import DataSourceSelectComponent from '../components/DataSourceSelectComponent.vue'
import LoadingDatasourceCard from '../components/LoadingDatasourceCard'
import { mapGetters } from 'vuex'
import update from '../mixins/updateApp'

// @ is an alias to /src
export default {
  name: 'navikey-home',
  data: () => ({
    showDatasourcSelectComponent: true
  }),
  components: {
    'select-descriptor': SelectDescriptor,
    'expert-select': ExpertSelectDescriptor,
    'data-source-select-component': DataSourceSelectComponent,
    'loading-datasource-card': LoadingDatasourceCard
  },
  mixins: [update],
  computed: {
    ...mapGetters(['getExpertViewMode', 'getGuiColorTheme', 'getAvailableDatasources', 'getLoadedAllDatasources', 'getDataSourceData', 'getDefaultDatasourceId', 'getApiLoading', 'getUserLoginExpired', 'getIsNewAppVersion', 'getIsNewRestVersion']),
    colortheme () {
      return this.getGuiColorTheme
    },
    expertMode () {
      return this.getExpertViewMode
    },
    available () {
      return !this.getLoadedAllDatasources
    },
    apiLoading () {
      return this.getApiLoading
    },
    userLoggedOutPrompt () {
      return this.getUserLoginExpired
    }
    // newVersionsInfoDialog () {
    //   if (this.getIsNewAppVersion) {
    //     return true
    //   }
    //   if (this.getIsNewRestVersion) {
    //     return true
    //   }
    //   // if (this.getIsNewDBVersion) {
    //   //   return true
    //   // }
    //   return false
    // }
  },
  methods: {
    swipe (direction) {
      console.log('swipe', direction)
      if (direction === 'Left') {
        this.$router.push({ name: 'navikey-resultlist' })
      }
    },
    onCancelLoadingClick () {
      this.$store.dispatch('passCancelAPILoading')
    },
    onDatasourceSetEvent () {
      this.showDatasourcSelectComponent = false
    },
    onCancelDatasourceSelect () {
      this.showDatasourcSelectComponent = false
    },
    onOkNewVersionClick () {
      this.$store.dispatch('passOKNewVersionInfo')
    }
  }
}
</script>
