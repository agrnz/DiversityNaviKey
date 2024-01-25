<template>
<v-treeview
    v-model="tree"
    open-on-click
    :items="selectedItems"
    item-key="name"
    :color="colortheme.color"
    :open="openArray"
  >
  <template v-slot:label="{ item }">
    <v-list-item :color="colortheme.greyText">
    <v-list-item-subtitle class="wrap-text">{{item.name}}</v-list-item-subtitle>
    </v-list-item>
  </template>
    <template v-slot:append-inner="{ item, leaf }">
      <v-btn v-if="leaf" dense icon @click="onListItemEditClick(item)">
      <v-icon :color="colortheme.colortext">mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn v-if="leaf" icon @click="onListItemDeleteClick(item)">
      <v-icon :color="colortheme.colortext">mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-treeview>
</template>
<script>
import { mapGetters } from 'vuex'
import groupingAndSorting from '../mixins/groupingAndSortingMethods'

export default {
  name: 'ListSelectedDescriptorPairsView',
  mixins: [groupingAndSorting],
  data: () => ({
    tree: [],
    openArray: [],
    comparatorTextBetween: 'between',
    comparators: [{ text: '=', value: '=' }, { text: 'between', value: 'between' }, { text: String.fromCharCode('0x2264'), value: '<=' }, { text: String.fromCharCode('0x2265'), value: '>=' }, { text: String.fromCharCode('0x2260'), value: '!=' }],
    textcomparators: [{ text: 'contains', value: 'contains' }],
    categoricalComparator: [{ text: '=', value: '=' }, { text: String.fromCharCode('0x2260'), value: '!=' }],
    selectionDescriptorType: process.env.VUE_APP_ENUMERATION_DESCRIPTOR,
    numberDescriptorType: process.env.VUE_APP_NUMBER_DESCRIPTOR,
    textDescriptorType: process.env.VUE_APP_TEXT_DESCRIPTOR
  }),
  computed: {
    ...mapGetters(['getUserSearchString', 'getExpertViewMode', 'getGuiColorTheme']),
    colortheme () {
      return this.getGuiColorTheme
    },
    selectedItems () {
      let userDescriptors = this.getUserSearchString // StateID, CS, StateName, CID, DestType, DescName, descriptorStateUserInputs
      if (userDescriptors && userDescriptors.length > 0) {
        let testDescriptors = this.groupObjectArrayBy(userDescriptors, 'descName')
        let values = Object.entries(testDescriptors)
        testDescriptors = values.map(item => ({ name: item[0], children: item[1] }))
        // }
        testDescriptors.forEach(child => {
          for (let childItem of child.children) {
            let childStateName = childItem.csName
            // if (!this.getExpertViewMode && childItem.descType === this.numberDescriptorType) {
            if (childItem.descType === this.numberDescriptorType) {
              childStateName = ''
            }
            // get descriptor infos
            let descriptorInfo = this.$store.getters.getDescriptorByID(childItem.CID)
            let appendUnit = ''
            if (descriptorInfo) {
              if (descriptorInfo.unit) {
                appendUnit = descriptorInfo.unit
              }
            }
            // save user input for number state values, e.g. ['=', 1] , ['between', 10, 15]..
            if (childItem.descType === this.selectionDescriptorType) {
              let childOperatorText = this.categoricalComparator.find(op => op.value === childItem.descriptorStateUserInputs[0]).text
              childItem['name'] = childOperatorText + ' ' + childItem.csName
            }
            if (childItem.descType === this.numberDescriptorType && childItem.descriptorStateUserInputs.length > 1 && childItem.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
              let childOperatorText = this.comparators.find(op => op.value === childItem.descriptorStateUserInputs[0]).text
              childItem['name'] = childStateName + ' ' + childOperatorText + ' ' + childItem.descriptorStateUserInputs[1] + ' ' + appendUnit
            }
            if (childItem.descType === this.numberDescriptorType && childItem.descriptorStateUserInputs.length > 2) {
              let childOperatorText = this.comparators.find(op => op.value === childItem.descriptorStateUserInputs[0]).text
              childItem['name'] = childStateName + ' ' + childOperatorText + ' ' + childItem.descriptorStateUserInputs[1] + ' ' + appendUnit + ' and ' + childItem.descriptorStateUserInputs[2] + ' ' + appendUnit
            }
            if (childItem.descType === this.textDescriptorType && childItem.descriptorStateUserInputs.length > 1) {
              let childOperatorText = this.textcomparators.find(op => op.value === childItem.descriptorStateUserInputs[0]).text
              childItem['name'] = childOperatorText + ' : ' + childItem.descriptorStateUserInputs[1]
            }
          }
        })
        this.onUpdateOpenArray(testDescriptors)
        return testDescriptors
      }
      return userDescriptors
    }
  },
  methods: {
    onUpdateOpenArray (entries) {
      this.openArray = []
      if (entries && entries.length > 0) {
        for (const ent of entries) {
          this.openArray.push(ent.name)
        }
      }
    },
    onListItemDeleteClick (value) {
      this.$emit('listItemDeleteClickEvent', value)
    },
    onListItemEditClick (value) {
      this.$emit('listItemEditClickEvent', value)
    }
  }
}
</script>
<style scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
}
</style>
