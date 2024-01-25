<template>
<v-card>
    <v-card :color="colortheme.color" v-if="(selectedDescriptor && selectedDescriptor.type === selectionDescriptorType)">
      <v-card-title>{{selectedDescriptorTitle}}</v-card-title>
      <v-card-text v-if="selectedDescriptor.notes" v-html="selectedDescriptor.notes">
        </v-card-text>
        <v-card-text class="pt-2" v-if="stateImagesAvailable && selectedDescriptorImages">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.colordarken">
            {{ $t('navikeyResultDetails.imagesTitle')}}
          </v-expansion-panel-header>
          <v-expansion-panel-content :color="colortheme.greyText">
            <diversity-navikey-imagecarousel :carousel-images="selectedDescriptorImages"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-text>
        <v-select :items="categoricalComparator" v-model="categoricalComparatorValue" solo style="width: 100px" :color="colortheme.colortext" :item-color="colortheme.colortext">
        </v-select>
        <v-autocomplete v-if="!isMobile" :color="colortheme.colortext" hide-no-data :type="switchtype" :no-data-text="$t('selectDescriptorSearchView.noStatesText')"
        :label="$t('selectDescriptorSearchView.selecteDescriptorStateLabel')" v-model="selectedItems" loader-height="50" :menu-props="{ maxHeight:600 }"
        :items="itemStates" :item-title="item => item.csName" item-value="stateID" flat return-object multiple :item-color="colortheme.colortext">
        <template v-slot:item="data">
          <v-row justify="center">
            <v-col cols="12">
              <v-list >
                <v-divider inset></v-divider>
                <v-list-item>
                  <v-list-item icon class="pt-2">
                    <v-icon :color="colortheme.colortext" v-if="data.attrs.inputValue">mdi-checkbox-marked</v-icon><v-icon v-else>mdi-checkbox-blank-outline</v-icon>
                    <v-tooltip top content-class="custom-tooltip">
                      <template v-slot:activator>
                        <!-- <v-list-item-content> -->
                          <v-img v-if="data.item.ImageToShow" max-height="200" contain max-width="200" :src="data.item.ImageToShow" class="ml-4"/>
                        <!-- </v-list-item-content> -->
                        <!-- <v-list-item-avatar v-on="on" v-if="stateImagesAvailable" v-bind="attrs" size="60" tile left>
                              <img contain :src="data.item.ImageToShow" alt="">
                            </v-list-item-avatar> -->
                      </template>
                      <span> <img class="custom-img" :src="data.item.ImageToShow"/> </span>
                    </v-tooltip>
                  </v-list-item>
                  <!-- <v-list-item-content> -->
                    <v-list-item-title class="wrap-text">
                        {{ data.item.csName }}
                      <v-list-item icon v-if="stateImagesAvailable">
                        <v-icon :color="colortheme.colortext" @click="onStateInfoClick(data)" @click.stop>mdi-information</v-icon>
                      </v-list-item>
                    </v-list-item-title>
                    <!-- <v-list-item-action v-if="stateImagesAvailable">
                      <v-btn text :color="colortheme.colortext" @click="onStateInfoClick(data)" @click.stop>{{ $t('selectDescriptorSearchView.stateInfoBtn') }}</v-btn>
                    </v-list-item-action> -->
                  <!-- </v-list-item-content> -->
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </template>
        <template v-slot:append>
          <v-tooltip top>
            <template v-slot:activator>
              <v-icon :color="colortheme.colortext" @click="onActivateSearchClick()" v-text="switchtype==='button' ? 'mdi-keyboard-off-outline' : 'mdi-keyboard-outline'"></v-icon>
            </template>
            <span>{{ $t('selectDescriptorAdvancedSearchView.activateKeyboard') }}</span>
          </v-tooltip>
        </template>
        </v-autocomplete>
        <v-autocomplete v-if="isMobile" :color="colortheme.colortext" hide-no-data :type="switchtype" :no-data-text="$t('selectDescriptorSearchView.noStatesText')"
        :label="$t('selectDescriptorSearchView.selecteDescriptorStateLabel')" v-model="selectedItems" loader-height="50" :menu-props="{ maxHeight:400 }"
        :items="itemStates" :item-title="item => item.csName" item-value="stateID" flat return-object multiple :item-color="colortheme.colortext">
        <template v-slot:item="{ props, item }">
          <v-row justify="center">
            <v-col cols="12">
                <v-divider inset></v-divider>
                <v-list-item v-bind="props" class="pl-0" >
                  <v-list-item icon class="pt-2">
                    <v-icon :color="colortheme.colortext" v-if="item.raw.attrs.inputValue">mdi-checkbox-marked</v-icon><v-icon v-else>mdi-checkbox-blank-outline</v-icon>
                    <v-tooltip top content-class="custom-tooltip" >
                      <template v-slot:activato>
                         <v-img v-if="item.raw.item.ImageToShow" max-height="100" contain max-width="100" :src="data.item.ImageToShow" class="ml-2 mr-n4"/>
                      </template>
                      <span> <img class="custom-img" :src="item.raw.item.ImageToShow"/> </span>
                    </v-tooltip>
                  </v-list-item>
                  <!-- <v-list-item-content> -->
                    <v-list-item-title class="wrap-text">
                        {{ data.item.csName }}
                      <v-list-item icon v-if="stateImagesAvailable">
                        <v-icon :color="colortheme.colortext" @click="onStateInfoClick(item.raw)" @click.stop>mdi-information</v-icon>
                      </v-list-item>
                    </v-list-item-title>
                  <!-- </v-list-item-content> -->
                </v-list-item>
            </v-col>
          </v-row>
        </template>
        <template v-slot:append>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" :color="colortheme.colortext" @click="onActivateSearchClick()" v-text="switchtype==='button' ? 'mdi-keyboard-off-outline' : 'mdi-keyboard-outline'"></v-icon>
            </template>
            <span>{{ $t('selectDescriptorAdvancedSearchView.activateKeyboard') }}</span>
          </v-tooltip>
        </template>
        </v-autocomplete>
          <v-dialog v-model="showStateImageCarousel" permanent>
            <v-card :color="colortheme.color" v-if="stateInfo">
              <v-card-title>{{ $t('selectDescriptorSearchView.stateInfoDialog') }}: {{stateInfo.csName}}</v-card-title>
              <v-divider></v-divider>
              <v-card-text v-html="stateInfo.notes">
              </v-card-text>
              <v-card-text class="pt-2" v-if="stateInfo.images">
                <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.colordarken">
                      {{ $t('navikeyResultDetails.imagesTitle')}}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content :color="colortheme.greyText">
                      <diversity-navikey-imagecarousel :carousel-images="stateInfo.images"/>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  </v-expansion-panels>
              </v-card-text>
              <v-card-actions>
        <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onCancelStateInfoClick()">{{ $t('selectDescriptorSearchView.cardTextOKBtn') }}</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
      </v-card-text>
        <v-card-actions>
        <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onCancelSelectionClick()">{{ $t('selectDescriptorSearchView.cardTextCancelBtn') }}</v-btn>
        <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onOKSelectionClick()">{{ $t('selectDescriptorSearchView.cardTextOKBtn') }}</v-btn>
    </v-card-actions>
    </v-card>
    <v-card :color="colortheme.color" v-if="(selectedDescriptor && selectedDescriptor.type === numberDescriptorType && initSetting)">
      <v-card-title>{{selectedDescriptorTitle}}</v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="selectedDescriptor.notes" v-html="selectedDescriptor.notes">
        </v-card-text>
      <v-card-text class="pt-2" v-if="selectedDescriptorImages">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.colordarken">
            {{ $t('navikeyResultDetails.imagesTitle')}}
          </v-expansion-panel-header>
          <v-expansion-panel-content :color="colortheme.greyText">
            <diversity-navikey-imagecarousel :carousel-images="selectedDescriptorImages"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="auto">
            <v-select :items="comparators" v-model="userInputs.comparator" solo style="width: 100px" :color="colortheme.colortext" :item-color="colortheme.colortext">
        </v-select>
          </v-col>
          <v-text-field :color="colortheme.colortext" v-model="userInputs.firstInput" type="number" :label="$t('selectDescriptorSearchView.numberValue')" :rules="numberRules">
          </v-text-field>
          <v-text-field v-if="(userInputs.comparator === 'between')" :color="colortheme.colortext" v-model="userInputs.secondInput" type="number" label="and" :rules="numberRules"></v-text-field>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onCancelSelectionClick()">{{ $t('selectDescriptorSearchView.cardTextCancelBtn') }}</v-btn>
        <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onOKSelectionClick()">{{ $t('selectDescriptorSearchView.cardTextOKBtn') }}</v-btn>
    </v-card-actions>
    </v-card>
    <v-card :color="colortheme.color" v-if="(selectedDescriptor && selectedDescriptor.type === textDescriptorType && initSetting)">
    <v-card-title>{{selectedDescriptor.name}}</v-card-title>
    <v-card-text v-if="selectedDescriptor.notes" v-html="selectedDescriptor.notes">
        </v-card-text>
    <v-card-text class="pt-2" v-if="selectedDescriptorImages">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.colordarken">
            {{ $t('navikeyResultDetails.imagesTitle')}}
          </v-expansion-panel-header>
          <v-expansion-panel-content :color="colortheme.greyText">
            <diversity-navikey-imagecarousel :carousel-images="selectedDescriptorImages"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    <v-card-text v-for="(childItem) in itemStates" :key="childItem.stateID + '_' + childItem.selectionId">
      <v-row>
        <v-col cols="auto">
          <v-select :items="textcomparators" v-model="childItem.descriptorStateUserInputs[0]" solo style="width: 150px" class="mt-2" :color="colortheme.colortext" :item-color="colortheme.colortext">
          </v-select>
        </v-col>
        <v-col cols="10" xs="4">
        <v-form v-model="textSearchFieldIsValid">
          <v-text-field :color="colortheme.colortext" clearable type="text" v-model="childItem.descriptorStateUserInputs[1]" :rules="textRules" outlined :label="$t('selectDescriptorSearchView.textDescriptorSearchLabel')"></v-text-field>
        </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
        <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onCancelSelectionClick()">{{ $t('selectDescriptorSearchView.cardTextCancelBtn') }}</v-btn>
        <v-btn variant="outlined" rounded text :disabled="!textSearchFieldIsValid" :color="colortheme.colortext" @click="onOKSelectionClick()">{{ $t('selectDescriptorSearchView.cardTextOKBtn') }}</v-btn>
    </v-card-actions>
   </v-card>
