<template>
    <v-card v-if="datasourceId || apiErrored || noDatasource || indexError" :color="colortheme.color" class="pa-0 ma-0" flat tile>
        <template v-if="apiErrored">
            <v-card-text>{{ $t('selectDescriptorAdvancedSearchView.apiErrorText') }}</v-card-text>
          </template>
          <template v-if="noDatasource">
            <v-card-text>{{ $t('selectDescriptorSearchView.noDatasource') }}</v-card-text>
          </template>
          <v-card class="ml-4 mb-4" v-if="errorMessage !=='' " color="red darken-2" flat>
            <v-card-title class="subtitle-2">{{ $t('selectDescriptorAdvancedSearchView.errorTitle') }}</v-card-title>
            <v-card-subtitle>
              {{errorMessage}}
              <v-btn variant="outlined" small class="ml-4" @click="onErrorButtonOkClicked()">{{ $t('selectDescriptorAdvancedSearchView.errorButtonOK') }}</v-btn>
            </v-card-subtitle>
          </v-card>
          <v-dialog hide-overlay v-model="indexError" persistent>
            <v-card :color="colortheme.color">
              <v-card-title class="subtitle-2 pb-0 pl-2 ml-2"><v-icon :color="colortheme.colortext">mdi-information-outline</v-icon>{{ $t('general.infoText') }}</v-card-title>
              <v-card-text>{{ $t('selectDescriptorAdvancedSearchView.indexedDBErrorText') }}</v-card-text>
              <v-card-actions>
                <v-btn variant="outlined" rounded text :color="colortheme.colortext" @click="onOKNoCacheModeClick()">{{ $t('selectDescriptorSearchView.cardTextOKBtn') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <selection-toolbar v-on:onLoadCriteriaClick="onLoadCriteriaClick($event)" v-on:onExportCriteriaClick="onExportCriteriaClick()" v-on:onNewCriteriaClick="onListDeleteAllClick($event)"/>
        <v-card :color="colortheme.color" class="pl-0" v-if="showDescriptorSearch && !apiLoading" flat tile>
          <v-card-text class="pt-2" :color="colortheme.colordarken">
            <v-row no-gutters>
            <v-col cols="12">
            <v-autocomplete v-if="!isMobile" class="pt-2" :color="colortheme.colortext" clearable open-on-clear loader-height="30" :menu-props="{ maxHeight:600 }"
            prepend-icon="mdi-database-search" v-model="selectedObjects" :type="switchtype"
            :items="descriptorItems" :item-title="item => item.name" item-value="id" :item-color="colortheme.colortext" hint="Search" flat return-object :no-data-text="$t('selectDescriptorSearchView.noDescriptorsText')"
            @change="onSelectionChange($event)" :placeholder="$t('selectDescriptorSearchView.cardTitle')" :aria-labelledby="$t('selectDescriptorSearchView.selecteDescriptorPlaceHolder')">
            <template v-slot:item="{ props, data }">
              <v-row justify="center">
                <v-col cols="12">
                  <v-list >
                  <v-divider></v-divider>
                  <v-list-item v-bind="props">
                    <v-list-item icon class="pt-4" v-if="descriptorImagesAvailable && data.raw.ImageToShow">
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
            <v-autocomplete class="pt-2"  v-if="isMobile" :color="colortheme.colortext" clearable open-on-clear loader-height="30" :menu-props="{ maxHeight:400 }"
            prepend-icon="mdi-database-search" v-model="selectedObjects" :type="switchtype"
            :items="descriptorItems" :item-title="item => item.name" item-value="id" :item-color="colortheme.colortext" hint="Search" flat return-object :no-data-text="$t('selectDescriptorSearchView.noDescriptorsText')"
            @change="onSelectionChange($event)" :placeholder="$t('selectDescriptorSearchView.cardTitle')" :aria-labelledby="$t('selectDescriptorSearchView.selecteDescriptorPlaceHolder')">
            <template v-slot:item="{ props, item }">
              <v-row justify="center">
                <v-col cols="12">
                  <v-list >
                  <v-divider></v-divider>
                  <v-list-item v-bind="props" class="pl-0">
                    <v-list-item icon class="pt-2" v-if="descriptorImagesAvailable && item.raw.ImageToShow">
                    <v-tooltip top content-class="custom-tooltip" >
                    <template v-slot:activator>
                      <!-- <v-list-item-icon v-on="on" size="60" tile left> -->
                            <v-img max-height="100" contain max-width="100" :src="item.raw.ImageToShow" class="ml-2 mr-n4"/>
                          <!-- </v-list-item-icon> -->
                    </template>
                    <span> <img class="custom-img" :src="item.raw.ImageToShow"/> </span>
                  </v-tooltip>
                  </v-list-item>
                  <!-- <v-list-item-content> -->
                    <v-list-item-title class="wrap-text">
                        {{ item.raw.name }}
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
          </v-card-text>
        </v-card>
      <item-name-search v-if="!showDescriptorSearch"></item-name-search>
      <v-dialog v-model="exportDialog" @click:outside="onCancelExportButtonClick()">
        <export-dialog-form v-on:onOKExportButtonClick="onOKExportButtonClick($event)" v-on:onCancelExportButtonClick="onCancelExportButtonClick()" />
      </v-dialog>
      <v-dialog v-model="loadClicked">
        <v-card :color="colortheme.color">
        <v-card-title>{{ $t('selectDescriptorAdvancedSearchView.importDialogCriteriaTitle') }}</v-card-title>
        <v-file-input @change="onInputFileSelected" v-model="searchCriteriaFile" accept=".json" :label="$t('selectDescriptorAdvancedSearchView.loadSearchCriteriaLabel')"></v-file-input>
        </v-card>
      </v-dialog>
      <v-dialog data-app v-model="show" persistent>
        <select-descriptor-states-dialog v-on:onOKSelectionClickEvent="onOKSelectionClick()" v-on:onCancelSelectionClick="onCancelSelectionClick()"></select-descriptor-states-dialog>
      </v-dialog>
      <v-btn block class="ml-0" large variant="text" v-if="!isMobile" to="/navikey-resultlist" :color="colortheme.colortext" outlined>
      <span>{{ $t('naviToolbar.matches') }} {{numberOfMatches}}</span>
    </v-btn>
    </v-card>
</template>
<script>
import UserSelectionView from '../components/UserSelectionView'
import filterMethods from '../mixins/filteringMethods'
import groupingAndSorting from '../mixins/groupingAndSortingMethods'
import SelectionToolbar from '../components/SelectionToolbar'
import ItemNameSearch from './ItemNameSearch.vue'
import ExportDialogForm from './ExportDialogForm.vue'
import SelectDescriptorStatesDialog from './SelectDescriptorStatesDialog.vue'

export default {
  name: 'SelectDescriptorSearchView',
  mixins: [filterMethods, groupingAndSorting],
  components: {
    'user-selection-view': UserSelectionView,
    'selection-toolbar': SelectionToolbar,
    'item-name-search': ItemNameSearch,
    'export-dialog-form': ExportDialogForm,
    'select-descriptor-states-dialog': SelectDescriptorStatesDialog
  },
  data: () => ({
    errorMessage: '',
    selectedObjects: null,
    selectedDescriptor: null,
    show: false,
    filterselect: 'Inverted',
    logOperators: ['AND', 'OR'],
    firstcall: true,
    firstcallEach: true,
    listenerAddedToWorker: false,
    showIndexedDBError: true,
    editMode: false,
    exportDialog: false,
    loadClicked: false,
    loadMode: false,
    searchCriteriaFile: [],
    descriptorImagesAvailable: false,
    searchStringGroupItemTypeValues: 'values',
    searchStringGroupItemTypeArrayValues: 'arrayOfValues',
    searchStringGroupItemTypeGroupItems: 'arrayOfSearchStrGroupItems',
    selectionDescriptorType: process.env.VUE_APP_ENUMERATION_DESCRIPTOR,
    numberDescriptorType: process.env.VUE_APP_NUMBER_DESCRIPTOR,
    textDescriptorType: process.env.VUE_APP_TEXT_DESCRIPTOR,
    appVersion: process.env.VUE_APP_VERSION
  }),
  computed: {
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    switchtype () {
      return this.$store.getters.getSwitchType
    },
    isMobile () {
      return this.$vuetify.display.xsOnly
    },
    numberOfMatches () {
      const isDescriptorMode = this.showDescriptorSearch
      return this.$store.getters.getNumberOfMatches(isDescriptorMode)
    },
    showDescriptorSearch () {
      return this.$store.getters.isCurrentSearchDescriptorMode // getSimpleSearchDescriptorMode
    },
    restrictFilterMode () {
      return this.$store.getters.getUseRestrictFilter
    },
    isANDDescriptorGroupMode () {
      if (this.logOperators && this.logOperators.length > 0 && this.logOperators[0] === 'AND') {
        this.$store.dispatch('passRestrictFilterPossible', true)
        return true
      } else {
        this.$store.dispatch('passRestrictFilterPossible', false)
        return false
      }
    },
    descriptorItems () {
      console.log('here we are')
      let descriptors = null
      if (this.restrictFilterMode && this.isANDDescriptorGroupMode) {
        descriptors = this.$store.getters.mappedConstraintDescriptors
      } else {
        descriptors = this.$store.getters.mappedDescriptors // id, name, type
      }
      let selectedItems = this.$store.getters.getUserSearchString
      if (selectedItems && selectedItems.length > 0) {
        descriptors = descriptors.filter(updatedDescriptors => !selectedItems.find(second => second.CID === updatedDescriptors.id))
      }
      if (descriptors) {
        const sortSetting = this.$store.getters.getSortSettings
        descriptors.sort(this.compareValuesForSorting(sortSetting.descriptors.key1, sortSetting.descriptors.key2, sortSetting.descriptors.order1, sortSetting.descriptors.order2)) // compareValuesForSorting (key1, key2, order1, order2)
        // set images if available and user has not deactivated
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
      // init filtermethod
      let categoricals = this.$store.getters.mappedDescStateItems
      let quantiative = this.$store.getters.mappedNumericalDescStateItems
      let text = this.$store.getters.mappedTextDescStateItems
      this.initInvertedFilters(categoricals, quantiative, text)
      return descriptors
    },
    datasourceId () {
      this.onDataSourceChangedEvent()
      return this.$store.getters.getCurrentDatasourceID
    },
    apiLoading () {
      return this.$store.getters.getApiLoading
    },
    apiErrored () {
      return this.$store.getters.getApiErrored
    },
    indexError () {
      return (this.showIndexedDBError && this.$store.getters.getIndexedDBError)
    },
    noDatasource () {
      let dsData = this.$store.getters.getDataSourceData
      if (dsData) {
        return false
      }
      return true
    }
  },
  methods: {
    async onDataSourceChangedEvent () {
      this.errorMessage = ''
      this.selectedObjects = []
      this.selectedDescriptor = null
      await this.$store.dispatch('passCurrentUserSelectedDescriptor', null)
      await this.$store.dispatch('passUserSelectedDescriptors', [])
      // await this.$store.dispatch('passOldUserSelectedDescriptors', [])
    },
    onOKNoCacheModeClick () {
      this.showIndexedDBError = false
    },
    onActivateSearchClick () {
      if (this.$store.getters.getSwitchType === 'button') {
        this.$store.dispatch('passSwitchType', 'text')
      } else {
        this.$store.dispatch('passSwitchType', 'button')
      }
    },
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
    async onOKSelectionClick () {
      this.show = false
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.selectionDescriptorType) {
        let itemNameMap = null
        let negCategoricalToleranceMode = this.$store.getters.getIsCategoricalToleranceMode
        let posCategoricalToleranceMode = this.$store.getters.getIsPositiveCategoricalToleranceMode
        negCategoricalToleranceMode || posCategoricalToleranceMode ? itemNameMap = this.$store.getters.getItemIDNameMap : itemNameMap = null
        this.initToleranceModes(negCategoricalToleranceMode, posCategoricalToleranceMode)
        this.initNameMap(itemNameMap)
      }
      if (this.selectedDescriptor && this.selectedDescriptor.type === this.numberDescriptorType) {
        let includeExtremeValues = this.$store.getters.getNumFilterIncludeExtremeValues
        this.initNumFilterIncludeExtremeValues(includeExtremeValues)
      }
      let logO = this.logOperators
      let fil = this.filterselect
      if (this.editMode || this.loadMode) {
        // newSelected = []
        this.editMode = false
        this.$store.dispatch('passRestrictFilterPossible', true)
        this.loadMode = false
      }
      // pass null -> delete request
      await this.$store.dispatch('passNewUserSelectedDescriptorState', null)
      let filteredItems = []
      // get old selected items from vuex store
      let resetResult = true
      let userSelectedValue = this.$store.getters.getUserSearchString
      if (userSelectedValue && userSelectedValue.length > 0) {
        resetResult = false
        // console.log('userSelectedValues', userSelectedValue)
        filteredItems = this.getFilteredItems(fil, logO, userSelectedValue)
      }
      // pass all items after filtering to vuex
      this.$store.dispatch('passSelectedItems', { 'filteredItems': filteredItems, 'resetResult': resetResult })
      this.$store.dispatch('passIsCurrentModeDesriptorMode', true)
      // this.isSearching = false
      this.selectedDescriptor = null
      this.$store.dispatch('passCurrentUserSelectedDescriptor', this.selectedDescriptor)
      this.selectedObjects = []
      // this.userInputs = { comparator: '=', firstInput: null, secondInput: null }
    },
    onCancelSelectionClick () {
      this.show = false
      this.selectedDescriptor = null
      this.$store.dispatch('passCurrentUserSelectedDescriptor', this.selectedDescriptor)
      this.selectedObjects = []
    },
    async onLogOperatorButtonClick (value) {
      if (this.logOperators[0] === value[0] && this.logOperators[1] === value[1]) {
        return
      }
      this.logOperators = value
      await this.$store.dispatch('passNewUserSelectedDescriptorState', null)
      let userSelectedDescripors = this.$store.getters.getUserSearchString // this.selectedItems
      // await this.$store.dispatch('passUserSelectedOperator', this.logOperators)
      // if operator changed -> initiate new filtering
      let filteredItems
      // get old selected items from vuex store
      let logO = this.logOperators
      let fil = this.filterselect
      let resetResult = true
      if (userSelectedDescripors && userSelectedDescripors.length > 0) {
        // init if tolerance mode is true
        let itemNameMap = null
        let negCategoricalToleranceMode = this.$store.getters.getIsCategoricalToleranceMode
        let posCategoricalToleranceMode = this.$store.getters.getIsPositiveCategoricalToleranceMode
        negCategoricalToleranceMode || posCategoricalToleranceMode ? itemNameMap = this.$store.getters.getItemIDNameMap : itemNameMap = null
        this.initToleranceModes(negCategoricalToleranceMode, posCategoricalToleranceMode)
        this.initNameMap(itemNameMap)
        let includeExtremeValues = this.$store.getters.getNumFilterIncludeExtremeValues
        this.initNumFilterIncludeExtremeValues(includeExtremeValues)
        filteredItems = this.getFilteredItems(fil, logO, userSelectedDescripors)
        resetResult = false
      }
      // pass new items to store
      this.$store.dispatch('passSelectedItems', { 'filteredItems': filteredItems, 'resetResult': resetResult })
      this.$store.dispatch('passIsCurrentModeDesriptorMode', true)
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
            this.editMode = true
            this.$store.dispatch('passRestrictFilterPossible', false)
            this.onSelectionChange(editDescriptor)
          }
        }
      }
    },
    async onListDeleteAllClick () {
      this.errorMessage = ''
      await this.$store.dispatch('passUserSelectedDescriptors', [])
      // await this.$store.dispatch('passOldUserSelectedDescriptors', [])
      this.onOKSelectionClick()
    },
    onOKExportButtonClick (value) {
      const filename = value
      let selectedItems = this.$store.getters.getUserSearchString
      if (selectedItems && selectedItems.length > 0) {
        // get datasource info
        let ds = this.$store.getters.getDataSourceData
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
        let searchstring = { text: '', type: process.env.VUE_APP_SIMPLESEARCH_EXPORT_FILETYPE, version: this.appVersion, db_id: null, db_version: null, license: licenseText, licenseURI: licenseURI, items: null }
        searchstring.db_id = ds ? ds.id : null
        searchstring.db_version = ds ? ds.ds_version : null
        searchstring.items = this.onAddToListOfGroups() // this.selectedItems
        searchstring.text = searchstring.items.text
        searchstring.logOperators = this.logOperators
        const data = JSON.stringify(searchstring)
        const blob = new Blob([data], { type: 'text/plain' })
        const link = document.createElement('a')
        link.download = filename + '.json'
        link.href = window.URL.createObjectURL(blob)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
      this.exportDialog = false
    },
    onAddToListOfGroups () {
      this.errorMessage = ''
      let currentSelected = null
      let currentOperator = ''
      let newSearchStringPart = ' '
      let listOfGroups = []
      let searchKey = 1
      const deepClone = require('rfdc')()
      let selectedItems = this.$store.getters.getUserSearchString
      // only one item has been selected nothing else
      if (selectedItems && selectedItems.length === 1) {
        // deep cloning!
        currentSelected = deepClone(selectedItems[0])
        currentOperator = '' // no operator if single item selected.
        // add text
        if (currentSelected.descType === this.selectionDescriptorType) {
          newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.csName + '<wbr>'
        }
        if (currentSelected && currentSelected.descType === this.numberDescriptorType) {
          // add all states to searchstring for extended search
          if (currentSelected.descriptorStateUserInputs.length > 1 && currentSelected.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
            newSearchStringPart += '<em>' + currentSelected.descName + currentSelected.csName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
          } else {
            if (currentSelected.descriptorStateUserInputs.length > 2) {
              newSearchStringPart += '<em>' + currentSelected.descName + currentSelected.csName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + ' , ' + currentSelected.descriptorStateUserInputs[2] + '<wbr>'
            }
          }
        }
        if (currentSelected.descType === this.textDescriptorType) {
          newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
        }
        let groupValueArray = []
        groupValueArray.push(currentSelected)
        let groupItem = { groupKey: searchKey, operator: currentOperator, groupValues: groupValueArray, text: newSearchStringPart, type: this.searchStringGroupItemTypeValues }
        listOfGroups.push(groupItem)
        searchKey++
        newSearchStringPart = ' '
      } else {
        if (!selectedItems || selectedItems.length === 0) {
          console.log('nothing selected')
          return
        }
        // more than one item has been selected and an operator -> combine is added automatically
        if (selectedItems.length > 1) {
          let groupOfGroups = []
          currentOperator = this.logOperators
          let tempArray = []
          for (let i = 0; i < selectedItems.length; i++) {
            let filteredDescs = []
            // filter equal descriptors
            if (!tempArray.includes(selectedItems[i].CID)) {
              filteredDescs = deepClone(selectedItems.filter(d => d.CID === selectedItems[i].CID))
              tempArray.push(selectedItems[i].CID)
              let groupItems = []
              for (let d = 0; d < filteredDescs.length; d++) {
                if (d === 0) {
                  newSearchStringPart += '<b style="background-color:#58ACFA"> ( </b>'
                }
                // deep cloning!
                currentSelected = deepClone(filteredDescs[d])
                // add text
                if (filteredDescs.length > 1 && d >= 1) {
                  newSearchStringPart += '<b>' + currentOperator[1] + ' </b>'
                }
                if (currentSelected.descType === this.selectionDescriptorType) {
                  newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.csName + '<wbr>'
                }
                if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 1 && currentSelected.descriptorStateUserInputs[0] !== this.comparatorTextBetween) {
                  newSearchStringPart += '<em>' + currentSelected.descName + currentSelected.csName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
                } else {
                  if (currentSelected && currentSelected.descType === this.numberDescriptorType && currentSelected.descriptorStateUserInputs.length > 2) {
                    newSearchStringPart += '<em>' + currentSelected.descName + currentSelected.csName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + ' , ' + currentSelected.descriptorStateUserInputs[2] + '<wbr>'
                  }
                }
                if (currentSelected.descType === this.textDescriptorType) {
                  newSearchStringPart += '<em>' + currentSelected.descName + '</em><b>' + currentSelected.descriptorStateUserInputs[0] + '</b> ' + currentSelected.descriptorStateUserInputs[1] + '<wbr>'
                }
                if (d === filteredDescs.length - 1) {
                  newSearchStringPart += '<b style="background-color:#58ACFA"> ) </b>'
                }
                let groupItem = { groupKey: searchKey, groupValues: currentSelected }
                groupItems.push(groupItem)
                searchKey++
                newSearchStringPart += ' '
              }
              groupOfGroups.push({ groupKey: searchKey, operator: currentOperator[1], groupValues: groupItems, text: newSearchStringPart, type: this.searchStringGroupItemTypeArrayValues })
              searchKey++
              newSearchStringPart = ''
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
            listOfGroups.push({ groupKey: searchKey, operator: currentOperator[0], groupValues: groupOfGroups, text: newSearchStringPart, type: this.searchStringGroupItemTypeGroupItems })
            searchKey++
            newSearchStringPart = ''
          } else {
            listOfGroups.push(groupOfGroups[0])
          }
        }
      }
      return listOfGroups[0]
    },
    onCancelExportButtonClick () {
      this.exportDialog = false
    },
    // Export/Save current searchcriteria as json File
    onExportCriteriaClick (value) {
      this.exportDialog = true
    },
    onLoadCriteriaClick (value) {
      if (this.noDatasource && !this.checkboxNoDatasourceInfo) {
        this.showNoDatasource = true
        return
      }
      this.loadClicked = !this.loadClicked
    },
    async onInputFileSelected () {
      this.onListDeleteAllClick()
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
      let selectedItems = []
      fileReader.addEventListener('load', e => {
        try {
          let tempSearchCriteria = JSON.parse(fileReader.result)
          if ((Array.isArray(tempSearchCriteria) && tempSearchCriteria[0].Resultlist) || (tempSearchCriteria.type === process.env.VUE_APP_RESULT_DETAILS_FILETYPE)) {
            this.errorMessage = this.$t('selectDescriptorView.fileUploadIncorrectFileType')
            this.loadClicked = false
            return
          }
          if (tempSearchCriteria && tempSearchCriteria.type && tempSearchCriteria.type === process.env.VUE_APP_SIMPLESEARCH_EXPORT_FILETYPE) {
            // test datasource db_id db_version
            if (tempSearchCriteria.db_id && tempSearchCriteria.db_version) {
              // check if current datasource is same as in loaded file
              const currentDatasource = this.$store.getters.getDataSourceData
              if (!currentDatasource || currentDatasource.id !== tempSearchCriteria.db_id || currentDatasource.ds_version !== tempSearchCriteria.db_version) {
                this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectDatasource')
                this.loadClicked = false
                return
              }
            } else {
              console.log('should not happen with new exported files')
              this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectFileNoDatasourceVersion')
              this.loadClicked = false
              return
            }
            let tempCriteria = tempSearchCriteria.items
            // console.log('tempCriteria', tempCriteria)
            if (tempCriteria.type === this.searchStringGroupItemTypeValues) {
              selectedItems.push(tempCriteria.groupValues[0])
            }
            if (tempCriteria.type === this.searchStringGroupItemTypeArrayValues) {
              for (let ind = 0; ind < tempCriteria.groupValues.length; ind++) {
                selectedItems.push(tempCriteria.groupValues[ind].groupValues)
              }
            }
            if (tempCriteria.type === this.searchStringGroupItemTypeGroupItems) {
              for (let rec of tempCriteria.groupValues) {
                if (rec.type === this.searchStringGroupItemTypeValues) {
                  selectedItems = rec.groupValues[0]
                }
                if (rec.type === this.searchStringGroupItemTypeArrayValues) {
                  for (let ind = 0; ind < rec.groupValues.length; ind++) {
                    selectedItems.push(rec.groupValues[ind].groupValues)
                  }
                }
              }
            }
            this.logOperators = tempSearchCriteria.logOperators
            this.loadMode = true
            this.$store.dispatch('passUserSelectedDescriptors', selectedItems)
            // this.$store.dispatch('passOldUserSelectedDescriptors', selectedItems)
            this.onOKSelectionClick()
          } else {
            // this.errorMessage = this.incorrectJsonData
            if (tempSearchCriteria.type !== process.env.VUE_APP_SIMPLESEARCH_EXPORT_FILETYPE) {
              this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadWrongType') + this.$t('selectionToolbar.extendedSearchText')
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
    },
    onErrorButtonOkClicked () {
      this.errorMessage = ''
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
