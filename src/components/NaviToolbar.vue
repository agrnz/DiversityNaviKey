<template>
  <div>
  <v-navigation-drawer app v-model="drawer" :color="colortheme.color" id="navikey-navigation-drawer" name="navikey-navigation-drawer-button">
       <v-list nav dense :color="colortheme.color">
        <v-list-item to="/">
          <v-list-item-action>
           <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('naviToolbar.home') }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item  to="/navikey-settings">
          <v-list-item-action>
           <v-icon>mdi-tools</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('naviToolbar.settings') }}
        </v-list-item-content>
        </v-list-item>
        <v-list-item  to="/about">
          <v-list-item-action>
           <v-icon>mdi-information-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('naviToolbar.about') }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item  to="/impressum">
          <v-list-item-action>
           <v-icon>mdi-format-quote-close</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('naviToolbar.impressum') }}
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-help-circle-outline">
          <template v-slot:activator>
            <v-list-item-content>{{ $t('naviToolbar.tutorial') }}</v-list-item-content>
          </template>
          <v-list-item link to="/tutorial/gettingstarted">
          <v-list-item-title>
           {{ $t('naviToolbar.tutorial.gettingstarted') }}
          </v-list-item-title>
          </v-list-item>
          <v-list-item link to="/tutorial/navigation">
          <v-list-item-title>
           {{ $t('naviToolbar.tutorial.navigation') }}
          </v-list-item-title>
          </v-list-item>
          <v-list-item link to="/tutorial/settings">
          <v-list-item-title>
           {{ $t('naviToolbar.tutorial.settings') }}
          </v-list-item-title>
          </v-list-item>
          <v-list-item link to="/tutorial/query">
          <v-list-item-title>
           {{ $t('naviToolbar.tutorial.query') }}
          </v-list-item-title>
          </v-list-item>
          <v-list-item link to="/tutorial/results">
          <v-list-item-title>
           {{ $t('naviToolbar.tutorial.results') }}
          </v-list-item-title>
          </v-list-item>
          <v-list-item link to="/tutorial/installation">
          <v-list-item-title>
           {{ $t('naviToolbar.tutorial.installation') }}
          </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app elevation="0" :color="colortheme.color" id="navikey-application-bar" name="application-bar">
      <v-app-bar-nav-icon focusable :color="colortheme.colortext" aria-label="Navigation bar button" @click.stop="drawer = !drawer" id="navikey-application-bar-icon" name="nav-bar-icon-button"/>
      <v-img class="mx-2" v-if="!isMobile" max-height="40" max-width="40" contain src="@/assets/DWB_logo.png"></v-img>
      <v-toolbar-title @click="onDatasourceClick()">{{ datasource }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <search-switcher class="pt-0 pl-2"/>
      <v-btn v-if="testEnvironment && !loggedIn" :color="colortheme.colortext" icon @click="onLoginButtonClick">
        <v-icon left>mdi-login</v-icon>
        </v-btn>
        <v-btn v-else-if="testEnvironment" :color="colortheme.colortext" icon @click="onUserButtonClick">
        <v-icon left>mdi-account</v-icon>
        </v-btn>
      <template v-slot:extension v-if="!isMobile">
        <v-tabs :color="colortheme.colortext" grow>
          <v-tab to="/" key="tabSelection"><v-icon left ripple>mdi-database-search</v-icon>{{ $t('naviToolbar.selectorTitle') }}</v-tab>
          <v-tab to="/navikey-resultlist" key="tabResultList" ripple><v-icon left>mdi-puzzle-outline</v-icon> {{ $t('naviToolbar.matches') }} {{numberOfMatches}}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-app-bar app bottom flat v-if="isMobile">
    <v-btn block x-large v-if="isQueryPage" to="/navikey-resultlist" :color="colortheme.colortext" tile outlined>
      <span>{{ $t('naviToolbar.matches') }} {{numberOfMatches}}</span>
      <v-icon>mdi-puzzle-outline</v-icon>
    </v-btn>
    <v-btn block x-large v-if="!isQueryPage" to="/" :color="colortheme.colortext" tile outlined>
      <span>{{ $t('naviToolbar.selectorTitle') }}</span>
      <v-icon>mdi-database-search</v-icon>
    </v-btn>
    </v-app-bar>
    <v-dialog data-app v-model="dbInfoDialog">
        <datasource-information-dialog v-on:onOKDataSourceInfoClicked="onOKDataSourceInfoClicked()"></datasource-information-dialog>
      </v-dialog>
      <v-dialog v-model="loginDialog" @click:outside="onCancelLoginButtonClick()">
      <login-dialog-form v-on:onOKLoginButtonClick="onOKLoginButtonClick()" v-on:onCancelLoginButtonClick="onCancelLoginButtonClick()" />
    </v-dialog>
    <v-dialog v-model="logoutDialog" @click:outside="onCancelLogoutButtonClick()">
      <logout-dialog-form v-on:onOKLogoutButtonClick="onOKLogoutButtonClick()" v-on:onCancelLogoutButtonClick="onCancelLogoutButtonClick()" />
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SearchSwitcher from './SearchSwitcher.vue'
import DataSourceInformationDialog from './DataSourceInformationDialog'
import LoginDialogForm from '../views/Login.vue'
import LogoutDialogForm from '../views/Logout.vue'

export default {
  name: 'NaviToolbar',
  components: {
    'search-switcher': SearchSwitcher,
    'datasource-information-dialog': DataSourceInformationDialog,
    'login-dialog-form': LoginDialogForm,
    'logout-dialog-form': LogoutDialogForm
  },
  data: () => ({
    drawer: false,
    dbInfoDialog: false,
    loginDialog: false,
    logoutDialog: false
  }),
  computed: {
    ...mapGetters(['getNumberOfMatches', 'isCurrentSearchDescriptorMode', 'getExpertViewMode', 'getGuiColorTheme', 'getCurrentLoadMode', 'getDataSourceData', 'getUserLoggedInStatus']),
    colortheme () {
      return this.getGuiColorTheme
    },
    testEnvironment () {
      if (process.env.VUE_APP_TESTENV_FLAG === 'TEST_ENVIRONMENT') {
        return true
      }
      return false
    },
    isMobile () {
      if (this.$vuetify.breakpoint.mobile) {
        return true
      }
      return false
    },
    loggedIn () {
      return this.getUserLoggedInStatus
    },
    isQueryPage () {
      if (this.$route.name === 'navikey-home') {
        return true
      }
      return false
    },
    numberOfMatches () {
      const isDescriptorMode = this.isCurrentSearchDescriptorMode
      return this.getNumberOfMatches(isDescriptorMode)
    },
    datasource () {
      let current = this.$store.getters.getDataSourceData
      if (current) {
        let masterInfo = this.$store.getters.getMasterDataSourceInfo(current)
        if (masterInfo) {
          return masterInfo.projectTitle
        }
      }
      return this.$t('settings.NotSet')
    }
  },
  methods: {
    onDatasourceClick () {
      this.dbInfoDialog = false // change back to true if db info is available
    },
    onOKDataSourceInfoClicked () {
      this.dbInfoDialog = false
    },
    onOKLoginButtonClick () {
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
