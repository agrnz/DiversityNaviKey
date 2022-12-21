<template>
  <div-navikey-toolbar>
    <template v-slot:content>
      <v-btn v-if="checkIsCurrentModeExpert" class="pl-2"  :color="colortheme.darktext" text @click="onLoadCriteriaClick()">
        <v-icon left>mdi-folder-upload</v-icon>{{ $t('selectionToolbar.loadCriteriaText') }}
      </v-btn>
      <v-btn v-if="checkIsCurrentModeExpert" class="ml-2" :color="colortheme.darktext" text @click="onExportCriteriaClick()">
        <v-icon left>mdi-folder-download</v-icon>{{ $t('selectionToolbar.exportCriteriaText') }}
      </v-btn>
      <v-btn v-if="checkIsCurrentModeExpert"  class="ml-2" :color="colortheme.darktext" text @click="onNewCriteriaClick()">
        <v-icon left>mdi-file-outline</v-icon>{{ $t('selectionToolbar.newCriteriaText') }}
      </v-btn>
    </template>
  </div-navikey-toolbar>
</template>
<script>
import DivNaviKeyToolbar from '../components/DivNaviKeyToolbar'
import { mapGetters } from 'vuex'

export default {
  name: 'SelectionToolbar',
  components: {
    'div-navikey-toolbar': DivNaviKeyToolbar
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters(['getExpertViewMode', 'getGuiColorTheme', 'isCurrentSearchDescriptorMode']),
    colortheme () {
      return this.getGuiColorTheme
    },
    checkIsCurrentModeExpert () {
      let simpleModeDescriptor = this.isCurrentSearchDescriptorMode
      let expertMode = this.getExpertViewMode
      if (expertMode) {
        return true
      }
      if (simpleModeDescriptor) {
        return true
      }
      return false
    }
  },
  methods: {
    extendedSearchClick () {
      console.log('change View to ExtendedSearch')
      // get current mode
      let isCurrentModeExpert = this.getExpertViewMode
      if (!isCurrentModeExpert) {
        isCurrentModeExpert = !isCurrentModeExpert
        this.$store.dispatch('passExpertViewMode', isCurrentModeExpert)
      }
    },
    quickSearchClick () {
      console.log('change View to QuickSearch')
      // get current mode
      let isCurrentModeExpert = this.getExpertViewMode
      if (isCurrentModeExpert) {
        isCurrentModeExpert = !isCurrentModeExpert
        this.$store.dispatch('passExpertViewMode', isCurrentModeExpert)
      }
    },
    onNewCriteriaClick (value) {
      this.$emit('onNewCriteriaClick', value)
    },
    onLoadCriteriaClick (value) {
      this.$emit('onLoadCriteriaClick', value)
    },
    onExportCriteriaClick () {
      this.$emit('onExportCriteriaClick')
    },
    onNameSearchClick () {
      this.$emit('onNameSearchClick')
    }
  }
}
</script>
