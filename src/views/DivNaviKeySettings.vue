<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" flat tile>
    <v-card-title><v-btn icon to="/" :color="colortheme.colortext"><v-icon>mdi-arrow-left</v-icon></v-btn>{{ $t('settings.Title') }}</v-card-title>
    <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.data')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
      <template v-if="apiLoading">
      <v-dialog data-app v-model="apiLoading" persistent>
        <loading-datasource-card v-on:onCancelLoadingClick="onCancelLoadingClick()"></loading-datasource-card>
      </v-dialog>
    </template>
    <v-card-text class="pt-4 pb-2 mb-0 mt-0">
        {{ $t('settings.projectName') }}: {{currentDatasource.project}}
    </v-card-text>
    <v-card-text class="pt-0 pb-0 mb-2 mt-0">
        {{ $t('settings.projectLanguage') }}: {{currentDatasource.lang}}
    </v-card-text>
         <v-checkbox dense class="shrink ml-4 mt-0 pt-0" disabled :color="colortheme.colortext" v-model="checkboxSynchronizeDatasourceLang">
        <template v-slot:label>
          <v-card-text :color="colortheme.colortext">{{ $t('datasourceSelectComponent.schemeAutoText') }}</v-card-text>
        </template>
        </v-checkbox>
      <v-btn class="ml-4 mt-0 pt-0" :color="colortheme.color" @click="onDatabaseChangeClick()">
            <v-icon>mdi-database-cog-outline</v-icon>
            {{ $t('settings.changeDatasource') }}
          </v-btn>
    <v-dialog data-app v-model="showDatasourceSelectComponent">
        <data-source-select-component v-on:onDatasourceSet="onDatasourceSetEvent()" v-on:onCancel="onCancelDatasourceSelect()" class="pt-4 pl-2"/>
      </v-dialog>
      <v-card-text>
        <v-card-title class="subtitle-2 pb-0 pl-0 ml-0" :color="colortheme.color">{{ $t('settings.images')}}</v-card-title>
      <v-checkbox class="ml-0 mb-0 pb-0" :color="colortheme.colortext" v-model="showDescriptorStateImagesIfAvailable" :label="$t('settings.showDescriptorStateImagesIfAvailable')" @change="onShowDescriptorStateImagesIfAvailable">
    </v-checkbox>
    <v-checkbox class="ml-0 mt-0 pt-0" :color="colortheme.colortext" v-model="showItemImagesIfAvailable" :label="$t('settings.showItemImagesIfAvailable')" @change="onShowItemImagesIfAvailable">
    </v-checkbox>
        <v-radio-group v-model="loadSelect" :label="labelDataLoad" dense @change="onLoadModeChanged()">
              <v-radio :color="colortheme.colortext" v-for="(childItem) in loadModes" :key="childItem.key" :label="$t(childItem.loadingText)" :value="childItem.key"></v-radio>
            </v-radio-group>
      </v-card-text>
        <v-divider></v-divider>
    <v-card-subtitle class="ml-0 ml-0" :color="colortheme.color">{{ $t('settings.saveItemDetailsOffline')}}</v-card-subtitle>
            <v-card-text class="ml-0 l-0" :color="colortheme.color">{{ $t('settings.saveItemDetailsShortInfoText')}}</v-card-text>
            <v-btn class="ml-4 mt-0 pt-0" :color="colortheme.color" @click="onSaveItemDetailsToCacheClick()">
            <v-icon>mdi-download</v-icon>
            {{ $t('settings.saveDetailedInfoButton') }}
          </v-btn>
       </v-expansion-panel-content>
       <v-dialog v-model="saveToCacheDialog" persistent>
        <v-card :color="colortheme.color">
        <v-card-title>{{ $t('settings.saveItemDetailsOffline') }}</v-card-title>
        <v-card-text>
          {{ $t('settings.saveItemDetailsInfoText') }}
          <v-btn :color="colortheme.color" :disabled="disableSaveToCacheOKButton" @click="onOKSaveToCacheButtonClick()">{{ $t('settings.okExportButton' )}}</v-btn>
          <v-btn :color="colortheme.color" :disabled="disableSaveToCacheOKButton" @click="onCancelSaveToCacheButtonClick()">{{ $t('settings.cancelExportButton') }}</v-btn>
        </v-card-text>
      </v-card>
      </v-dialog>
      </v-expansion-panel>
    </v-expansion-panels>
      <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.TitleTest') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
    <v-card class="ml-4 mb-4" v-if="errorMessage !=='' " color="red darken-2" flat>
      <v-card-title class="subtitle-2">{{ $t('selectDescriptorAdvancedSearchView.errorTitle') }}</v-card-title>
      <v-card-subtitle>
        {{errorMessage}}
        <v-btn outlined small class="ml-4" @click="onErrorButtonOkClicked()">{{ $t('selectDescriptorAdvancedSearchView.errorButtonOK') }}</v-btn>
      </v-card-subtitle>
      </v-card>
     <v-card-text>
        <v-card-text>
          {{ $t('settings.updateInfoText')}}
        </v-card-text>
        <v-btn class="ml-4" :color="colortheme.color" @click="onUpdateApp($event)">
        <v-icon>mdi-refresh</v-icon>
        {{ $t('settings.updateApp') }}
        </v-btn>
        </v-card-text>
        <v-card-text>
        <v-card-text>
          {{ $t('settings.resetInfoText')}}
        </v-card-text>
          <v-btn class="ml-4" :color="colortheme.color" @click="onConfirmResetIndexedDB($event)">
        <v-icon>mdi-database-refresh</v-icon>
        {{ $t('settings.resetIDBBtn') }}
        </v-btn>
        </v-card-text>
       <v-dialog v-model="updateDialog" persistent>
        <v-card :color="colortheme.color">
        <v-card-title>{{ $t('settings.updateApp') }}</v-card-title>
        <v-card-text>
          {{ $t('settings.updateInfoText') }}
          <v-btn text @click="onOKUpdateButtonClick()">{{ $t('settings.okExportButton' )}}</v-btn>
          <v-btn text @click="onCancelUpdateButtonClick()">{{ $t('settings.cancelExportButton') }}</v-btn>
        </v-card-text>
      </v-card>
      </v-dialog>
      <v-dialog v-model="resetDialog" persistent>
        <v-card :color="colortheme.color">
        <v-card-title>{{ $t('settings.resetDialogTitle') }}</v-card-title>
        <v-card-text>
          {{resetInfo}}
          <v-btn v-if="!resetConfirm" text @click="onOKResetButtonClick()">{{ $t('settings.okExportButton' )}}</v-btn>
          <v-btn v-if="!resetConfirm" text @click="onCancelResetButtonClick()">{{ $t('settings.cancelExportButton') }}</v-btn>
        </v-card-text>
      </v-card>
      </v-dialog>
      </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.SearchTitle')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
      <v-card-text>
         <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxPositiveCategoricalTolerance" :label="$t('settings.categoricalPositiveToleranceSettingText')" @change="onCheckboxPositiveToleranceChanged">
        </v-checkbox>
        <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxCategoricalTolerance" :label="$t('settings.categoricalToleranceSettingText')" @change="onCheckboxToleranceChanged">
        </v-checkbox>
         <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxNumericalFilterInclExtremeValues" :label="$t('settings.numericalFilterIncludeExtremeValuesSettingText')" @change="onCheckboxNumericalFilterIncludeExtremeValuesChanged">
        </v-checkbox>
        <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="useRestrictFilter" :label="$t('settings.useRestrictFilterSettingText')" @change="onUseRestrictFilterChanged">
        </v-checkbox>
      </v-card-text>
          </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
          {{ $t('settings.SortTitle')}}
        </v-expansion-panel-header>
        <v-expansion-panel-content :color="colortheme.greyText">
          <v-expansion-panels flat tile :value="0" focusable>
            <v-expansion-panel>
              <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
                {{ $t('settings.sortDescriptorText')}}
              </v-expansion-panel-header>
              <v-expansion-panel-content :color="colortheme.greyText">
                <v-card-text>
                  <v-row no-gutters class="mt-0 ml-2">
                    <v-col cols="6" sm="4" md="2">
                  <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingDescriptorKeys" style="max-width: 200px"
                    v-model="sortSettings.descriptors.key1" @change="onSortDescriptorKey1Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectKey1') }}
                    </template>
                    </v-select>
                    </v-col>
                    <v-col class="ml-2">
                    <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingOrders" style="max-width: 200px"
                    v-model="sortSettings.descriptors.order1" @change="onSortDescriptorOrder1Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectOrder1') }}
                    </template>
                    </v-select>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-0 ml-2">
                    <v-col cols="6" sm="4" md="2">
                    <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingDescriptorKeys" style="max-width: 200px"
                    v-model="sortSettings.descriptors.key2" @change="onSortDescriptorKey2Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectKey2') }}
                    </template>
                    </v-select>
                    </v-col>
                    <v-col class="ml-2">
                    <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingOrders" style="max-width: 200px"
                    v-model="sortSettings.descriptors.order2" @change="onSortDescriptorOrder2Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectOrder2') }}
                    </template>
                    </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels flat tile :value="0" focusable>
            <v-expansion-panel>
              <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
                {{ $t('settings.sortStateText')}}
              </v-expansion-panel-header>
              <v-expansion-panel-content :color="colortheme.greyText">
                <v-card-text>
                  <v-row no-gutters class="mt-0 ml-2">
                    <v-col cols="6" sm="4" md="2">
                  <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingStateKeys" style="max-width: 200px"
                    v-model="sortSettings.states.key1" @change="onSortStateKey1Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectKey1') }}
                    </template>
                    </v-select>
                    </v-col>
                    <v-col class="ml-2">
                    <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingOrders" style="max-width: 200px"
                    v-model="sortSettings.states.order1" @change="onSortStateOrder1Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectOrder1') }}
                    </template>
                    </v-select>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="mt-0 ml-2">
                    <v-col cols="6" sm="4" md="2">
                    <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingStateKeys" style="max-width: 200px"
                    v-model="sortSettings.states.key2" @change="onSortStateKey2Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectKey2') }}
                    </template>
                    </v-select>
                    </v-col>
                    <v-col class="ml-2">
                    <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="sortSettingOrders" style="max-width: 200px"
                    v-model="sortSettings.states.order2" @change="onSortStateOrder2Change">
                    <template v-slot:label>
                      {{  $t('settings.sortSelectOrder2') }}
                    </template>
                    </v-select>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.ResultTitle')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
      <v-card-text>
          <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="showPerPage" style="max-width: 300px"
          v-model="perPageModel">
          <template v-slot:label>
            {{  $t('settings.resultPerPageText') }}
          </template>
          </v-select>
      </v-card-text>
      <v-card-text>
            <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxShowTaxonInfo" :label="$t('settings.showTaxonInfo')" @change="onCheckboxShowTaxonInfo">
            </v-checkbox>
            <v-checkbox class="ml-2" :color="colortheme.colortext" v-model="checkboxShowTaxonSinAuthor" :label="$t('settings.showTaxonSinAuthorIfAvailable')" @change="onCheckboxShowTaxonSinAuthor">
            </v-checkbox>
          </v-card-text>
          </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
     <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.general')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
               <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.selectColorTheme') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
      <v-card-text>
        <v-radio-group v-model="colorThemeSelect" dense @change="onColorThemeChanged()">
              <v-radio :color="colortheme.colortext" v-for="(childItem) in colorThemeSettings" :key="childItem.key" :label="$t(childItem.colorlabel)" :value="childItem.key"></v-radio>
            </v-radio-group>
      </v-card-text>
          </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
           <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.selectLanguage') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
      <v-card-text>
        <v-radio-group v-model="languageSelect" dense @change="onLanguageChanged()">
              <v-radio :color="colortheme.colortext" v-for="(childItem) in languages" :key="childItem.key" :label="$t(childItem.languageText)" :value="childItem.key"></v-radio>
            </v-radio-group>
      </v-card-text>
          </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
              <v-expansion-panels flat tile :value="0" focusable>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.selectSelectType')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
      <v-card-text>
        <v-radio-group v-model="autocompleteTypeSelect" dense @change="onautocompleteTypeChanged()">
              <v-radio :color="colortheme.colortext" key="text" :label="$t('settings.selectSelectTypeKeyboard')" value="text"></v-radio>
              <v-radio :color="colortheme.colortext" key="button" :label="$t('settings.selectSelectTypeButton')" value="button"></v-radio>
            </v-radio-group>
      </v-card-text>
      </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels flat tile :value="0" focusable>
    <v-expansion-panel>
        <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
              {{ $t('settings.dialogs')}}
            </v-expansion-panel-header>
            <v-expansion-panel-content :color="colortheme.greyText">
         </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>
