<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0 pt-4 pl-2 ml-2" height="100%" flat tile>
    <v-card-title class="subtitle-2 pb-0 pl-2 ml-2">{{ $t('login.submitBtn') }}</v-card-title>
    <v-card-text class="pt-4 pl-2 ml-2">
    <v-form ref="form" v-model="valid" lazy-validation color="colortheme.color" class="pa-0 ma-0" height="100%" flat tile>
      <v-text-field :color="colortheme.colortext" v-model="user.username" :rules="[rules.required]" :label="$t('login.Username')" required>
      </v-text-field>
      <v-text-field :color="colortheme.colortext" v-model="user.password" :rules="[rules.required]" :label="$t('login.Password')" required type="password">
      </v-text-field>
      <v-card class="ml-4 mb-4" v-if="errorMessage !=='' " color="red darken-2" flat>
        <v-card-subtitle>
          {{errorMessage}}
        </v-card-subtitle>
      </v-card>
    </v-form>
    <v-card-actions>
        <v-btn :color="colortheme.color" :disabled="!valid" @click="onLoginBtnClicked">
          {{$t('login.submitBtn')}}
        </v-btn>
        <v-btn :color="colortheme.color" @click="onCancelLoginBtnClicked">
          {{$t('general.cancelButton')}}
        </v-btn>
      </v-card-actions>
      <v-card-subtitle class="pb-0 pl-0 ml-0">
      {{$t('general.infoTextForRegistration')}}
      <v-btn :color="colortheme.colortext" class="pb-0 pl-0 ml-0" text @click="onRegisterBtnClicked">
          {{$t('general.hereBtn')}}
        </v-btn>
      </v-card-subtitle>
    </v-card-text>
    <v-dialog v-model="registerDialog" @click:outside="onCancelRegisterButtonClick()">
      <register-user-dialog-form v-on:onOKRegisterButtonClick="onOKRegisterButtonClick()" v-on:onCancelRegisterButtonClick="onCancelRegisterButtonClick()" />
    </v-dialog>
  </v-card>
</template>
<script>
import User from '../models/user'
import RegisterUserDialogForm from '../views/RegisterUser.vue'

export default {
  name: 'Login',
  data: () => ({
    user: new User('', '', ''),
    valid: true,
    registerDialog: false,
    rules: {
      required: value => !!value || 'Required.',
      password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
        return (
          pattern.test(value) ||
          'Min. 8 characters with at least one capital letter, a number and a special character.'
        )
      }
    },
    errorMessage: ''
  }),
  components: {
    'register-user-dialog-form': RegisterUserDialogForm
  },
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  },
  methods: {
    onLoginBtnClicked () {
      if (this.user.username && this.user.password) {
        this.$store.dispatch('loginUser', this.user).then(
          () => {
            this.errorMessage = ''
            this.$emit('onOKLoginButtonClick')
          },
          error => {
            this.errorMessage = this.$t('login.LoginError')
            console.log('error', error.message)
          }
        )
      }
    },
    onCancelLoginBtnClicked () {
      this.$emit('onCancelLoginButtonClick')
    },
    onRegisterBtnClicked () {
      this.registerDialog = true
    },
    onOKRegisterButtonClick () {
      this.registerDialog = false
    },
    onCancelRegisterButtonClick () {
      this.registerDialog = false
    }
  }
}
</script>
