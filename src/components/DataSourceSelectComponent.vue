<template>
  <v-card :color="colortheme.color">
    <v-card-title class="subtitle-2 pb-0 pl-2 ml-2">{{ $t('datasourceSelectComponent.loadingTitle') }}
      <v-spacer></v-spacer>
      <v-btn v-if="testEnvironment && !loggedIn" :color="colortheme.colortext" variant="text" @click="onLoginButtonClick">
        <v-icon left>mdi-login</v-icon>{{ $t('login.submitBtn') }}
        </v-btn>
        <v-btn v-else-if="testEnvironment" :color="colortheme.colortext" variant="text" @click="onUserButtonClick">
        <v-icon left>mdi-account</v-icon>
        </v-btn>
        </v-card-title>
    <v-card-text class="pt-4 pl-2 ml-2" v-if="!defaultDatasourceId">
      {{ $t('datasourceSelectComponent.infoText') }}
      <v-select :items="datasources" v-model="datasourceId" :item-value="item => item.id" @change="onChangeSource"
      :item-title="item => item.displayName" :label="$t('naviToolbar.selecteDatasourcePlaceHolder')"
      :aria-labelledby="$t('naviToolbar.selecteDatasourcePlaceHolder')"
      :color="colortheme.colortext" :item-color="colortheme.colortext" flat hide-selected>
    </v-select>
    <v-card-text  v-if="availableSchemes.length > 0">
    <v-radio-group class="pt-0 pb-0 mt-0" v-model="schemeSelect" dense column>
      <v-radio :color="colortheme.colortext" key="auto" :label="$t('datasourceSelectComponent.schemeAutoText')" value="auto"></v-radio>
      <v-radio :color="colortheme.colortext" key="self" :label="$t('datasourceSelectComponent.schemeSelfText')" value="self"></v-radio>
    </v-radio-group>
    <v-card-text v-if="schemeSelect==='self'">{{ $t('datasourceSelectComponent.datasourceLanguageInfo') }}
    </v-card-text>
    <v-select v-if="schemeSelect==='self'" class="pt-0 pl-4 ml-2" :items="availableSchemes" v-model="schemeId" :item-value="item => item"
      :item-title="item => item.scheme_lang" :label="$t('datasourceSelectComponent.selectScheme')"
      :aria-labelledby="$t('datasourceSelectComponent.selectScheme')"
      :color="colortheme.colortext" :item-color="colortheme.colortext" flat hide-selected>
    </v-select>
      <v-card-title class="subtitle-2 pb-0 pl-0 ml-0" :color="colortheme.color">{{ $t('settings.images')}}</v-card-title>
      <v-checkbox class="ml-0 mb-0 pb-0" :color="colortheme.colortext" v-model="showDescriptorStateImagesIfAvailable" :label="$t('settings.showDescriptorStateImagesIfAvailable')" @change="onShowDescriptorStateImagesIfAvailable">
    </v-checkbox>
    <v-checkbox class="ml-0 mt-0 pt-0" :color="colortheme.colortext" v-model="showItemImagesIfAvailable" :label="$t('settings.showItemImagesIfAvailable')" @change="onShowItemImagesIfAvailable">
    </v-checkbox>
    </v-card-text>
    </v-card-text>
    <v-card-text>{{ $t('selectDescriptorAdvancedSearchView.loadingTextInfo') }}
      <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxSetAsDefault" :label="$t('datasourceSelectComponent.setDefaultCheckboxtext')">
    </v-checkbox>
    </v-card-text>
    <v-card-actions v-if="!defaultDatasourceId">
      <v-btn @click="onChange">
        {{ $t('selectDescriptorSearchView.cardTextOKBtn') }}
      </v-btn>
      <v-btn @click="onCancel">
        {{ $t('selectDescriptorSearchView.cardTextCancelBtn') }}
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="loginDialog" @click:outside="onCancelLoginButtonClick()">
      <login-dialog-form v-on:onOKLoginButtonClick="onOKLoginButtonClick()" v-on:onCancelLoginButtonClick="onCancelLoginButtonClick()" />
    </v-dialog>
    <v-dialog v-model="logoutDialog" @click:outside="onCancelLogoutButtonClick()">
      <logout-dialog-form v-on:onOKLogoutButtonClick="onOKLogoutButtonClick()" v-on:onCancelLogoutButtonClick="onCancelLogoutButtonClick()" />
    </v-dialog>
  </v-card>
