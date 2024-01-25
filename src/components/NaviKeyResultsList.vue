<template>
  <v-card :color="colortheme.color" class="pa-0 ma-0" height="100%" flat tile v-touch="{ right: () => swipe('Right'), left: () => swipe('Left') }">
    <div-navikey-toolbar>
      <template v-slot:content>
        <v-pagination class="flex" v-model="page" :length="pageLength" :color="colortheme.color" total-visible="7" @next="onNextClick" @previous="onPreviousClick" @input="onInputClick">
        </v-pagination>
      </template>
    </div-navikey-toolbar>
    <v-card-actions>
      <v-btn class="d-none d-sm-block pb-0 pl-2 ml-4 mt-0 pt-0" :color="colortheme.color" @click="onExportCriteriaClick()"><v-icon>mdi-folder-download</v-icon>{{ $t('naviKeyResultsList.exportBtn') }}</v-btn>
      <v-btn class="d-sm-none pb-0 pl-2 ml-4 mt-0 pt-0" :color="colortheme.color" @click="onExportCriteriaClick()"><v-icon>mdi-folder-download</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-select :color="colortheme.colortext" :item-color="colortheme.colortext" :items="showPerPage" style="max-width: 100px"
      v-model="perPageModel" :label="$t('naviKeyResultsList.perPageTitle')" :aria-labelledby="$t('naviKeyResultsList.perPageTitle')">
      </v-select>
    </v-card-actions>
    <v-card-text class="mt-0 pt-0">
      <v-list :color="colortheme.color" class="mt-0 pt-0">
        <template v-for="(item) in resultItems" :key="item.IID + item.ItemName">
          <v-list-item>
                <!-- <v-list-item-content> -->
                  <v-list-item-title v-if="useTaxonScope && showAuthor && item.scopeTaxonInfo && item.scopeTaxonInfo.length > 0 && item.scopeTaxonInfo[0].acceptedName"  class="wrap-text" @click="showItemDetails(item.IID)">{{item.scopeTaxonInfo[0].acceptedName}}</v-list-item-title>
                  <v-list-item-title v-else-if="(!useTaxonScope || ( !item.scopeTaxonInfo || item.scopeTaxonInfo.length === 0 || !item.scopeTaxonInfo[0].acceptedName) && showAuthor)" class="wrap-text" @click="showItemDetails(item.IID)">{{item.ItemName}}</v-list-item-title>
                  <v-list-item-title v-else-if="useTaxonScope && !showAuthor && item.scopeTaxonInfo && item.scopeTaxonInfo.length > 0 && item.scopeTaxonInfo[0].acceptedNameSinAuthor" class="wrap-text" @click="showItemDetails(item.IID)">{{item.scopeTaxonInfo[0].acceptedNameSinAuthor}}</v-list-item-title>
                  <v-list-item-title v-else-if="(!useTaxonScope || ( !item.scopeTaxonInfo || item.scopeTaxonInfo.length === 0 || !item.scopeTaxonInfo[0].acceptedNameSinAuthor) && !showAuthor)" class="wrap-text" @click="showItemDetails(item.IID)">{{item.ItemName}}</v-list-item-title>
                  <v-list-item-subtitle v-if="useTaxonScope && showAuthor && item.scopeTaxonInfo && (item.scopeTaxonInfo.length === 0 || (item.scopeTaxonInfo.length > 0 && item.scopeTaxonInfo[0].acceptedName && item.scopeTaxonInfo[0].acceptedName !== item.ItemName))" class="wrap-text" @click="showItemDetails(item.IID)">{{item.ItemName}}</v-list-item-subtitle>
                  <v-list-item-subtitle v-else-if="useTaxonScope && !showAuthor && item.scopeTaxonInfo && item.scopeTaxonInfo.length > 0 && item.scopeTaxonInfo[0].acceptedNameSinAuthor !== item.scopeTaxonInfo[0].taxonNameSinAuthor" class="wrap-text" @click="showItemDetails(item.IID)">{{item.scopeTaxonInfo[0].taxonNameSinAuthor}}</v-list-item-subtitle>
                <!-- </v-list-item-content> -->
                <v-list-item-action>
                <v-icon @click="showItemDetails(item.IID)">mdi-open-in-new</v-icon>
              </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider> <!-- :key="index" -->
          </template>
      </v-list>
    </v-card-text>
    <v-dialog v-model="exportDialog" @click:outside="onCancelExportButtonClick()">
      <export-dialog-form v-on:onOKExportButtonClick="onOKExportButtonClick($event)" v-on:onCancelExportButtonClick="onCancelExportButtonClick()" />
    </v-dialog>
    <v-dialog transition="fab-transition" :fullscreen="isMobile" scrollable v-model="detailsDialog" @click:outside="onCloseDetailsClick()">
      <v-btn :color="colortheme.colordarken" v-if="!isMobile" icon dark small fixed top right @click="onCloseDetailsClick()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <navikey-result-details v-on:onCloseDetailsClick="onCloseDetailsClick()"/>
    </v-dialog>
    </v-card>
