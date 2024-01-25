<template>
  <v-select
      v-model="selectedSearch" @change="onChangeSearch"
      :items="searches"
      menu-props="auto"
      hide-details
      single-line
      item-title="name" item-value="id"
      :style="getStyle" :color="colortheme.colortext" :item-color="colortheme.colortext"
    >
    <template v-slot:item= "{ item }">
      <v-icon>{{item.raw.icon}}</v-icon>
        <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
    </template>
    <template v-slot:selection= "{ item }">
      <v-icon v-if="!isMobile">{{ item.icon }}</v-icon>
        <v-list-item-title v-if="!isMobile">{{ item.raw.name }}</v-list-item-title>
        <v-list-item-title v-if="isMobile"> <v-icon>{{ item.raw.icon }}</v-icon></v-list-item-title>
    </template>
  </v-select>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SearchSwitcher',
  computed: {
    ...mapGetters(['isCurrentSearchDescriptorMode', 'getExpertViewMode']),
    searches () {
      return [{ id: 'name', name: this.$t('selectionToolbar.nameSearchBtn'), icon: 'mdi-magnify' }, { id: 'quick', name: this.$t('selectionToolbar.quickSearchText'), icon: 'mdi-filter-outline' }, { id: 'extended', name: this.$t('selectionToolbar.extendedSearchText'), icon: 'mdi-filter-plus-outline' }]
    },
    getStyle () {
      if (this.isMobile) {
        return 'max-width: 60px'
      } else {
        return 'max-width: 180px'
      }
    },
    isMobile () {
      return this.$vuetify.display.xsOnly
    },
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    selectedSearch: {
      get () {
        if (this.getExpertViewMode) {
          return 'extended'
        }
        if (this.isCurrentSearchDescriptorMode) {
          return 'quick'
        }
        return 'name'
      },
      set (value) {
      }
    }
  },
  methods: {
    onChangeSearch (value) {
      if (this.selectedSearch === value) {
        return
      }
      if (value === 'quick') {
        console.log('change View to QuickSearch')
        this.$store.dispatch('passExpertViewMode', false)
        this.$store.dispatch('passIsCurrentModeDesriptorMode', true)
      }
      if (value === 'name') {
        console.log('change View to ItemNameSearch')
        this.$store.dispatch('passExpertViewMode', false)
        this.$store.dispatch('passIsCurrentModeDesriptorMode', false)
      }
      if (value === 'extended') {
        console.log('change View to ExtendedSearch')
        this.$store.dispatch('passExpertViewMode', true)
        this.$store.dispatch('passIsCurrentModeDesriptorMode', true)
      }
    }
  }
}
</script>
