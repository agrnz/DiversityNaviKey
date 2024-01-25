<template>
  <v-card :color="colortheme.color" flat tile class="pl-0 mx-0 px-0">
    <v-dialog data-app v-model="showGroupDialog" persistent>
      <v-card :color="colortheme.color">
      <v-card-title>{{ $t('userSelectionView.Group') }}
      </v-card-title>
      <v-card-text>
        <v-row class="pb-0 px-0" tag="v-card-text" justify-start no-gutters>
          <v-col md="3" sm="3" xs="1">
                {{$t('userSelectionView.matchText')}}
          </v-col>
            <v-col><v-radio-group class="pt-0 pb-0 mt-0" v-model="logOperator" dense row @change="onLogOperatorButtonClick($event)">
              <v-radio :color="colortheme.colortext" key="0" :label="$t('userSelectionView.anyBtnText')" value="OR"></v-radio>
              <v-radio :color="colortheme.colortext" key="1" :label="$t('userSelectionView.allBtnText')" value="AND"></v-radio>
            </v-radio-group></v-col>
        </v-row>
        <v-row class="pt-0 mt-0 pb-0 px-0" tag="v-card-text" justify-start no-gutters>
          <v-col md="3" sm="3" xs="1">
                {{$t('userSelectionView.matchTextSameDesc')}}
          </v-col>
          <v-col>
            <v-radio-group class="pt-0 pb-0 mt-0" v-model="logOperatorSameDesc" dense row @change="onLogOperatorButtonClick($event)">
              <v-radio :color="colortheme.colortext" key="0" :label="$t('userSelectionView.anyBtnText')" value="OR"></v-radio>
              <v-radio :color="colortheme.colortext" key="1" :label="$t('userSelectionView.allBtnText')" value="AND"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" rounded :color="colortheme.colortext" @click="onOKGroupDialogClick()">{{ $t('selectDescriptorSearchView.cardTextOKBtn') }}</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-title class="subtitle-2 pb-2 pr-0 pl-1" :color="colortheme.colortext">{{ $t('userSelectionView.cardTitleSelectedGroup') }}
      <v-divider inset class="mx-4"></v-divider>
        <v-btn variant="text" small class="px-0" :color="colortheme.colortext" @click="onGroupClick()"><v-icon>mdi-group</v-icon>{{ $t('userSelectionView.Group') }}</v-btn>
    </v-card-title>
    <v-card-text dense class="pb-0 px-0 pt-0">
      <list-selected-descriptor-pairs @listItemDeleteClickEvent="onListItemDeleteClick($event)" @listItemEditClickEvent="onListItemEditClick($event)">
      </list-selected-descriptor-pairs>
    </v-card-text>
  </v-card>
</template>
<script>
import ListSelectedDescriptorPairs from './ListSelectedDescriptorPairs.vue'

export default {
  components: { ListSelectedDescriptorPairs },
  name: 'UserSelectionView',
  data: () => ({
    logOperator: 'AND',
    logOperatorSameDesc: 'OR',
    activeOperator: false,
    showGroupDialog: false
  }),
  mounted () {
    let savedLogOperator = this.$store.getters.getUserSelectedOperator
    if (savedLogOperator && Array.isArray(savedLogOperator) && savedLogOperator.length === 2) {
      this.logOperator = savedLogOperator[0]
      this.logOperatorSameDesc = savedLogOperator[1]
    }
  },
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    logOperators () {
      return [this.logOperator, this.logOperatorSameDesc]
    }
  },
  methods: {
    onListDeleteAllClick () {
      this.$emit('listDeleteAllEvent')
    },
    onGroupClick () {
      this.showGroupDialog = true
    },
    onOKGroupDialogClick () {
      this.showGroupDialog = false
    },
    onListItemDeleteClick (value) {
      this.$emit('listItemDeleteClickEvent', value)
    },
    onListItemEditClick (value) {
      this.$emit('listItemEditClickEvent', value)
    },
    async onLogOperatorButtonClick (value) {
      await this.$store.dispatch('passUserSelectedOperator', this.logOperators)
      this.$emit('logOperatorButtonClickEvent', this.logOperators)
    },
    onActiveOperatorClick (value) {
      if (!this.logOperator === 'undefined') {
        this.activeOperator = !this.activeOperator
      }
    }
  }
}
</script>