</template>
<script>
import LoginDialogForm from '../views/LoginDivNaviKey.vue'
import LogoutDialogForm from '../views/LogoutDivNaviKey.vue'
import { mapGetters } from 'vuex'
import groupingAndSorting from '../mixins/groupingAndSortingMethods'

export default {
  name: 'DataSourceSelectComponent',
  mixins: [groupingAndSorting],
  data: () => ({
    defaultDatasourceId: null,
    datasourceId: null,
    masterDB: null,
    checkboxSetAsDefault: true,
    availableSchemes: [],
    schemeId: null,
    schemeSelect: 'auto',
    loginDialog: false,
    logoutDialog: false,
    localStorageName: process.env.VUE_APP_INDEXED_DB_NAME
  }),
  components: {
    'login-dialog-form': LoginDialogForm,
    'logout-dialog-form': LogoutDialogForm
  },
  created () {
    // set default database
    this.setDefaultDataSourceID(this.$store.getters.getDefaultDatasourceId)
    this.setMasterDataSourceID(this.$store.getters.getCurrentDatasourceID)
    // this.setShowDescriptorStateImagesIfAvailable(this.$store.getters.getShowDescriptorStateImagesIfAvailable)
  },
  computed: {
    ...mapGetters(['getMasterDatasources', 'getGuiColorTheme', 'getCurrentLanguage', 'getAvailabelSchemesOfMaster', 'getDataSourceInfoById', 'getSynchronizeDatasourceLanguage', 'getMasterDataSourceInfo', 'getUserLoggedInStatus']),
    datasources () {
      const availabeDS = this.getMasterDatasources
      return availabeDS
    },
    testEnvironment () {
      if (process.env.VUE_APP_TESTENV_FLAG === 'TEST_ENVIRONMENT') {
        return true
      }
      return false
    },
    colortheme () {
      return this.getGuiColorTheme
    },
    loggedIn () {
      return this.getUserLoggedInStatus
    },
    showDescriptorStateImagesIfAvailable: {
      get () {
        // console.log('get')
        return this.$store.getters.getShowDescriptorStateImagesIfAvailable
      },
      set (value) {
        this.onShowDescriptorStateImagesIfAvailable(value)
      }
    },
    showItemImagesIfAvailable: {
      get () {
        return this.$store.getters.getShowItemImagesIfAvailable
      },
      set (value) {
        this.onShowItemImagesIfAvailable(value)
      }
    }
  },
  methods: {
    onShowDescriptorStateImagesIfAvailable (value) {
      this.$store.dispatch('passShowDescriptorStateImagesIfAvailable', value)
      let keyname = this.localStorageName + '/showDescriptorStateImagesIfAvailable'
      localStorage.setItem(keyname, value)
    },
    onShowItemImagesIfAvailable (value) {
      this.$store.dispatch('passShowItemImagesIfAvailable', value)
      let keyname = this.localStorageName + '/showItemImagesIfAvailable'
      localStorage.setItem(keyname, value)
    },
    async onChangeSource () {
      let dbinfoMaster = this.getDataSourceInfoById(this.datasourceId)
      if (dbinfoMaster && dbinfoMaster.length > 0) {
        this.masterDB = dbinfoMaster[0]
        let availableSchemes = this.getAvailabelSchemesOfMaster(dbinfoMaster[0])
        this.availableSchemes = availableSchemes.sort(this.compareValuesForSorting('scheme_lang', 'scheme_lang', 'asc', 'asc'))
      }
    },
    async onChange () {
      if (!this.masterDB || !this.availableSchemes) {
        console.log('ERROR on datasources, no master or scheme available?')
        return
      }
      if (this.schemeSelect === 'auto') {
        const lang = this.getCurrentLanguage
        let testAvailalbe = this.availableSchemes.filter(scheme => scheme.scheme_lang === lang.key)
        if (testAvailalbe && testAvailalbe.length === 1) {
          this.schemeId = testAvailalbe[0]
        } else {
          // set default master lang
          this.schemeId = this.masterDB
        }
      }
      if (!this.schemeId) {
        this.schemeId = this.masterDB
      }
      await this.$store.dispatch('passSelectedDatasourceId', this.schemeId.id)
      await this.$store.dispatch('loadNewDatasourceData')
      // set database (set to null for API loading cancellation)
      this.setDataSourceID(this.$store.getters.getCurrentDatasourceID)
      let syncronizeLang = true
      if (this.schemeSelect !== 'auto') {
        syncronizeLang = false
      }
      // save as default
      if (this.checkboxSetAsDefault && this.datasourceId) {
        let keyname = this.localStorageName + '/diversityDefaultDatasourceID'
        localStorage.setItem(keyname, this.schemeId.id)
        keyname = this.localStorageName + '/diversitySynchronizeLanguage'
        localStorage.setItem(keyname, syncronizeLang)
        await this.$store.dispatch('passSelectedDefaultDatasourceId', this.schemeId.id)
      }
      await this.$store.dispatch('passSynchronizeDataSourceLanguage', syncronizeLang)
      if (this.$store.getters.getDataSourceData) {
        const datasourceLanguage = this.$store.getters.getDataSourceData.scheme_lang
        if (datasourceLanguage === 'ar' || datasourceLanguage === 'he' || datasourceLanguage === 'fa' || datasourceLanguage === 'egy') {
          this.$vuetify.rtl = true
        } else {
          this.$vuetify.rtl = false
        }
      }
    },
    async setDefaultDataSourceID (id) {
      this.defaultDatasourceId = id
      if (this.defaultDatasourceId) {
        await this.$store.dispatch('passSelectedDatasourceId', this.defaultDatasourceId)
        if (this.$store.getters.getCurrentDatasourceID) {
          await this.$store.dispatch('loadNewDatasourceData')
          // set database (set to null for API loading cancellation)
          this.setDataSourceID(this.$store.getters.getCurrentDatasourceID)
        } else {
          this.defaultDatasourceId = null
        }
      }
    },
    setDataSourceID (id) {
      this.$emit('onDatasourceSet')
    },
    setMasterDataSourceID (id) {
      let dbinfo = this.getDataSourceInfoById(id)
      if (dbinfo && dbinfo.length > 0) {
        let masterInfo = this.getMasterDataSourceInfo(dbinfo[0])
        if (masterInfo) {
          this.masterDB = masterInfo
          this.datasourceId = this.masterDB
          let availableSchemes = this.getAvailabelSchemesOfMaster(this.masterDB)
          this.availableSchemes = availableSchemes.sort(this.compareValuesForSorting('scheme_lang', 'scheme_lang', 'asc', 'asc'))
          this.schemeId = dbinfo[0]
        }
      }
      if (this.getSynchronizeDatasourceLanguage) {
        this.schemeSelect = 'auto'
      } else {
        this.schemeSelect = 'self'
      }
    },
    onCancel () {
      this.$emit('onCancel')
    },
    onOKLoginButtonClick () {
      console.log('loggedIn', this.$store.getters.getUserLoggedInStatus)
      console.log('user', this.$store.getters.getUserLoginName)
      this.loginDialog = false
    },
    onCancelLoginButtonClick () {
      this.loginDialog = false
    },
    onLoginButtonClick () {
      this.loginDialog = true
    },
    onUserButtonClick () {
      this.logoutDialog = true
    },
    async onOKLogoutButtonClick () {
      console.log('loggedIn??', this.$store.getters.getUserLoggedInStatus)
      console.log('user??', this.$store.getters.getUserLoginName)
      // reset vuex state (selected db before logout maybe restricted one -> thus delete old state)
      // await this.$store.dispatch('resetDataAfterLogout')
      this.logoutDialog = false
    },
    onCancelLogoutButtonClick () {
      this.logoutDialog = false
    }
  }
}
</script>
