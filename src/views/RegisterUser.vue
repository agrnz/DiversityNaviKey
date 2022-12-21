<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0 pt-4 pl-2 ml-2" height="100%" flat tile>
    <v-card-title class="subtitle-2 pb-0 pl-2 ml-2">{{ $t('login.submitBtn') }}</v-card-title>
    <v-card-text class="pt-4 pl-2 ml-2">
    <v-form ref="form" v-model="valid" lazy-validation color="colortheme.color" class="pa-0 ma-0" height="100%" flat tile>
      <v-text-field :color="colortheme.colortext" v-model="user.username" :rules="[rules.required]" :label="$t('login.Username')" required>
      </v-text-field>
      <v-text-field :color="colortheme.colortext" v-model="user.password" :rules="[rules.required]" :label="$t('login.Password')" required type="password">
      </v-text-field>
      <v-text-field :color="colortheme.colortext" v-model="user.email" :rules="[rules.required, rules.email]" :label="$t('register.Email')" required type="email">
      </v-text-field>
      <v-card class="ml-4 mb-4" v-if="errorMessage !=='' " color="red darken-2" flat>
        <v-card-subtitle>
          {{errorMessage}}
        </v-card-subtitle>
      </v-card>
      <v-card-actions>
        <v-btn :color="colortheme.color" :disabled="!valid" @click="onRegisterBtnClicked">
          {{$t('register.submitBtn')}}
        </v-btn>
        <v-btn :color="colortheme.color" @click="onCancelRegisterBtnClicked">
          {{$t('general.cancelButton')}}
        </v-btn>
      </v-card-actions>
    </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import User from '../models/user'

export default {
  name: 'RegisterUser',
  data: () => ({
    user: new User('', ''),
    valid: true,
    rules: {
      required: value => !!value || 'Required.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
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
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  },
  methods: {
    onRegisterBtnClicked () {
      if (this.user.username && this.user.password && this.user.email) {
        this.$store.dispatch('registerUser', this.user).then(
          () => {
            this.errorMessage = ''
            this.$emit('onOKRegisterButtonClick')
          },
          error => {
            this.errorMessage = this.$t('register.RegisterError')
            console.log('error', error.message)
          }
        )
      }
    },
    onCancelRegisterBtnClicked () {
      this.$emit('onCancelRegisterButtonClick')
    }
  }
}
</script>
