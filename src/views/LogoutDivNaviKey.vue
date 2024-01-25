<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0 pt-4 pl-2 ml-2" height="100%" flat tile>
    <v-card-title class="subtitle-2 pb-0 pl-2 ml-2">{{ $t('logout.Title') }}</v-card-title>
    <v-card-text class="pt-4 pl-2 ml-2">
      {{ $t('logout.infoText') }} {{userName}}
    </v-card-text>
    <v-card-text class="pt-4 pl-2 ml-2" :color="colortheme.colortext"> {{ $t('logout.checkboxDeleteAllLocalData') }}
    </v-card-text>
    <v-card-actions>
      <v-btn :color="colortheme.color" @click="onLogoutBtnClicked">
        {{$t('logout.submitBtn')}}
      </v-btn>
      <v-btn :color="colortheme.color" @click="onCancelLogoutBtnClicked">
        {{$t('general.cancelButton')}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>

export default {
  name: 'LogoutDivNaviKey',
  data: () => ({
    errorMessage: '',
    deleteAllLocalData: true
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    userName () {
      return this.$store.getters.getUserLoginName
    }
  },
  methods: {
    async onLogoutBtnClicked () {
      if (this.deleteAllLocalData) {
        await this.$store.dispatch('logoutUser', this.deleteAllLocalData).then(
          () => {
            this.errorMessage = ''
            this.$emit('onOKLogoutButtonClick')
          },
          error => {
            if (error.status_code && error.status_code === 401) {
              // catch exceptions since we are in logout
              this.errorMessage = this.$t('logout.LogoutError')
              console.log('error in logout - ok if token has expired, no need to throw error', error.message)
              this.$emit('onCancelLogoutButtonClick')
            } else {
              this.errorMessage = this.$t('logout.LogoutError')
              console.log('error', error.message)
            }
          }
        )
      }
    },
    onCancelLogoutBtnClicked () {
      this.$emit('onCancelLogoutButtonClick')
    }
  }
}
</script>