</v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import groupingAndSorting from '../mixins/groupingAndSortingMethods'
import DiversityNaviKeyImageCarousel from '../components/DivNaviKeyImageCarousel'

export default {
  name: 'UserSelectionView',
  mixins: [groupingAndSorting],
  components: {
    'diversity-navikey-imagecarousel': DiversityNaviKeyImageCarousel
  },
  data: () => ({
    activeOperator: false,
    showGroupDialog: false,
    comparators: [{ text: '=', value: '=' }, { text: 'between', value: 'between' }, { text: String.fromCharCode('0x2264'), value: '<=' }, { text: String.fromCharCode('0x2265'), value: '>=' }, { text: String.fromCharCode('0x2260'), value: '!=' }],
    textcomparators: [{ text: 'contains', value: 'contains' }],
    categoricalComparator: [{ text: '=', value: '=' }, { text: String.fromCharCode('0x2260'), value: '!=' }],
    comparatorTextBetween: 'between',
    categoricalComparatorValue: '=',
    textSearchFieldIsValid: false,
    selectedItems: [],
    stateImagesAvailable: false,
    showStateImageCarousel: false,
    stateInfo: null,
    userInputs: { comparator: '=', firstInput: null, secondInput: null },
    selectionDescriptorType: process.env.VUE_APP_ENUMERATION_DESCRIPTOR,
    numberDescriptorType: process.env.VUE_APP_NUMBER_DESCRIPTOR,
    textDescriptorType: process.env.VUE_APP_TEXT_DESCRIPTOR
  }),
  computed: {
    ...mapGetters(['getCurrentUserSelectedDescriptor', 'getRestrictFilterPossible', 'getUserSearchString', 'getOldUserSearchString']),
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    switchtype () {
      return this.$store.getters.getSwitchType
    },
    isMobile () {
      if (this.$vuetify.display.xsOnly) {
        return true
      }
      return false
    },
    restrictFilterMode () {
      return this.$store.getters.getUseRestrictFilter
    },
    isANDDescriptorGroupMode () {
      return (this.logOperators && this.logOperators.length > 0 && this.logOperators[0] === 'AND')
    },
    numberRules () {
      return [v => !Number.isNaN(parseFloat(v)) || this.$t('selectDescriptorSearchView.numberValue')]
    },
    textRules () {
      return [value => (value && (value.length >= 3 && value.length <= 200)) || this.$t('selectDescriptorSearchView.textValue')]
    },
    selectedDescriptor () {
      return this.getCurrentUserSelectedDescriptor
    },
    // oldSelectedItems () {
    //   return this.getOldUserSearchString
    // },
    selectedDescriptorTitle () {
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.selectionDescriptorType) {
        return this.selectedDescriptor.name
      }
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.numberDescriptorType) {
        if (!this.selectedDescriptor.unit) {
          return this.selectedDescriptor.name
        }
        if (!this.selectedDescriptor.unitIsPrefix) {
          return this.selectedDescriptor.name + ' (' + this.selectedDescriptor.unit + ')'
        } else {
          return '(' + this.selectedDescriptor.unit + ') ' + this.selectedDescriptor.name
        }
      }
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.textDescriptorType) {
        return this.selectedDescriptor.name
      }
      return null
    },
    selectedDescriptorImages () {
      if (this.selectedDescriptor && this.selectedDescriptor.images && this.selectedDescriptor.images.length > 0) {
        return this.selectedDescriptor.images
      }
      return null
    },
    initSetting () {
      // init selectedItems
      // console.log('here we are')
      this.setSelectedItems()
      return true
    },
    itemStates () {
      let descriptorChildren = []
      let tempValue = ''
      if (this.selectedDescriptor.type === this.textDescriptorType) {
        tempValue = 'contains'
      }
      if (this.selectedDescriptor.type === this.numberDescriptorType) {
        tempValue = '='
      }
      if (this.selectedDescriptor && this.selectedDescriptor.id) {
        if (this.restrictFilterMode && this.getRestrictFilterPossible) {
          descriptorChildren = this.$store.getters.getChildrenOfRestDescriptor(this.selectedDescriptor.id)
        } else {
          descriptorChildren = this.$store.getters.getChildrenOfDescriptor(this.selectedDescriptor.id)
        }
        let tryStateImagesAvailable = false
        descriptorChildren.forEach(child => {
          // needed to save user input for number state values, e.g. ['=', 1] , ['between', 10, 15]..
          child['descriptorStateUserInputs'] = [tempValue]
          child['selectionId'] = 0
          // console.log('toShowState', child)
          if (this.$store.getters.getShowDescriptorStateImagesIfAvailable) {
            if (child.images && child.images.length > 0) {
              this.setStateImagesAvailable(true)
              tryStateImagesAvailable = true
              let toShow = child.images.filter(ima => ima.Order === 1)
              if (toShow && toShow.length > 0) {
                // console.log('toShowState', toShow)
                child.ImageToShow = toShow[0].URL
              } else {
                child.ImageToShow = child.images[0].URL
              }
            } else {
              child.ImageToShow = null
            }
          }
        })
        if (!tryStateImagesAvailable) {
          this.setStateImagesAvailable(false)
        }
      }
      if (descriptorChildren) {
        const sortSetting = this.$store.getters.getSortSettings
        descriptorChildren.sort(this.compareValuesForSorting(sortSetting.states.key1, sortSetting.states.key2, sortSetting.states.order1, sortSetting.states.order2))
      }
      // init selectedItems
      this.setSelectedItems()
      return descriptorChildren
    }
  },
  methods: {
    async setSelectedItems () {
      // console.log('!!!!!!!!!!!!!!!!!!!!!!setSelectedItemsInStatesDialog')
      this.selectedItems = await this.getUserSearchString
      // await this.$store.dispatch('passOldUserSelectedDescriptors', this.selctedItems)
    },
    async onOKSelectionClick () {
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.numberDescriptorType) {
        if (!this.userInputs.firstInput) {
          return
        }
        if (this.itemStates && this.itemStates.length > 0) {
          // choose first num state as default and dummy for all numerical states
          const deepClone = require('rfdc')()
          let numItem = deepClone(this.itemStates[0])
          let identSelectedItems = this.selectedItems.filter(oI => oI.CID === this.selectedDescriptor.id)
          if (identSelectedItems && identSelectedItems.length >= 1) {
            // get max value of used selectionID
            let increasedID = 0
            for (const fi of identSelectedItems) {
              if (fi.selectionId >= increasedID) {
                increasedID = fi.selectionId + 1
              }
            }
            numItem.selectionId = increasedID
          }
          numItem.descriptorStateUserInputs[0] = this.userInputs.comparator
          numItem.descriptorStateUserInputs[1] = Number(this.userInputs.firstInput)
          if (this.userInputs.comparator === 'between' && this.userInputs.secondInput) {
            numItem.descriptorStateUserInputs[2] = Number(this.userInputs.secondInput)
          }
          this.selectedItems.push(numItem)
        }
      }
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.textDescriptorType) {
        if (this.itemStates && this.itemStates.length > 0) {
          const deepClone = require('rfdc')()
          let textItem = deepClone(this.itemStates[0])
          if (textItem.CID === this.selectedDescriptor.id) {
            if (textItem.descriptorStateUserInputs && textItem.descriptorStateUserInputs.length === 2) {
              if (textItem.descriptorStateUserInputs[0] === '') {
                this.selectedDescriptor = null
                this.$store.dispatch('passCurrentUserSelectedDescriptor', this.selectedDescriptor)
                textItem = null
                return
              }
            }
            let filItems = this.selectedItems.filter(oI => oI.stateID === textItem.stateID)
            if (filItems.length >= 1) {
              // get max value of used selectionID
              let increasedID = 0
              for (const fi of filItems) {
                if (fi.selectionId >= increasedID) {
                  increasedID = fi.selectionId + 1
                }
              }
              // increase selectionId of new Item to be unique
              textItem.selectionId = increasedID
            }
            this.selectedItems.push(textItem)
          }
        }
      }
      // get new selected item
      for (const item of this.selectedItems) {
        if (this.selectedDescriptor && this.selectedDescriptor.type === this.selectionDescriptorType) {
          item.descriptorStateUserInputs[0] = this.categoricalComparatorValue
        }
        // if (!this.oldSelectedItems.includes(item)) {
        //   this.oldSelectedItems.push(item)
        // }
      }
      // pass all selected descriptors
      let userSelectedValue = this.selectedItems
      let logOperatorValue = this.logOperators
      await this.$store.dispatch('passUserSelectedDescriptors', userSelectedValue)
      // await this.$store.dispatch('passOldUserSelectedDescriptors', userSelectedValue)
      await this.$store.dispatch('passUserSelectedOperator', logOperatorValue)
      this.userInputs = { comparator: '=', firstInput: null, secondInput: null }
      this.$emit('onOKSelectionClickEvent')
    },
    async onCancelSelectionClick () {
      // console.log('CANCEL oldSelectedItems', this.selectedItems)
      // this.selectedItems = this.getOldUserSearchString
      // await this.$store.dispatch('passUserSelectedDescriptors', this.selectedItems)
      // await this.$store.dispatch('passOldUserSelectedDescriptors', this.oldSelectedItems)
      this.$emit('onCancelSelectionClick')
    },
    setStateImagesAvailable (availableImages) {
      if (availableImages) {
        this.stateImagesAvailable = true
      } else {
        this.stateImagesAvailable = false
      }
    },
    onStateInfoClick (data) {
      // console.log('test on state image click', data)
      if (data && data.item && data.item.images && data.item.images.length > 0) {
        this.stateInfo = data.item
        this.showStateImageCarousel = true
      }
    },
    onCancelStateInfoClick () {
      // console.log('test on outside candel')
      this.showStateImageCarousel = false
      this.stateInfo = null
    }
  }
}
</script>
<style scoped>
.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
}
.custom-tooltip {
    opacity: 1!important;
}
.custom-img {
    max-height:500px;
    max-width:500px;
    height:auto;
    width:auto;
}
</style>