</template>
<script>

import DivNaviKeyToolbar from '../components/DivNaviKeyToolbar'
import { mapGetters } from 'vuex'
import ExportDialogForm from './ExportDialogForm.vue'
import NaviKeyResultDetails from '../components/NaviKeyResultDetails'

export default {
  name: 'NaviKeyResultsList',
  components: {
    'div-navikey-toolbar': DivNaviKeyToolbar,
    'export-dialog-form': ExportDialogForm,
    'navikey-result-details': NaviKeyResultDetails
  },
  data: () => ({
    page: 1,
    pageInput: 1,
    showPerPage: [10, 50, 100, 200, 500, 1000],
    rules: {
      numberRules: [v => !Number.isNaN(parseFloat(v)) || 'Number']
    },
    exportDialog: false,
    detailsDialog: false
  }),
  computed: {
    ...mapGetters(['getNumberOfMatches', 'getAllResultItems', 'getAllResultNames', 'getMappedSelectedItems', 'isCurrentSearchDescriptorMode', 'getMappedSelectedNames', 'sortResultItems', 'getGuiColorTheme', 'getNewSearch', 'getDataSourceData', 'getUserSearchString', 'getUserSelectedOperator', 'getExpertViewMode', 'getUserSearchStringExtendedSearch', 'getResultsPerPageSetting', 'getTaxonScopeAvailable', 'getUseTaxonScope', 'getUseTaxonSinAuthors']),
    colortheme () {
      return this.getGuiColorTheme
    },
    isMobile () {
      if (this.$vuetify.display.xsOnly) {
        return true
      }
      return false
    },
    perPageModel: {
      get () {
        return this.getResultsPerPageSetting
      },
      set (value) {
        this.onPerPageChanged(value)
      }
    },
    isItemList () {
      return this.isCurrentSearchDescriptorMode
    },
    numberOfMatches () {
      return this.getNumberOfMatches(this.isItemList)
    },
    pageLength () {
      return Math.ceil(this.numberOfMatches / this.perPageModel)
    },
    useTaxonScope () {
      if (this.getTaxonScopeAvailable && this.getUseTaxonScope) {
        return true
      }
      return false
    },
    showAuthor () {
      if (this.getUseTaxonSinAuthors) {
        return false
      }
      return true
    },
    resultItems () {
      // do not delete if case!
      if (this.newSearch) {
        console.log('this should not appear')
      }
      let firstIndexToShow = 0
      let secondIndexToShow = this.numberOfMatches
      const multPage = this.page * this.perPageModel
      if (multPage <= this.numberOfMatches) {
        secondIndexToShow = multPage
      }
      firstIndexToShow = (multPage - this.perPageModel)
      if (this.isItemList) {
        const resultList = this.getMappedSelectedItems(firstIndexToShow, secondIndexToShow)
        // console.log('is true resultList', resultList)
        return resultList // .slice(firstIndexToShow, secondIndexToShow)
      } else {
        const resultList = this.getMappedSelectedNames(firstIndexToShow, secondIndexToShow)
        // console.log('resultList', resultList)
        return resultList
      }
    },
    newSearch () {
      if (this.getNewSearch) {
        this.setPage(1)
      }
      return this.getNewSearch
    }
  },
  methods: {
    swipe (direction) {
      if (direction === 'Right') {
        this.onPrev()
      }
      if (direction === 'Left') {
        this.onNext()
      }
    },
    setPage (value) {
      this.page = value
      this.pageInput = value
      this.$store.dispatch('passNewSearch', false)
    },
    onPerPageChanged (value) {
      this.page = 1
      this.pageInput = 1
      this.$store.dispatch('passResultsPerPageSetting', value)
    },
    onChangePage () {
      this.page = Number(this.pageInput)
    },
    onNextClick () {
      this.pageInput = this.page
    },
    onPrev () {
      if (this.page > 1) {
        this.page = this.page - 1
      } else {
        this.$router.push({ name: 'navikey-home' })
      }
    },
    onNext () {
      if (this.page < this.pageLength) {
        this.page = this.page + 1
      }
    },
    onPreviousClick () {
      this.pageInput = this.page
    },
    onInputClick () {
      this.pageInput = this.page
    },
    async showItemDetails (value) {
      await this.$store.dispatch('passSelectedItemID', value)
      try {
        await this.$store.dispatch('loadItemDescriptionJson')
        this.detailsDialog = true
      } catch (error) {
        // console.log('online error')
        this.detailsDialog = true
      }
    },
    mapResultList (resultItem) {
      if (resultItem.scopeTaxonInfo && resultItem.scopeTaxonInfo.length > 0) {
        return {
          ItemName: resultItem.ItemName,
          AcceptedName: resultItem.scopeTaxonInfo[0].acceptedName,
          AcceptedNameSinAuthor: resultItem.scopeTaxonInfo[0].acceptedNameSinAuthor
        }
      } else {
        return {
          ItemName: resultItem.ItemName
        }
      }
    },
    /**
     * Export/Save current result list as json File
     */
    onOKExportButtonClick (value) {
      const filename = value
      let allresults = []
      if (this.isItemList) {
        allresults = this.getAllResultItems
      } else {
        allresults = this.getAllResultNames
      }
      if (allresults && allresults.length > 0) {
        let resultlist = allresults.map(this.mapResultList)
        // get datasource info
        let list = [{ db_name: null, db_version: null, licenseURI: null, license: null, searchparameters: null, Resultlist: resultlist }]
        let ds = this.getDataSourceData
        list[0].db_name = ds ? ds.displayName : null
        list[0].db_version = ds ? ds.ds_version : null
        // license info
        let metadataInfo = null
        if (ds) {
          let masterInfo = this.$store.getters.getDBMasterMetadata(ds)
          if (masterInfo && masterInfo.metadata.length > 0) {
            metadataInfo = masterInfo.metadata[0]
            if (metadataInfo) {
              list[0].licenseURI = metadataInfo.LicenseURI
              list[0].license = metadataInfo.LicenseText
            }
          }
        }
        // get searchstring
        if (!this.getExpertViewMode) {
          let simplesearch = this.getUserSearchString.map(searchparam => ({
            parameter: searchparam.descName + '' + searchparam.name
          }))
          let operators = this.getUserSelectedOperator
          if (operators && operators.length === 2) {
            let operatorsDiff = operators[0]
            let operatorsSame = operators[1]
            let params = [ { operatorDifferentDescriptor: operatorsDiff, operatorIdenticalDescriptor: operatorsSame, parameters: simplesearch } ]
            list[0].searchparameters = params
          }
        } else {
          let extendessearch = this.getUserSearchStringExtendedSearch.text
          let txt = extendessearch.replace(/<(.|\n)*?>/g, '')
          list[0].searchparameters = txt
        }
        const data = JSON.stringify(list)
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
    onCloseDetailsClick () {
      this.detailsDialog = false
    },
    onExportCriteriaClick (value) {
      this.exportDialog = true
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
