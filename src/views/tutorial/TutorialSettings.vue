<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" flat tile>
    <v-card-title><v-btn icon to="/" :color="colortheme.colortext"><v-icon>mdi-arrow-left</v-icon></v-btn>{{ $t('tutorial.settings.title') }}</v-card-title>
    <v-card-text>
      {{ $t('tutorial.settings.text1') }}
    </v-card-text>
    <v-card-text>
      {{ $t('tutorial.settings.text2') }}
    </v-card-text>
    <v-card-title :color="colortheme.colortext">{{ $t('tutorial.settings.subtitle.data') }}</v-card-title>
      <v-card-text>
      {{ $t('tutorial.settings.subtitle.data.text1') }}
      </v-card-text>
      <v-card-text>
      {{ $t('tutorial.settings.subtitle.data.text2') }}
      <v-list :color="colortheme.colordarken">
      <v-list-item>
        <v-icon>mdi-circle-small</v-icon>
        {{ $t('tutorial.settings.subtitle.data.item1') }}
      </v-list-item>
      <v-list-item>
        <v-icon>mdi-circle-small</v-icon>
         {{ $t('tutorial.settings.subtitle.data.item2') }}
      </v-list-item>
      <v-list-item>
        <v-icon>mdi-circle-small</v-icon>
         {{ $t('tutorial.settings.subtitle.data.item3') }}
      </v-list-item>
      <v-list-item>
      <v-icon>mdi-circle-small</v-icon>
         {{ $t('tutorial.settings.subtitle.data.item4') }}
      </v-list-item>
      </v-list>
      </v-card-text>
       <v-card-title :color="colortheme.colortext">{{ $t('tutorial.settings.subtitle.searchoptions') }}</v-card-title>
      <v-card-text>
       {{ $t('tutorial.settings.subtitle.searchoptions.text1') }}
      </v-card-text>
      <v-card-text>
      {{ $t('tutorial.settings.subtitle.searchoptions.text2') }}
      </v-card-text>
       <v-card-title :color="colortheme.colortext">{{ $t('tutorial.settings.subtitle.sorting') }}</v-card-title>
      <v-card-text>
        {{ $t('tutorial.settings.subtitle.sorting.text1') }}
     <v-list :color="colortheme.colordarken">
     <v-list-item>
           <v-icon>mdi-circle-small</v-icon>
           {{ $t('tutorial.settings.subtitle.sorting.item1') }}
      </v-list-item>
      <v-list-item>
           <v-icon>mdi-circle-small</v-icon>
            {{ $t('tutorial.settings.subtitle.sorting.item2') }}
      </v-list-item>
     <v-list-item>
           <v-icon>mdi-circle-small</v-icon>
          {{ $t('tutorial.settings.subtitle.sorting.item3') }}
      </v-list-item>
     </v-list>
      </v-card-text>
      <v-card-text>
        {{ $t('tutorial.settings.subtitle.sorting.text2') }}
      </v-card-text>
  </v-card>
</template>
<script>

export default {
  name: 'TutorialSettings',
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
