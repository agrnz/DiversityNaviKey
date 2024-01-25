<template>
  <v-container v-if="datasourceId || apiErrored || noDatasource" class="pl-0 ml-0 pt-0">
    <template v-if="apiErrored">
      <v-card-text>{{ $t('selectDescriptorAdvancedSearchView.apiErrorText') }}</v-card-text>
    </template>
    <template v-if="noDatasource">
      <v-dialog v-model="showNoDatasource" persistent>
        <v-card :color="colortheme.color">
          <v-card-title class="subtitle-2 pb-0 pl-2 ml-2"><v-icon :color="colortheme.colortext">mdi-information-outline</v-icon>{{ $t('general.infoText') }}</v-card-title>
          <v-card-text>{{ $t('selectDescriptorSearchView.noDatasource') }}</v-card-text>
          <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxNoDatasourceInfo" :label="$t('general.noDialog')">
          </v-checkbox>
          <v-card-actions>
            <v-btn @click="onShowNoDatasourceOKClicked()">
              {{ $t('selectDescriptorAdvancedSearchView.errorButtonOK') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <selection-toolbar v-on:onLoadCriteriaClick="onLoadCriteriaClick($event)" v-on:onExportCriteriaClick="onExportCriteriaClick()" v-on:onNewCriteriaClick="onNewCriteriaClick($event)"/>
    <v-card :color="colortheme.color" flat>
      <v-card-title class="subtitle-2 pb-2 pt-4 pl-2 ml-2">{{ $t('selectDescriptorAdvancedSearchView.cardTitle') }}
      </v-card-title>
      <v-dialog v-model="loadClicked">
      <v-card :color="colortheme.color">
        <v-card-title>{{ $t('selectDescriptorAdvancedSearchView.importDialogCriteriaTitle') }}</v-card-title>
        <v-file-input @change="onInputFileSelected" v-model="searchCriteriaFile" accept=".json" :label="$t('selectDescriptorAdvancedSearchView.loadSearchCriteriaLabel')"></v-file-input>
      </v-card>
      </v-dialog>
      <v-card-text class="pt-0" :color="colortheme.colordarken" v-html="searchstring.text">
      </v-card-text>
      <v-card class="ml-4 mb-4" v-if="errorMessage !=='' " color="red darken-2" flat>
        <v-card-title class="subtitle-2">{{ $t('selectDescriptorAdvancedSearchView.errorTitle') }}</v-card-title>
        <v-card-subtitle>
        {{errorMessage}}
        <v-btn variant="outlined" small class="ml-4" @click="onErrorButtonOkClicked()">{{ $t('selectDescriptorAdvancedSearchView.errorButtonOK') }}</v-btn>
        </v-card-subtitle>
      </v-card>
      <v-card-actions>
      <v-btn class="ml-4" :color="colortheme.color" @click="onStartSearchClick($event)">
        <v-icon>mdi-magnify</v-icon>
        {{ $t('selectDescriptorAdvancedSearchView.startSearch') }}
      </v-btn>
      </v-card-actions>
    </v-card>
    <v-card :color="colortheme.color" class="pl-0 mt-4" flat tile>
      <v-card-title class="subtitle-2 pb-0 pl-2 ml-2" :color="colortheme.colordarken">{{ $t('selectDescriptorAdvancedSearchView.cardTitleCreate') }}</v-card-title>
        <v-expansion-panels flat tile :value="0" focusable>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('selectDescriptorAdvancedSearchView.cardTitleItems') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.color">
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12" md="8">
                    <v-autocomplete v-if="isMobile" :menu-props="{ maxHeight:400 }" class="pt-0" :color="colortheme.colortext" clearable open-on-clear loader-height="30"
                      prepend-icon="mdi-database-search" v-model="selectedObjects" :type="switchtype"
                      :items="descriptorItems" :item-title="item => item.name" item-value="id" :item-color="colortheme.colortext" hint="Search" flat return-object
                      @change="onSelectionChange($event)" :placeholder="$t('selectDescriptorSearchView.cardTitle')" :aria-labelledby="$t('selectDescriptorSearchView.selecteDescriptorPlaceHolder')">
                      <!-- <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title class="wrap-text">{{item.name}}
                            </v-list-item-title>
                          </v-list-item-content>
                    </template> -->
                    <template v-slot:item="{ props, item }">
                      <v-row justify="center">
                      <v-col cols="12">
                        <v-list >
                        <v-divider></v-divider>
                        <v-list-item v-bind="props" class="pl-0" >
                          <v-list-item icon class="pt-2" v-if="descriptorImagesAvailable && item.raw.ImageToShow">
                          <v-tooltip top content-class="custom-tooltip" >
                          <template v-slot:activator>
                           <!-- <v-list-item-icon v-on="on" size="60" tile left> -->
                             <!-- <v-list-item-content> -->
                                  <v-img max-height="100" contain max-width="100" :src="item.raw.ImageToShow" class="ml-2 mr-n4"/>
                             <!-- </v-list-item-content> -->
                                <!-- </v-list-item-icon> -->
                          </template>
                          <span> <img class="custom-img" :src="item.raw.ImageToShow"/> </span>
                        </v-tooltip>
                      </v-list-item>
                      <!-- <v-list-item-content> -->
                      <v-list-item-title class="wrap-text">
                        {{ data.item.name }}
                      </v-list-item-title>
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
                    <v-autocomplete v-if="!isMobile" class="pt-0" :color="colortheme.colortext" clearable open-on-clear loader-height="30" :menu-props="{ maxHeight:600 }"
                      prepend-icon="mdi-database-search" v-model="selectedObjects" :type="switchtype"
                      :items="descriptorItems" :item-title="item => item.name" item-value="id" :item-color="colortheme.colortext" hint="Search" flat return-object
                      @change="onSelectionChange($event)" :placeholder="$t('selectDescriptorSearchView.cardTitle')" :aria-labelledby="$t('selectDescriptorSearchView.selecteDescriptorPlaceHolder')">
                      <!-- <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title class="wrap-text">{{item.name}}
                            </v-list-item-title>
                          </v-list-item-content>
                    </template> -->
                    <template v-slot:item="{ props, data }">
                      <v-row justify="center">
                      <v-col cols="12">
                        <v-list >
                        <v-divider></v-divider>
                    <v-list-item v-bind="props">
                          <v-list-item icon class="pt-4" v-if="data.raw.ImageToShow">
                          <v-tooltip top content-class="custom-tooltip" >
                          <template v-slot:activator>
                           <!-- <v-list-item-icon v-on="on" size="60" tile left> -->
                             <!-- <v-list-item-content> -->
                                  <v-img max-height="200" contain max-width="200" :src="data.raw.ImageToShow"/>
                             <!-- </v-list-item-content> -->
                                <!-- </v-list-item-icon> -->
                          </template>
                          <span> <img class="custom-img ml-4" :src="data.raw.ImageToShow"/> </span>
                        </v-tooltip>
                      </v-list-item>
                      <!-- <v-list-item-content> -->
                      <v-list-item-title class="wrap-text">
                        {{ data.item.name }}
                      </v-list-item-title>
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
                    <user-selection-view v-if="selectedObjects" @listItemDeleteClickEvent="onListItemDeleteClick($event)" @listItemEditClickEvent="onListItemEditClick($event)" @logOperatorButtonClickEvent="onLogOperatorButtonClick($event)"></user-selection-view>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn @click="onAddToListOfGroups()">
                    <v-icon :color="colortheme.colortext">mdi-plus</v-icon>{{ $t('selectDescriptorAdvancedSearchView.addButtonText') }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels class="mb-6" flat tile :value="0" focusable>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color" >
              {{ $t('selectDescriptorAdvancedSearchView.cardTitleCombination') }}
            </v-expansion-panel-header>
          <v-expansion-panel-content  :color="colortheme.color">
            <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" md="8">
                <template v-for="(groupItem, idx) in listOfGroups" :key="idx">
                  <v-list-item>
                  <!-- <v-list-item-content> -->
                    <v-checkbox v-model="enabledGroup[idx]" :value="groupItem" hide-details class="shrink mr-2 mt-0" :color="colortheme.colortext" >
                      <template v-slot:label>
                        <div v-html="groupItem.text"></div>
                      </template>
                    </v-checkbox>
                  <!-- </v-list-item-content> -->
                  <v-list-item-action>
                    <v-btn icon @click="onGroupItemDeleteClick(groupItem)">
                      <v-icon :color="colortheme.colortext">mdi-close-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  </v-list-item>
                </template>
              </v-col>
            </v-row>
            <v-row :disabled="disableItemCheckbox" justify-sm="start" no-gutters>
              <v-col cols="12" sm="auto">
                <v-card-text class="mt-4" dense> {{ $t('selectDescriptorAdvancedSearchView.textLogicalOperatorBetweenGroups') }}
                </v-card-text>
              </v-col>
              <div v-for="oper in logicalOperators" :key="oper.logId + '_' + searchKey">
                <v-col cols="12" xs="12" sm="auto">
                  <v-checkbox class="ml-2" :disabled="disableCheckbox" :color="colortheme.colortext" v-model="opCheckbox" :label="oper.text" :append-icon="oper.icon" :value="oper.logId">
                  </v-checkbox>
                </v-col>
              </div>
            </v-row>
            <v-card-actions>
              <v-btn @click="onAddOperatorBetweenSelectedGroups()" :disabled="disableCheckbox">
                          <v-icon :color="colortheme.colortext">mdi-plus</v-icon>{{ $t('selectDescriptorAdvancedSearchView.addOperatorBetweenText') }}
                        </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn @click="onAddToSearchClick()" :disabled="disableSelectAsSearch" :color="colortheme.colortext">
                            <v-icon>mdi-magnify</v-icon>{{ $t('selectDescriptorAdvancedSearchView.addToSearchButtonText') }}
                          </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
        </v-expansion-panels>
        <v-card-title class="subtitle-2 pb-2 pl-2 ml-5 pt-0">{{ $t('selectDescriptorAdvancedSearchView.cardTitle') }}
        </v-card-title>
        <v-card-text class="pt-0 ml-3" :color="colortheme.colordarken" v-html="searchstring.text">
        </v-card-text>
        <v-card class="ml-4 mb-4" v-if="errorMessage !=='' " color="red darken-2" flat>
          <v-card-title class="subtitle-2">{{ $t('selectDescriptorAdvancedSearchView.errorTitle') }}</v-card-title>
          <v-card-subtitle>
            {{errorMessage}}
            <v-btn variant="outlined" small class="ml-4" @click="onErrorButtonOkClicked()">{{ $t('selectDescriptorAdvancedSearchView.errorButtonOK') }}</v-btn>
          </v-card-subtitle>
        </v-card>
        <v-card-actions>
          <v-btn class="ml-5" :color="colortheme.color" @click="onStartSearchClick($event)">
          <v-icon>mdi-magnify</v-icon>
            {{ $t('selectDescriptorAdvancedSearchView.startSearch') }}
          </v-btn>
        </v-card-actions>
        <v-card-text class="pt-8 ml-3" :color="colortheme.colordarken">
        </v-card-text>
        <v-btn block class="ml-0" large variant="text" v-if="!isMobile" to="/navikey-resultlist" :color="colortheme.colortext" outlined>
          <span>{{ $t('naviToolbar.matches') }} {{numberOfMatches}}</span>
        </v-btn>
    </v-card>
    <v-spacer/>
    <v-dialog v-model="exportDialog" @click:outside="onCancelExportButtonClick()">
      <export-dialog-form v-on:onOKExportButtonClick="onOKExportButtonClick($event)" v-on:onCancelExportButtonClick="onCancelExportButtonClick()" />
    </v-dialog>
    <v-dialog data-app v-model="show" persistent>
        <select-descriptor-states-dialog v-on:onOKSelectionClickEvent="onOKSelectionClick()" v-on:onCancelSelectionClick="onCancelSelectionClick()"></select-descriptor-states-dialog>
      </v-dialog>
  </v-container>
</template>
<script>
import UserSelectionView from '../components/UserSelectionView'
import filterMethodExpertMode from '../mixins/filterMethodExpertMode'
import groupingAndSorting from '../mixins/groupingAndSortingMethods'
import SelectionToolbar from '../components/SelectionToolbar'
import ExportDialogForm from './ExportDialogForm.vue'
import { mapGetters } from 'vuex'
import SelectDescriptorStatesDialog from './SelectDescriptorStatesDialog.vue'

export default {
  name: 'SelectDescriptorAdvancedSearchView',
  mixins: [filterMethodExpertMode, groupingAndSorting],
  components: {
    'selection-toolbar': SelectionToolbar,
    'user-selection-view': UserSelectionView,
    'export-dialog-form': ExportDialogForm,
    'select-descriptor-states-dialog': SelectDescriptorStatesDialog
  },
  mounted () {
    this.checkboxNoDatasourceInfo = this.$store.getters.getNoDatascourceInfoDialog
    if (!this.$store.getters.getDataSourceData) {
      this.noDatasource = true
      if (!this.checkboxNoDatasourceInfo) {
        this.showNoDatasource = true
      }
    }
    this.loadSimpleSearchCriteria()
  },
  data: () => ({
    errorMessage: '',
    loadClicked: false,
    loadSimple: false,
    searchCriteriaFile: [],
    selectOperatorError: '',
    selectedObjects: null,
    selectedDescriptor: null,
    show: false,
    logicalOperators: [
      { icon: '', text: 'AND', logId: 'AND' },
      { icon: '', text: 'OR', logId: 'OR' }
    ],
    logOperatorsGrouping: ['AND', 'OR'],
    opCheckbox: '',
    disableCheckbox: true,
    disableItemCheckbox: true,
    disableSelectAsSearch: true,
    searchstring: { text: '', type: process.env.VUE_APP_ADVANCEDSEARCH_EXPORT_FILETYPE, version: process.env.VUE_APP_VERSION, db_id: null, db_version: null, license: null, licenseURI: null, items: null }, // text: '', items: [ { operators: [], combinings: [], selectedValues: [] } ] },
    searchKey: 0,
    listOfGroups: [], // {groupKey, operator, values, text} - values={selectedValues: [] || groupKey1, groupKey2,..}
    enabledGroup: [],
    exportDialog: false,
    noDatasource: false,
    showNoDatasource: false,
    checkboxNoDatasourceInfo: false,
    editItem: null,
    descriptorImagesAvailable: false,
    searchStringGroupItemTypeValues: 'values',
    searchStringGroupItemTypeArrayValues: 'arrayOfValues',
    searchStringGroupItemTypeGroupItems: 'arrayOfSearchStrGroupItems',
    selectionDescriptorType: process.env.VUE_APP_ENUMERATION_DESCRIPTOR,
    numberDescriptorType: process.env.VUE_APP_NUMBER_DESCRIPTOR,
    textDescriptorType: process.env.VUE_APP_TEXT_DESCRIPTOR,
    exportSearchFileType: process.env.VUE_APP_ADVANCEDSEARCH_EXPORT_FILETYPE,
    appVersion: process.env.VUE_APP_VERSION
  }),
  computed: {
    ...mapGetters(['getExpertViewMode', 'getGuiColorTheme', 'mappedDescriptors', 'getChildrenOfDescriptor', 'getNumberOfMatches', 'getApiLoading', 'getApiErrored', 'getDataSourceData', 'getSwitchType', 'getNoDatascourceInfoDialog']),
    colortheme () {
      return this.getGuiColorTheme // .color
    },
    switchtype () {
      return this.getSwitchType
    },
    isMobile () {
      return this.$vuetify.display.xsOnly
    },
    datasourceId () {
      if (this.searchstring && this.searchstring.db_id === this.$store.getters.getCurrentDatasourceID) {
        return this.$store.getters.getCurrentDatasourceID
      } else {
        this.onDataSourceChangedEvent()
        return this.$store.getters.getCurrentDatasourceID
      }
    },
    descriptorItems () {
      let descriptors = []
      descriptors = this.mappedDescriptors // id, name, type
      if (descriptors) {
        const sortSetting = this.$store.getters.getSortSettings
        descriptors.sort(this.compareValuesForSorting(sortSetting.descriptors.key1, sortSetting.descriptors.key2, sortSetting.descriptors.order1, sortSetting.descriptors.order2))
        // set images if available
        let tryAvailableImages = false
        if (this.$store.getters.getShowDescriptorStateImagesIfAvailable) {
          for (let desc of descriptors) {
            if (desc.images && desc.images.length > 0) {
              this.setDescriptorImagesAvailable(true)
              tryAvailableImages = true
              let toShow = desc.images.filter(ima => ima.Order === 1)
              if (toShow && toShow.length > 0) {
                // console.log('toShow', toShow)
                desc.ImageToShow = toShow[0].URL
              } else {
                desc.ImageToShow = desc.images[0].URL
              }
            } else {
              desc.ImageToShow = null
            }
          }
        }
        if (!tryAvailableImages) {
          this.setDescriptorImagesAvailable(false)
        }
      }
      return descriptors
    },
    numberOfMatches () {
      return this.getNumberOfMatches(true)
    },
    apiErrored () {
      return this.getApiErrored
    }
  },
  methods: {
    async onDataSourceChangedEvent () {
      this.errorMessage = ''
      this.searchstring.text = '' // this.$t('selectDescriptorAdvancedSearchView.placeholder')
      this.searchstring.items = null
      this.searchstring.type = this.exportSearchFileType
      this.searchstring.version = this.appVersion
      this.searchstring.db_id = this.getDataSourceData ? this.getDataSourceData.id : null
      this.searchstring.db_version = this.getDataSourceData ? this.getDataSourceData.ds_version : null
      this.searchKey = 0
      this.disableCheckbox = true
      this.disableSelectAsSearch = true
      this.listOfGroups = []
      // this.oldSelectedItems = []
      this.selectedObjects = []
      // this.selectedItems = []
      this.selectedDescriptor = null
      await this.$store.dispatch('passCurrentUserSelectedDescriptor', null)
      if (!this.loadSimple) {
        await this.$store.dispatch('passUserSelectedDescriptors', [])
        // await this.$store.dispatch('passOldUserSelectedDescriptors', [])
      } else {
        this.loadSimple = false
      }
      // this.quantitativeStatesLower = []
    },
    onCancelLoadingClick () {
      this.$store.dispatch('passCancelAPILoading')
    },
    onActivateSearchClick () {
      if (this.getSwitchType === 'button') {
        this.$store.dispatch('passSwitchType', 'text')
      } else {
        this.$store.dispatch('passSwitchType', 'button')
      }
    },
    // Selecting a new descriptor, a selction dialog for states pops up
    // The current new selected descriptor is set to this.selectedDescriptor
    onSelectionChange (value) {
      if (value) {
        this.show = true
        this.selectedDescriptor = value
        this.$store.dispatch('passCurrentUserSelectedDescriptor', this.selectedDescriptor)
      }
    },
    setDescriptorImagesAvailable (availableImages) {
      if (availableImages) {
        this.descriptorImagesAvailable = true
      } else {
        this.descriptorImagesAvailable = false
      }
    },
    // Delete old selection criteria and reset all values.
    onNewCriteriaClick (value) {
      this.errorMessage = ''
      this.searchstring.text = '' // this.$t('selectDescriptorAdvancedSearchView.placeholder')
      this.searchstring.items = null
      this.searchstring.type = this.exportSearchFileType
      this.searchstring.version = this.appVersion
      this.searchstring.db_id = this.getDataSourceData ? this.getDataSourceData.id : null
      this.searchstring.db_version = this.getDataSourceData ? this.getDataSourceData.ds_version : null
      this.searchKey = 0
      this.disableCheckbox = true
      this.disableSelectAsSearch = true
      this.listOfGroups = []
      // this.oldSelectedItems = []
      this.selectedObjects = []
      // this.selectedItems = []
      this.selectedDescriptor = null
      // this.quantitativeStatesLower = []
      // clear search result and pass to vuex
      this.$store.dispatch('passSelectedItems', { 'filteredItems': [], 'resetResult': true })
      this.$store.dispatch('passSearchstringExtendedSearch', [])
      this.$store.dispatch('passCurrentUserSelectedDescriptor', null)
      this.$store.dispatch('passUserSelectedDescriptors', [])
      // this.$store.dispatch('passOldUserSelectedDescriptors', [])

      this.disableItemCheckbox = true
      this.userInputs = { comparator: '=', firstInput: null, secondInput: null }
    },
    /**
     * Transfer searchstring items to the format used in filterMethodExpertMode
     */
    createSearchStringToPass () {
      let partToAdd = []
      const valueType = this.searchStringGroupItemTypeValues
      const arrayValueType = this.searchStringGroupItemTypeArrayValues
      const groupItemsType = this.searchStringGroupItemTypeGroupItems
      let searchStrGroupItems = this.searchstring.items // overall parent
      if (searchStrGroupItems.type === this.searchStringGroupItemTypeValues) {
        // groupValues.length has to be 1 and no operator
        partToAdd.push([searchStrGroupItems.groupValues[0], searchStrGroupItems.groupValues[0].descriptorStateUserInputs[0]])
        return partToAdd
      }
      if (searchStrGroupItems.type === this.searchStringGroupItemTypeArrayValues) {
        let newPart = []
        for (let ind = 0; ind < searchStrGroupItems.groupValues.length; ind++) {
          if (ind === 0) {
            newPart.push([searchStrGroupItems.groupValues[ind].groupValues, searchStrGroupItems.groupValues[ind].groupValues.descriptorStateUserInputs[0]])
          } else {
            let currentOp = searchStrGroupItems.operator
            newPart.push(currentOp)
            newPart.push([searchStrGroupItems.groupValues[ind].groupValues, searchStrGroupItems.groupValues[ind].groupValues.descriptorStateUserInputs[0]])
          }
        }
        partToAdd.push(newPart)
        return partToAdd
      }
      if (searchStrGroupItems.type === this.searchStringGroupItemTypeGroupItems) {
        let currentOp = searchStrGroupItems.operator
        let tempPart = recursiveGroup(searchStrGroupItems.groupValues, currentOp)
        return tempPart
      }
      // inner function called recursively
      function recursiveGroup (groupValues, groupOperator) {
        let returnPart = []
        for (let groupOfGroupIndex = 0; groupOfGroupIndex < groupValues.length; groupOfGroupIndex++) {
          if (groupValues[groupOfGroupIndex].type === valueType) {
            if (groupOfGroupIndex > 0) {
              returnPart.push(groupOperator)
            }
            returnPart.push([groupValues[groupOfGroupIndex].groupValues[0], groupValues[groupOfGroupIndex].groupValues[0].descriptorStateUserInputs[0]])
          }
          if (groupValues[groupOfGroupIndex].type === arrayValueType) {
            let newPart = []
            if (groupOfGroupIndex > 0) {
              returnPart.push(groupOperator)
            }
            for (let ind = 0; ind < groupValues[groupOfGroupIndex].groupValues.length; ind++) {
              if (ind === 0) {
                newPart.push([groupValues[groupOfGroupIndex].groupValues[ind].groupValues, groupValues[groupOfGroupIndex].groupValues[ind].groupValues.descriptorStateUserInputs[0]])
              } else {
                let currentOp = groupValues[groupOfGroupIndex].operator
                newPart.push(currentOp)
                newPart.push([groupValues[groupOfGroupIndex].groupValues[ind].groupValues, groupValues[groupOfGroupIndex].groupValues[ind].groupValues.descriptorStateUserInputs[0]])
              }
            }
            returnPart.push(newPart)
          }
          if (groupValues[groupOfGroupIndex].type === groupItemsType) {
            if (groupOfGroupIndex > 0) {
              returnPart.push(groupOperator)
            }
            let recursiveOperator = groupValues[groupOfGroupIndex].operator
            let tempPart = recursiveGroup(groupValues[groupOfGroupIndex].groupValues, recursiveOperator)
            returnPart.push(tempPart)
          }
        }
        return returnPart
      }
    },
    // Start searching.
    // 1) Change UI-searchstring to format used by the filtermethod
    // 2) call the filterMethod
    // 3) pass result to vuex store
    onStartSearchClick () {
      if (this.searchstring && this.searchstring.items) {
        // init filtermethod
        let categoricals = this.$store.getters.mappedDescStateItems
        let quantiative = this.$store.getters.mappedNumericalDescStateItems
        let text = this.$store.getters.mappedTextDescStateItems
        let itemNameMap = null
        let negCategoricalToleranceMode = this.$store.getters.getIsCategoricalToleranceMode
        let posCategoricalToleranceMode = this.$store.getters.getIsPositiveCategoricalToleranceMode
        negCategoricalToleranceMode || posCategoricalToleranceMode ? itemNameMap = this.$store.getters.getItemIDNameMap : itemNameMap = null
        this.initToleranceModesAdvancedMode(negCategoricalToleranceMode, posCategoricalToleranceMode)
        this.initNameMapAdvancedMode(itemNameMap)
        this.initInvertedFiltersAdvancedMode(categoricals, quantiative, text)
        let includeExtremeValues = this.$store.getters.getNumFilterIncludeExtremeValues
        this.initNumFilterIncludeExtremeValues(includeExtremeValues)
        let searchStringToPass = this.createSearchStringToPass()
        // pass to vuex
        this.$store.dispatch('passSearchstringExtendedSearch', this.searchstring)
        let filteredItems = this.getFilteredItemsAdvancedMode(searchStringToPass)
        if (filteredItems) {
        } else {
          filteredItems = []
        }
        // pass all items after filtering to vuex
        this.$store.dispatch('passSelectedItems', { 'filteredItems': filteredItems, 'resetResult': false })
      }
      this.disableCheckbox = false
      this.disableSelectAsSearch = false
    },
    // get all selected descriptors from vuex store
    // TODO
    async loadSimpleSearchCriteria () {
      // get selectedItems from store
      let selectedItems = this.$store.getters.getUserSearchString
      if (selectedItems.length > 1) {
        this.disableItemCheckbox = false
        this.loadSimple = true
      } else {
        this.disableItemCheckbox = true
      }
      this.selectedObjects = []
      this.selectedDescriptor = null
      // this.quantitativeStatesLower = []
      this.userInputs = { comparator: '=', firstInput: null, secondInput: null }
    },
    // pass new and all selected descriptors to vuex store
    async onOKSelectionClick () {
      this.show = false
      // TODO
      // for (let singleStateItem of newSelected) {
      //   if (this.selectedDescriptor && this.selectedDescriptor.type === this.selectionDescriptorType) {
      //     singleStateItem.descriptorStateUserInputs[0] = this.categoricalComparatorValue
      //   }
      // }
      this.selectedObjects = []
      this.selectedDescriptor = null
      this.$store.dispatch('passCurrentUserSelectedDescriptor', this.selectedDescriptor)
      // // this.quantitativeStatesLower = []
      // this.userInputs = { comparator: '=', firstInput: null, secondInput: null }
    },
    onCancelSelectionClick () {
      // this.selectedItems = this.oldSelectedItems
      this.show = false
      this.selectedDescriptor = null
      this.$store.dispatch('passCurrentUserSelectedDescriptor', this.selectedDescriptor)
      this.selectedObjects = []
      // this.quantitativeStatesLower = []
    },
    async onLogOperatorButtonClick (value) {
      if (this.logOperatorsGrouping[0] === value[0] && this.logOperatorsGrouping[1] === value[1]) {
        return
      }
      this.logOperatorsGrouping = value
    },
    async onListItemDeleteClick (params) {
      let filteredSelectedItems = []
      let selectedItems = this.$store.getters.getUserSearchString
      if (params && params.descType === this.numberDescriptorType) {
        // delete all states (min, max, lower,..) of the descriptor
        filteredSelectedItems = selectedItems.filter(it => !(it.CID === params.CID && (it.descriptorStateUserInputs[0] === params.descriptorStateUserInputs[0] && it.descriptorStateUserInputs[1] === params.descriptorStateUserInputs[1])))
      } else {
        for (const itemToFilter of selectedItems) {
          if (itemToFilter.stateID !== params.stateID) {
            filteredSelectedItems.push(itemToFilter)
            continue
          }
          if (itemToFilter.selectionId !== params.selectionId) {
            filteredSelectedItems.push(itemToFilter)
            continue
          }
        }
      }
      await this.$store.dispatch('passUserSelectedDescriptors', filteredSelectedItems)
      // await this.$store.dispatch('passOldUserSelectedDescriptors', filteredSelectedItems)
      this.onOKSelectionClick()
    },
    onListItemEditClick (params) {
      let selectedItems = this.$store.getters.getUserSearchString
      if (selectedItems && selectedItems.length > 0) {
        for (const itemToEdit of selectedItems) {
          if (itemToEdit.stateID === params.stateID && itemToEdit.selectionId === params.selectionId) {
            let editDescriptor = this.$store.getters.getDescriptorByID(itemToEdit.CID)
            // reset old search
            // reset old search
            this.editItem = itemToEdit
            this.onSelectionChange(editDescriptor)
          }
        }
      }
    },
    onGroupItemDeleteClick (groupItem) {
      let filteredGroupItems = []
      for (const groupToFilter of this.listOfGroups) {
        if (groupToFilter.groupKey !== groupItem.groupKey) {
          filteredGroupItems.push(groupToFilter)
          continue
        }
      }
      this.listOfGroups = filteredGroupItems
      this.enabledGroup = []
    },
    onSelectionClick (value) {
      this.onOKSelectionClick()
    },
    async onListDeleteAllClick () {
      this.errorMessage = ''
      await this.$store.dispatch('passUserSelectedDescriptors', [])
      // await this.$store.dispatch('passOldUserSelectedDescriptors', [])
      this.onOKSelectionClick()
      // reset check/uncheck status of states
      // this.quantitativeStatesLower = []
    },
    onLoadCriteriaClick (value) {
      if (this.noDatasource && !this.checkboxNoDatasourceInfo) {
        this.showNoDatasource = true
        return
      }
      this.loadClicked = !this.loadClicked
    },
    async onInputFileSelected () {
      this.onNewCriteriaClick()
      if (!this.searchCriteriaFile) {
        console.log('No File selected')
        return
      }
      let filename = this.searchCriteriaFile.name
      if (filename.lastIndexOf('.') <= 0) { // no fileextension
        console.log('no supported file')
      } else {
        let fileExtension = filename.split('.').pop()
        if (fileExtension !== 'json') {
          this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.NotSupportedFileFormat')
          this.loadClicked = false
          return
        }
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', e => {
        try {
          let tempSearchCriteria = JSON.parse(fileReader.result)
          if ((Array.isArray(tempSearchCriteria) && tempSearchCriteria[0].Resultlist) || (tempSearchCriteria.type === process.env.VUE_APP_RESULT_DETAILS_FILETYPE)) {
            this.errorMessage = this.$t('selectDescriptorView.fileUploadIncorrectFileType')
            this.loadClicked = false
            return
          }
          if (tempSearchCriteria && tempSearchCriteria.type) {
            // test datasource db_id db_version
            if (tempSearchCriteria.db_id && tempSearchCriteria.db_version) {
              // check if current datasource is same as in loaded file
              const currentDatasource = this.getDataSourceData
              if (!currentDatasource || currentDatasource.id !== tempSearchCriteria.db_id || currentDatasource.ds_version !== tempSearchCriteria.db_version) {
                this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectDatasource')
                this.loadClicked = false
                return
              }
            } else {
              this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectFileNoDatasourceVersion')
              this.loadClicked = false
              return
            }
            this.decrumbleSearchCriteriaFile(tempSearchCriteria)
            this.searchstring = tempSearchCriteria
          } else {
            if (tempSearchCriteria.type !== process.env.VUE_APP_SIMPLESEARCH_EXPORT_FILETYPE) {
              this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadWrongType') + this.$t('selectionToolbar.quickSearchText')
            }
            this.loadClicked = false
            return
          }
        } catch (error) {
          console.log('No upload for .json file possible: ', error)
          this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectFile')
        }
      })
      fileReader.readAsText(this.searchCriteriaFile)
      this.loadClicked = !this.loadClicked
      this.enabledGroup = []
      this.disableCheckbox = false
      this.disableSelectAsSearch = false
    },
    // Get all single groups of the tempSearchCriteria and add to list of Groups
    decrumbleSearchCriteriaFile (tempSearchCriteria) {
      // console.log('decrumbeSearchCriteriaFile', tempSearchCriteria)
      let startKey = 0
      const valueType = this.searchStringGroupItemTypeValues
      const arrayValueType = this.searchStringGroupItemTypeArrayValues
      const groupItemsType = this.searchStringGroupItemTypeGroupItems
      if (tempSearchCriteria && tempSearchCriteria.items) {
        let parentGroup = tempSearchCriteria.items
        let listOf = []
        let testDecrumble = recursiveDecrumble(parentGroup, listOf)
        if (testDecrumble || listOf.length > 0) {
          this.listOfGroups = listOf
          this.searchKey = startKey + 1
        }
      }
      function recursiveDecrumble (pGroup, listOf) {
        let filteredList = listOf.filter(pp => pp.groupKey === pGroup.groupKey)
        if (filteredList.length > 0) {
          // already in list
          return false
        }
        if (pGroup.groupKey > startKey) {
          startKey = pGroup.groupKey
        }
        // check type of groupValues
        if (pGroup.type === valueType) {
          listOf.push(pGroup)
          return false
        }
        if (pGroup.type === arrayValueType) {
          listOf.push(pGroup)
          return false
        }
        if (pGroup.type === groupItemsType) {
          listOf.push(pGroup)
          for (const gg of pGroup.groupValues) {
            recursiveDecrumble(gg, listOf)
          }
        }
        return true
      }
    },
    onOKExportButtonClick (value) {
      const filename = value
      if (this.searchstring.items) {
        // get datasource info
        let ds = this.getDataSourceData
        let licenseURI = ''
        let licenseText = ''
        let metadataInfo = null
        if (ds) {
          let masterInfo = this.$store.getters.getDBMasterMetadata(ds)
          if (masterInfo && masterInfo.metadata.length > 0) {
            metadataInfo = masterInfo.metadata[0]
            if (metadataInfo) {
              licenseURI = metadataInfo.LicenseURI
              licenseText = metadataInfo.LicenseText
            }
          }
        }
        this.searchstring.license = licenseText
        this.searchstring.licenseURI = licenseURI
        this.searchstring.db_id = ds ? ds.id : null
        this.searchstring.db_version = ds ? ds.ds_version : null
        const data = JSON.stringify(this.searchstring)
        const blob = new Blob([data], { type: 'text/plain' })
        const link = document.createElement('a')
        link.download = filename + '.json'
        link.href = window.URL.createObjectURL(blob)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
      this.exportDialog = false
    },
    onCancelExportButtonClick () {
      this.exportDialog = false
    },
    // Export/Save current searchcriteria as json File
    onExportCriteriaClick (value) {
      this.exportDialog = true
    },
    onErrorButtonOkClicked () {
      this.errorMessage = ''
    },
    onShowNoDatasourceOKClicked () {
      this.$store.dispatch('passNoDatasourceDialog', this.checkboxNoDatasourceInfo)
      this.showNoDatasource = false
    },
    async onAddToListOfGroups () {
      // listOfGroups: [], // {groupKey, operator, values, text} - values={selectedValues: [] || groupKey1, groupKey2,..}
      this.errorMessage = ''
      let currentSelected = null
      let currentOperator = ''
      let newSearchStringPart = ' '
      const deepClone = require('rfdc')()
      // only one item has been selected nothing else
      let selectedItems = this.$store.getters.getUserSearchString
      if (selectedItems && selectedItems.length === 1) { //  && this.opItemCheckbox === '') {
        // deep cloning! otherwise same descriptor/state pair with different values lead to same values
        currentSelected = deepClone(selectedItems[0])
        currentOperator = '' // no operator if single item selected
        // add text
        if (currentSelected.descType === this.selectionDescriptorType) {
          newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.csName + '<wbr>'
        }
        // if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 1 && currentSelected.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
        //   newSearchStringPart += '<em>' + currentSelected.descName + currentSelected.csName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
        // } else {
        //   if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 2) {
        //     newSearchStringPart += '<em>' + currentSelected.descName + currentSelected.csName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + ' , ' + currentSelected.descriptorStateUserInputs[2] + '<wbr>'
        //   }
        // }
        if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 1 && currentSelected.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
          newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
        } else {
          if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 2) {
            newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + ' , ' + currentSelected.descriptorStateUserInputs[2] + '<wbr>'
          }
        }
        if (currentSelected.descType === this.textDescriptorType) {
          newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
        }
        let groupValueArray = []
        groupValueArray.push(currentSelected)
        let groupItem = { groupKey: this.searchKey, operator: currentOperator, groupValues: groupValueArray, text: newSearchStringPart, type: this.searchStringGroupItemTypeValues }
        this.listOfGroups.push(groupItem)
        this.searchKey++
        newSearchStringPart = ' '
        this.disableCheckbox = false
        this.disableSelectAsSearch = false
      } else {
        if (!selectedItems || selectedItems.length === 0) {
          console.log('nothing selected')
          return
        }
        // more than one item has been selected and an operator -> combine is added automatically
        if (selectedItems.length > 1) {
          this.selectOperatorError = ''
          let groupOfGroups = []
          currentOperator = this.$store.getters.getUserSelectedOperator // this.logOperatorsGrouping
          if (!currentOperator || !Array.isArray(currentOperator) || !currentOperator.length === 2) {
            currentOperator = this.logOperatorsGrouping
          }
          let tempArray = []
          for (let i = 0; i < selectedItems.length; i++) {
            let filteredDescs = []
            // filter equal descriptors
            if (!tempArray.includes(selectedItems[i].CID)) {
              filteredDescs = deepClone(selectedItems.filter(d => d.CID === selectedItems[i].CID))
              tempArray.push(selectedItems[i].CID)
              let groupItems = []
              if (filteredDescs && filteredDescs.length === 1) {
                currentSelected = deepClone(filteredDescs[0])
                if (currentSelected.descType === this.selectionDescriptorType) {
                  newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.csName + '<wbr>'
                }
                if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 1 && currentSelected.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
                  newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
                } else {
                  if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 2) {
                    newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + ' , ' + currentSelected.descriptorStateUserInputs[2] + '<wbr>'
                  }
                }
                if (currentSelected.descType === this.textDescriptorType) {
                  newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
                }
                let groupValueArray = []
                groupValueArray.push(currentSelected)
                let groupItem = { groupKey: this.searchKey, operator: currentOperator, groupValues: groupValueArray, text: newSearchStringPart, type: this.searchStringGroupItemTypeValues }
                groupOfGroups.push(groupItem)
                this.searchKey++
                newSearchStringPart = ''
              } else {
                for (let d = 0; d < filteredDescs.length; d++) {
                  if (d === 0) {
                    newSearchStringPart += '<b style="background-color:#58ACFA"> ( </b>'
                  }
                  // deep cloning! otherwise same descriptor/state pair with different values lead to same values
                  currentSelected = deepClone(filteredDescs[d]) // deepClone(this.selectedItems[i])
                  // add text
                  if (filteredDescs.length > 1 && d >= 1) {
                    newSearchStringPart += '<b>' + currentOperator[1] + ' </b>'
                  }
                  if (currentSelected.descType === this.selectionDescriptorType) {
                    newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.csName + '<wbr>'
                  }
                  if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 1 && currentSelected.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
                    newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
                  } else {
                    if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 2) {
                      newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + ' , ' + currentSelected.descriptorStateUserInputs[2] + '<wbr>'
                    }
                  }
                  if (currentSelected.descType === this.textDescriptorType) {
                    newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
                  }
                  if (d === filteredDescs.length - 1) {
                    newSearchStringPart += '<b style="background-color:#58ACFA"> ) </b>'
                  }
                  let groupItem = { groupKey: this.searchKey, groupValues: currentSelected }
                  groupItems.push(groupItem)
                  this.searchKey++
                  newSearchStringPart += ' '
                }
                groupOfGroups.push({ groupKey: this.searchKey, operator: currentOperator[1], groupValues: groupItems, text: newSearchStringPart, type: this.searchStringGroupItemTypeArrayValues })
                this.searchKey++
                newSearchStringPart = ''
              }
            } else {
              continue
            }
          }
          if (groupOfGroups.length > 1) {
            let fir = true
            for (const gr of groupOfGroups) {
              if (gr) {
                if (fir) {
                  newSearchStringPart += '<b style="background-color:#F78181"> ( </b>'
                  fir = false
                } else {
                  newSearchStringPart += '<b> ' + currentOperator[0] + ' </b><br>'
                }
              }
              newSearchStringPart += gr.text
            }
            newSearchStringPart += '<b style="background-color:#F78181"> ) </b>'
            this.listOfGroups.push({ groupKey: this.searchKey, operator: currentOperator[0], groupValues: groupOfGroups, text: newSearchStringPart, type: this.searchStringGroupItemTypeGroupItems })
            this.searchKey++
            newSearchStringPart = ''
          } else {
            this.listOfGroups.push(groupOfGroups[0])
          }
        }
        this.disableCheckbox = false
        this.disableSelectAsSearch = false
      }
      // this.selectedItems = []
      // pass selectedItems to vuex store
      await this.$store.dispatch('passUserSelectedDescriptors', [])
      // await this.$store.dispatch('passOldUserSelectedDescriptors', [])
      this.opCheckbox = ''
      this.disableItemCheckbox = true
      this.enabledGroup = []
      this.selectedObjects = []
      // this.oldSelectedItems = []
    },
    onAddOperatorBetweenSelectedGroups () {
      this.errorMessage = ''
      let newSearchStringPart = ''
      const deepClone = require('rfdc')()
      // only and/or has been selected
      if (this.opCheckbox && this.opCheckbox !== '') {
        if (this.enabledGroup && this.enabledGroup.length > 0) {
          let newGroupItems = []
          for (const indexGroup of this.enabledGroup) {
            if (indexGroup) {
              if (newGroupItems.length > 0) {
                newSearchStringPart += '<b> ' + this.opCheckbox + ' </b><br>'
              } else {
                newSearchStringPart += '<b style="background-color:#F78181"> ( </b>'
              }
              let deepClonedIndexGroup = deepClone(indexGroup)
              newGroupItems.push(deepClonedIndexGroup)
              // add text
              newSearchStringPart += deepClonedIndexGroup.text
            }
          }
          if (newGroupItems.length > 1) {
            newSearchStringPart += '<b style="background-color:#F78181"> ) </b>'
            this.listOfGroups.push({ groupKey: this.searchKey, operator: this.opCheckbox, groupValues: newGroupItems, text: newSearchStringPart, type: this.searchStringGroupItemTypeGroupItems })
            this.searchKey++
            this.enabledGroup = []
          } else {
            console.log('select more than one group')
          }
        }
        this.opCheckbox = ''
        newSearchStringPart = ' '
        this.disableCheckbox = false
        this.disableSelectAsSearch = false
      } else {
        console.log('choose AND / OR for combination')
      }
    },
    onAddToSearchClick () {
      let count = 0
      let searchStr
      for (const enabledIndexGroup of this.enabledGroup) {
        if (enabledIndexGroup) {
          count++
          searchStr = { text: enabledIndexGroup.text, item: enabledIndexGroup }
        }
      }
      if (count === 0) {
        this.searchstring.text = ''
        this.searchstring.items = null
        return
      }
      if (count === 1) {
        this.searchstring.text = searchStr.text
        this.searchstring.items = searchStr.item
      } else {
        console.log('only one selection')
        this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.selectOneForSearch')
      }
    },
    onGroupItemCheckboxChanged () {
      console.log('onGroupItemCheckboxChaned')
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
