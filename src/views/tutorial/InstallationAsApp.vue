<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" flat tile>
    <v-card-title><v-btn icon to="/" :color="colortheme.colortext"><v-icon>mdi-arrow-left</v-icon></v-btn>{{ $t('tutorial.installation.title') }}</v-card-title>
    <v-card-text>
      {{ $t('tutorial.installation.text1') }}
      </v-card-text>
      <v-card-text>
        {{ $t('tutorial.installation.text2') }}
     <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot installation" src="@/assets/Tutorial_InstallAsApp.jpg"></v-img>
       </v-card-text>
      <v-card-text>
        {{ $t('tutorial.installation.text3') }}
      </v-card-text>
      <v-card-text>
        {{ $t('tutorial.installation.text4') }}
    </v-card-text>
  </v-card>
</template>
<script>

export default {
  name: 'InstallationAsApp',
  data: () => ({
    color: 'grey lighten-4 light-green--text text--darken-3',
    colordarken: 'grey lighten-2 light-green--text text--darken-3',
    colortext: 'light-green darken-3'
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  },
  methods: {
  }
}
</script>
