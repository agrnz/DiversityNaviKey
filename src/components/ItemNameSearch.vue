<template>
  <v-card :color="colortheme.color" flat tile class="pl-2">
    <v-card-text class="pt-4 pl-4" :color="colortheme.colordarken">
      <v-row>
        <v-col cols="12" sm="6">
          <v-form v-model="isValid" @submit="submit">
            <v-text-field :color="colortheme.colortext" clearable type="text" v-model="searchCharacters" :rules="rules" outlined :label="$t('itemNameSearch.labelSearch')" @keydown.enter="onStartSearchClick($event)"></v-text-field>
            <v-btn type="submit" class="ml-4" :disabled="!isValid" :color="colortheme.colortext" @click="onStartSearchClick($event)"><v-icon>mdi-magnify</v-icon>{{ $t('itemNameSearch.startSearch') }}
        </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import filterMethods from '../mixins/filteringMethods'

export default {
  name: 'ItemNameSearch',
  mixins: [filterMethods],
  data: () => ({
    searchCharacters: '',
    isValid: true,
    rules: [
      value => (value && (value.length >= 3 && value.length <= 200)) || 'Min 3 characters, max 200'
    ]
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    }
  },
  methods: {
    onStartSearchClick () {
      if (this.searchCharacters && this.searchCharacters !== '' && this.searchCharacters.length >= 3) {
        // init filtermethod
        let fileNames = this.$store.getters.getItemIDNamesList
        this.initInvertedNameFilters(fileNames)
        let filteredItems = this.getFilteredNames(this.searchCharacters)
        this.$store.dispatch('passSelectedNames', { 'filteredNames': filteredItems, 'resetResult': false })
        this.$store.dispatch('passIsCurrentModeDesriptorMode', false)
      }
    },
    submit: e => {
      e.preventDefault()
    }
  }
}
</script>
