<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" flat tile>
    <v-card-title><v-btn icon to="/" :color="colortheme.colortext"><v-icon>mdi-arrow-left</v-icon></v-btn>{{ $t('tutorial.query.title') }}</v-card-title>
    <v-card-text>
      {{ $t('tutorial.query.text1') }}
    </v-card-text>
     <v-card-title :color="colortheme.colortext">{{ $t('tutorial.query.standard.title') }}</v-card-title>
      <v-card-text>
        {{ $t('tutorial.query.standard.text1') }}
      </v-card-text>
      <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_Deskriptor.jpg"></v-img>
       <v-card-text>
         {{ $t('tutorial.query.standard.text2') }}
      </v-card-text>
      <v-card-subtitle>Gruppierung</v-card-subtitle>
      <v-card-text>
        {{ $t('tutorial.query.standard.text3') }}
       </v-card-text>
       <v-card-text>
         {{ $t('tutorial.query.standard.text4') }}
       <v-card-subtitle>{{ $t('tutorial.query.standard.categorical.title') }}</v-card-subtitle>
       <v-card-text>
         {{ $t('tutorial.query.standard.categorical.text1') }}
       <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_CategoricalDeskriptor.jpg"></v-img>
       <v-card-text>
         {{ $t('tutorial.query.standard.categorical.text2') }}
         <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_CategoricalDeskriptorStates.jpg"></v-img>
       </v-card-text>
       </v-card-text>
       <v-card-subtitle>{{ $t('tutorial.query.standard.quantitative.title') }}</v-card-subtitle>
       <v-card-text>
         {{ $t('tutorial.query.standard.quantitative.text1') }}
       <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_QuantitativeDeskriptor.jpg"></v-img>
       </v-card-text>
       <v-card-text>
        {{ $t('tutorial.query.standard.quantitative.text2') }}
       <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_QuantitativeDeskriptorStates.jpg"></v-img>
       </v-card-text>
       <v-card-subtitle>{{ $t('tutorial.query.standard.text.title') }}</v-card-subtitle>
       <v-card-text>
         {{ $t('tutorial.query.standard.text.text1') }}
       <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_TextDeskriptor.jpg"></v-img>
       </v-card-text>
      </v-card-text>
      <v-card-subtitle>{{ $t('tutorial.query.standard.edit.title') }}</v-card-subtitle>
      <v-card-text>
        {{ $t('tutorial.query.standard.edit.text1') }}
      </v-card-text>
       <v-card-subtitle>{{ $t('tutorial.query.standard.load.title') }}</v-card-subtitle>
      <v-card-text>
        {{ $t('tutorial.query.standard.load.text1') }}
      </v-card-text>
      <v-card-title :color="colortheme.colortext">{{ $t('tutorial.query.extended.title') }}</v-card-title>
      <v-card-text>
        {{ $t('tutorial.query.extended.text1') }}
      </v-card-text>
      <v-img  class="mx-10" contain max-height="600" max-width="600" alt="Screenshot of descriptor selection" src="@/assets/Tutorial_ExtendedSearch.jpg"></v-img>
       <v-card-text>
         {{ $t('tutorial.query.extended.text2') }}
       </v-card-text>
       <v-card-text>
         {{ $t('tutorial.query.extended.text3') }}
       </v-card-text>
       <v-card-text>
         {{ $t('tutorial.query.extended.text4') }}
      </v-card-text>
  </v-card>
</template>
<script>

export default {
  name: 'TutorialQuery',
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