<script>
import colorThemes from '../settings/colorthemes.json'
import loadingModes from '../settings/loadingModes.json'
import appLanguages from '../settings/appLanguages.json'
import Dataservice from '@/service/dataService'
import LoadingDatasourceCard from '../components/LoadingDatasourceCard'
import DataSourceSelectComponent from '../components/DataSourceSelectComponent.vue'

export default {
  name: 'DivNaviKeySettings',
  data: () => ({
    color: 'grey lighten-4 light-green--text text--darken-3',
    colordarken: 'grey lighten-2 light-green--text text--darken-3',
    colortext: 'light-green darken-3',
    checkboxCategoricalTolerance: false,
    checkboxPositiveCategoricalTolerance: false,
    checkboxNumericalFilterInclExtremeValues: false,
    checkboxNoDatasourceInfo: false,
    showDatasourceSelectComponent: false,
    colorThemeSettings: colorThemes,
    colorThemeSelect: null,
    loadModes: loadingModes,
    loadSelect: null,
    languages: appLanguages,
    showPerPage: [10, 50, 100, 200, 500, 1000],
    resetDialog: false,
    resetConfirm: false,
    updateDialog: false,
    saveToCacheDialog: false,
    autocompleteTypeSelect: null,
    // updateSearchFilesClicked: false,
    searchCriteriaFile: [],
    errorMessage: '',
    useRestrictFilter: false,
    checkboxShowTaxonInfo: false,
    checkboxShowTaxonSinAuthor: false,
    disableSaveToCacheOKButton: false,
    sortSettings: { 'descriptors': { 'key1': 'order', 'order1': 'asc', 'key2': 'name', 'order2': 'asc' }, 'states': { 'key1': 'order', 'order1': 'asc', 'key2': 'csName', 'order2': 'asc' } },
    exportSearchFileType: process.env.VUE_APP_ADVANCEDSEARCH_EXPORT_FILETYPE,
    appVersion: process.env.VUE_APP_VERSION,
    localStorageName: process.env.VUE_APP_INDEXED_DB_NAME
  }),
  components: {
    'loading-datasource-card': LoadingDatasourceCard,
    'data-source-select-component': DataSourceSelectComponent
  },
  created () {
    // set default
    this.setToleranceCheckbox(this.$store.getters.getIsCategoricalToleranceMode)
    this.setPositiveToleranceCheckbox(this.$store.getters.getIsPositiveCategoricalToleranceMode)
    this.setColorTheme(this.$store.getters.getGuiColorTheme)
    this.setCurrentLoadMode(this.$store.getters.getCurrentLoadMode)
    // this.setCurrentLanguage(this.$store.getters.getCurrentLanguage)
    this.setAutocompleteType(this.$store.getters.getSwitchType)
    this.setNoDatasourceDialog(this.$store.getters.getNoDatascourceInfoDialog)
    this.setUseRestrictFilter(this.$store.getters.getUseRestrictFilter)
    this.setSortSettings(this.$store.getters.getSortSettings)
    this.setUseTaxonInfo(this.$store.getters.getUseTaxonScope)
    this.setShowTaxonSinAuthor(this.$store.getters.getUseTaxonSinAuthors)
    this.setCheckboxNumericalFilterInclExtremeValues(this.$store.getters.getNumFilterIncludeExtremeValues)
    // this.setShowDescriptorStateImagesIfAvailable(this.$store.getters.getShowDescriptorStateImagesIfAvailable)
  },
  computed: {
    labelDataLoad () {
      return this.$t('settings.selectLoadMode') + ' – (' + this.$t('selectDescriptorAdvancedSearchView.loadingTextInfo') + ')'
    },
    resetInfo () {
      if (this.resetConfirm) {
        return this.$t('settings.confirmResetIDBText')
      } else {
        return this.$t('settings.askResetText')
      }
    },
    colortheme () {
      return this.$store.getters.getGuiColorTheme
    },
    apiLoading () {
      return this.$store.getters.getApiLoading
    },
    languageSelect: {
      get () {
        // console.log('get')
        return this.$store.getters.getCurrentLanguage.key
      },
      set (value) {
        // console.log('set')
        this.onLanguageChanged(value)
      }
    },
    perPageModel: {
      get () {
        // console.log('get')
        return this.$store.getters.getResultsPerPageSetting
      },
      set (value) {
        // console.log('set')
        this.onPerPageChanged(value)
      }
    },
    currentDatasource () {
      let current = this.$store.getters.getDataSourceData
      if (current) {
        let masterInfo = this.$store.getters.getMasterDataSourceInfo(current)
        if (masterInfo) {
          return { project: masterInfo.displayName, lang: current.scheme_lang }
        }
      }
      return { project: this.$t('settings.NotSet'), lang: this.$t('settings.NotSet') }
    },
    sortSettingDescriptorKeys () {
      return [{ 'value': 'order', 'text': this.$t('settings.defaultSort') }, { 'value': 'name', 'text': this.$t('settings.alphabeticalSort') }, { 'value': 'availability', 'text': this.$t('settings.availabilitySort') }]
    },
    sortSettingStateKeys () {
      return [{ 'value': 'order', 'text': this.$t('settings.defaultSort') }, { 'value': 'csName', 'text': this.$t('settings.alphabeticalSort') }]
    },
    sortSettingOrders () {
      return [{ 'value': 'asc', 'text': this.$t('settings.orderAsc') }, { 'value': 'desc', 'text': this.$t('settings.orderDesc') }]
    },
    checkboxSynchronizeDatasourceLang () {
      return this.$store.getters.getSynchronizeDatasourceLanguage
    },
    showDescriptorStateImagesIfAvailable: {
      get () {
        // console.log('get')
        return this.$store.getters.getShowDescriptorStateImagesIfAvailable
      },
      set (value) {
        this.onShowDescriptorStateImagesIfAvailable(value)
      }
    },
    showItemImagesIfAvailable: {
      get () {
        return this.$store.getters.getShowItemImagesIfAvailable
      },
      set (value) {
        this.onShowItemImagesIfAvailable(value)
      }
    }
  },
  methods: {
    setToleranceCheckbox (value) {
      this.checkboxCategoricalTolerance = value
    },
    setAutocompleteType (value) {
      this.autocompleteTypeSelect = value
    },
    setNoDatasourceDialog (value) {
      this.checkboxNoDatasourceInfo = value
    },
    setUseRestrictFilter (value) {
      this.useRestrictFilter = value
    },
    setPositiveToleranceCheckbox (value) {
      this.checkboxPositiveCategoricalTolerance = value
    },
    setCheckboxNumericalFilterInclExtremeValues (value) {
      this.checkboxNumericalFilterInclExtremeValues = value
    },
    setColorTheme (value) {
      this.colorThemeSelect = value.key
    },
    setCurrentLoadMode (value) {
      this.loadSelect = value.key
    },
    setSortSettings (value) {
      this.sortSettings = value
    },
    setUseTaxonInfo (value) {
      this.checkboxShowTaxonInfo = value
    },
    setShowTaxonSinAuthor (value) {
      this.checkboxShowTaxonSinAuthor = value
    },
    // setShowDescriptorStateImagesIfAvailable (value) {
    //   this.showDescriptorStateImagesIfAvailable = value
    // },
    // setDataSourceID (id) {
    //   this.datasourceId = id
    // },
    onDatasourceSetEvent () {
      this.showDatasourceSelectComponent = false
    },
    onCancelDatasourceSelect () {
      this.showDatasourceSelectComponent = false
    },
    onCancelLoadingClick () {
      this.$store.dispatch('passCancelAPILoading')
    },
    async onDatabaseChangeClick () {
      // delete default id in vuex
      await this.$store.dispatch('passSelectedDefaultDatasourceId', null)
      this.showDatasourceSelectComponent = true
    },
    onSaveItemDetailsToCacheClick () {
      this.saveToCacheDialog = true
    },
    // setCurrentLanguage (value) {
    //   // this.languageSelect = value
    //   let navLang = this.languages.filter(k => k.key === value.key)
    //   if (navLang && navLang.length > 0) {
    //     this.$i18n.locale = navLang[0].key
    //     if (this.$i18n.locale === 'ar' || this.$i18n.locale === 'he') {
    //       this.$vuetify.rtl = true
    //     } else {
    //       this.$vuetify.rtl = false
    //     }
    //     this.languageSelect = navLang[0].key
    //   }
    // },
    onCheckboxToleranceChanged () {
      this.$store.dispatch('passIsCategoricalToleranceMode', this.checkboxCategoricalTolerance)
      this.onSaveCategoricalToleranceModeToLocalStoreClick()
    },
    onCheckboxNoDatasourceDialogChanged () {
      this.$store.dispatch('passNoDatasourceDialog', this.checkboxNoDatasourceInfo)
      this.onSaveGeneralsToLocalStoreClick()
    },
    onautocompleteTypeChanged () {
      this.$store.dispatch('passSwitchType', this.autocompleteTypeSelect)
      this.onSaveKeyboardSettingToLocaleStoreClick()
    },
    onCheckboxPositiveToleranceChanged () {
      this.$store.dispatch('passIsPositiveCategoricalToleranceMode', this.checkboxPositiveCategoricalTolerance)
      this.onSaveCategoricalToleranceModeToLocalStoreClick()
    },
    onCheckboxNumericalFilterIncludeExtremeValuesChanged () {
      this.$store.dispatch('passNumFilterIncludeExtremeValues', this.checkboxNumericalFilterInclExtremeValues)
      this.onSaveInclExtremeValuesToLocalStoreClick()
    },
    onCheckboxShowTaxonInfo () {
      this.$store.dispatch('passUseTaxonScope', this.checkboxShowTaxonInfo)
      if (this.$store.getters.isCurrentSearchDescriptorMode || this.$store.getters.getExpertViewMode) {
        this.$store.dispatch('passSelectedItems', { filteredItems: null, resetResult: false })
      } else {
        this.$store.dispatch('passSelectedNames', { filteredNames: null, resetResult: false })
      }
      // save to local sorea
      let keyname = this.localStorageName + '/diversityUseTaxonScopeInfo'
      localStorage.setItem(keyname, this.checkboxShowTaxonInfo)
    },
    onCheckboxShowTaxonSinAuthor () {
      if (this.checkboxShowTaxonSinAuthor) {
        this.checkboxShowTaxonInfo = true
        this.onCheckboxShowTaxonInfo()
      }
      this.$store.dispatch('passUseTaxonSinAuthors', this.checkboxShowTaxonSinAuthor)
      if (this.$store.getters.isCurrentSearchDescriptorMode || this.$store.getters.getExpertViewMode) {
        this.$store.dispatch('passSelectedItems', { filteredItems: null, resetResult: false })
      } else {
        this.$store.dispatch('passSelectedNames', { filteredNames: null, resetResult: false })
      }
      // save to local sorea
      let keyname = this.localStorageName + '/diversityUseTaxonSinAuthor'
      localStorage.setItem(keyname, this.checkboxShowTaxonSinAuthor)
    },
    onShowDescriptorStateImagesIfAvailable (value) {
      this.$store.dispatch('passShowDescriptorStateImagesIfAvailable', value)
      let keyname = this.localStorageName + '/showDescriptorStateImagesIfAvailable'
      localStorage.setItem(keyname, value)
    },
    onShowItemImagesIfAvailable (value) {
      this.$store.dispatch('passShowItemImagesIfAvailable', value)
      let keyname = this.localStorageName + '/showItemImagesIfAvailable'
      localStorage.setItem(keyname, value)
    },
    onColorThemeChanged () {
      let navColorTheme = this.colorThemeSettings.filter(k => k.key === this.colorThemeSelect)
      this.$store.dispatch('passGuiColorTheme', navColorTheme[0])
      this.onSaveColorThemeToLocalStoreClick()
    },
    onLoadModeChanged () {
      let navLoad = this.loadModes.filter(k => k.key === this.loadSelect)
      this.$store.dispatch('passCurrentLoadMode', navLoad[0])
      this.onSaveLoadSettingToLocaleStoreClick()
    },
    onLanguageChanged (value) {
      let navLang = this.languages.filter(k => k.key === value)
      if (navLang && navLang.length > 0) {
        this.$i18n.locale = navLang[0].key
        if (this.$i18n.locale === 'ar' || this.$i18n.locale === 'he') {
          this.$vuetify.rtl = true
        } else {
          this.$vuetify.rtl = false
        }
        this.$store.dispatch('passCurrentLanguage', navLang[0])
        this.onSaveLanguageToLocalStoreClick()
      }
      if (this.$store.getters.getDataSourceData) {
        const datasourceLanguage = this.$store.getters.getDataSourceData.scheme_lang
        if (datasourceLanguage === 'ar' || datasourceLanguage === 'he' || datasourceLanguage === 'fa' || datasourceLanguage === 'egy') {
          this.$vuetify.rtl = true
        } else {
          this.$vuetify.rtl = false
        }
      }
    },
    onPerPageChanged (value) {
      this.$store.dispatch('passResultsPerPageSetting', value)
      this.onSaveResultsPerPageToLocalStoreClick()
    },
    onUseRestrictFilterChanged () {
      this.$store.dispatch('passUseRestrictFilter', this.useRestrictFilter)
      this.onSaveCategoricalToleranceModeToLocalStoreClick()
    },
    onSortDescriptorKey1Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortDescriptorKey2Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortDescriptorOrder1Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortDescriptorOrder2Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortStateKey1Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortStateKey2Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortStateOrder1Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSortStateOrder2Change () {
      this.$store.dispatch('passSortSettings', this.sortSettings)
      this.onSaveDescriptorSortToLocalStoreClick()
    },
    onSaveLoadSettingToLocaleStoreClick () {
      const keyname = this.localStorageName + '/diversityNaviKeyLoadingMode'
      localStorage.setItem(keyname, this.loadSelect)
    },
    onSaveColorThemeToLocalStoreClick () {
      const keyname = this.localStorageName + '/diversityNaviKeyColorTheme'
      localStorage.setItem(keyname, this.colorThemeSelect)
    },
    onSaveCategoricalToleranceModeToLocalStoreClick () {
      // console.log('savetolocal')
      let keyname = this.localStorageName + '/diversityNaviKeyCategoricalToleranceMode'
      localStorage.setItem(keyname, this.checkboxCategoricalTolerance)
      keyname = this.localStorageName + '/diversityNaviKeyPositiveCategoricalToleranceMode'
      localStorage.setItem(keyname, this.checkboxPositiveCategoricalTolerance)
      keyname = this.localStorageName + '/diverstiyUseRestrictFilter'
      localStorage.setItem(keyname, this.useRestrictFilter)
    },
    onSaveInclExtremeValuesToLocalStoreClick () {
      let keyname = this.localStorageName + '/diversityNaviKeyNumFilterIncludeExtremeValues'
      localStorage.setItem(keyname, this.checkboxNumericalFilterInclExtremeValues)
    },
    onSaveLanguageToLocalStoreClick () {
      let keyname = this.localStorageName + '/diversityNaviKeyLanguage'
      localStorage.setItem(keyname, this.languageSelect)
    },
    onSaveKeyboardSettingToLocaleStoreClick () {
      let keyname = this.localStorageName + '/diversityKeyboardSelectType'
      localStorage.setItem(keyname, this.autocompleteTypeSelect)
    },
    onSaveGeneralsToLocalStoreClick () {
      let keyname = this.localStorageName + '/diversityNoDatasourceDialog'
      localStorage.setItem(keyname, this.checkboxNoDatasourceInfo)
    },
    onSaveDefaultDatasourceToLocalStoreClick () {
      let id = this.$store.getters.getCurrentDatasourceID
      let keyname = this.localStorageName + '/diversityDefaultDatasourceID'
      localStorage.setItem(keyname, id)
    },
    onSaveResultsPerPageToLocalStoreClick () {
      let keyname = this.localStorageName + '/diversityResultPerPageSettings'
      localStorage.setItem(keyname, this.perPageModel)
    },
    onSaveDescriptorSortToLocalStoreClick () {
      let keyname = this.localStorageName + '/diversitySortSettings'
      localStorage.setItem(keyname, JSON.stringify(this.sortSettings))
    },
    onUpdateApp () {
      this.updateDialog = true
    },
    onConfirmResetIndexedDB () {
      this.resetDialog = true
    },
    onCancelResetButtonClick () {
      this.resetDialog = false
    },
    onCancelUpdateButtonClick () {
      this.updateDialog = false
    },
    async onOKUpdateButtonClick () {
      window.location.reload()
      // await this.$store.dispatch('loadAllAvailableDatasources')
      this.updateDialog = false
    },
    async onOKResetButtonClick () {
      this.resetConfirm = true
      Dataservice.removeIndexDB()
      localStorage.clear()
      // create new database
      // console.log('here?')
      await this.$store.dispatch('loadAllAvailableDatasources')
      window.location.reload()
      this.resetDialog = false
      this.resetConfirm = true
    },
    async onOKSaveToCacheButtonClick () {
      this.disableSaveToCacheOKButton = true
      try {
        await this.$store.dispatch('loadAndSaveDetailedInfoTableDataToCache')
      } catch (err) {
        console.log('saving list of item details is not possible', err)
      }
      this.disableSaveToCacheOKButton = false
      this.saveToCacheDialog = false
    },
    onCancelSaveToCacheButtonClick () {
      this.saveToCacheDialog = false
    }
    // do not delete ->
    // onChangeUserSearchstringToNewVersion () {
    //   this.updateSearchFilesClicked = !this.updateSearchFilesClicked
    // },
    // async onInputFileSelected () {
    //   if (!this.searchCriteriaFile) {
    //     console.log('No File selected')
    //     return
    //   }
    //   let filename = this.searchCriteriaFile.name
    //   // console.log('filename', filename)
    //   // console.log('searchcriteriafile', filename)
    //   if (filename.lastIndexOf('.') <= 0) { // no fileextension
    //     console.log('no supported file')
    //   } else {
    //     let fileExtension = filename.split('.').pop()
    //     if (fileExtension !== 'json') {
    //       this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.NotSupportedFileFormat')
    //       this.updateSearchFilesClicked = false
    //       return
    //     }
    //   }
    //   const fileReader = new FileReader()
    //   fileReader.addEventListener('load', e => {
    //     try {
    //       console.log('this.searchCriteriaFile', this.searchCriteriaFile)
    //       let tempSearchCriteria = JSON.parse(fileReader.result)
    //       // console.log('tempsearld', Number(tempSearchCriteria.version) < Number(this.appVersion))
    //       if (tempSearchCriteria && tempSearchCriteria.type && tempSearchCriteria.type === this.exportSearchFileType) {
    //         if (tempSearchCriteria.version !== this.appVersion) {
    //           tempSearchCriteria.version = this.appVersion
    //         }
    //       }
    //       // test datasource db_id db_version
    //       if (tempSearchCriteria.db_id && tempSearchCriteria.db_version) {
    //         // check if current datasource is same as in loaded file
    //         const currentDatasource = this.$store.getters.getDataSourceData
    //         // hard-coded change stuff to version 0.6
    //         if (this.appVersion !== 0.6) {
    //           if (Number(tempSearchCriteria.db_id) === 1) {
    //             tempSearchCriteria.db_id = 'liaslight1_Project_LIASlight'
    //           }
    //           if (Number(tempSearchCriteria.db_id) === 2) {
    //             tempSearchCriteria.db_id = 'liaslight2_Project_LIASlight'
    //           }
    //         }
    //         // console.log('currentDAte', currentDatasource)
    //         if (!currentDatasource || currentDatasource.id !== tempSearchCriteria.db_id) {
    //           this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectDatasource')
    //           this.updateSearchFilesClicked = false
    //           return
    //         } else {
    //           // change LIAS saved files to
    //           if (tempSearchCriteria.db_id === currentDatasource.id && currentDatasource.ds_version !== tempSearchCriteria.db_version) {
    //             tempSearchCriteria.db_version = currentDatasource.ds_version
    //           }
    //         }
    //       } else {
    //         // this should not happen
    //         console.log('should not happen with new exported files')
    //         this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectFileNoDatasourceVersion')
    //         this.updateSearchFilesClicked = false
    //         return
    //       }
    //       if (tempSearchCriteria) {
    //         // console.log('ok here', tempSearchCriteria)
    //         const data = JSON.stringify(tempSearchCriteria)
    //         const blob = new Blob([data], { type: 'text/plain' })
    //         const link = document.createElement('a')
    //         link.download = this.searchCriteriaFile.name
    //         link.href = window.URL.createObjectURL(blob)
    //         link.click()
    //         window.URL.revokeObjectURL(link.href)
    //       }
    //       this.updateSearchFilesClicked = false
    //       return
    //     } catch (error) {
    //       console.log('No upload for .json file possible: ', error)
    //       this.errorMessage = this.$t('selectDescriptorAdvancedSearchView.fileUploadIncorrectFile')
    //     }
    //   })
    //   fileReader.readAsText(this.searchCriteriaFile)
    //   this.updateSearchFilesClicked = !this.loadClicked
    //   this.enabledGroup = []
    //   this.disableCheckbox = false
    //   this.disableSelectAsSearch = false
    // },
    // onErrorButtonOkClicked () {
    //   this.errorMessage = ''
    // }
  }
}
</script>
