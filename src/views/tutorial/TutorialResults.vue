<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" flat tile>
    <v-card-title><v-btn icon to="/" :color="colortheme.colortext"><v-icon>mdi-arrow-left</v-icon></v-btn>{{ $t('tutorial.results.title') }}</v-card-title>
    <v-card-text>
      {{ $t('tutorial.results.text1') }}
      </v-card-text>
      <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of the result list" src="@/assets/Tutorial_Resultlist.jpg"></v-img>
      <v-card-text>
        {{ $t('tutorial.results.text2') }}
       </v-card-text>
       <v-card-title><v-btn icon to="/" :color="colortheme.colortext"><v-icon>mdi-arrow-left</v-icon></v-btn>{{ $t('tutorial.resultdetails.title') }}</v-card-title>
    <v-card-text>
      {{ $t('tutorial.results.text3') }}
      </v-card-text>
      <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of the result details page" src="@/assets/Tutorial_Resultdetails.jpg"></v-img>
  </v-card>
</template>
<script>

export default {
  name: 'TutorialResults',
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
