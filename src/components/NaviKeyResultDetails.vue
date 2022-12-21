<template>
  <v-card :color="colortheme.color" flat tile min-height="400" v-touch="{ right: () => swipe('Right'), left: () => swipe('Left') }">
    <v-toolbar :color="colortheme.color" flat dense>
      <v-btn :color="colortheme.colortext" class="ml-0 pl-0" v-if="isMobile" text @click="onCloseDetailsClick()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="!isMobile" :color="colortheme.colortext" class="ml-2" text @click="onExportCriteriaClick()">
        <v-icon left>mdi-folder-download</v-icon>{{ $t('navikeyResultDetails.exportCriteriaText') }}
        </v-btn>
        <v-btn v-if="isMobile" :color="colortheme.colortext" class="ml-2" text @click="onExportCriteriaClick()">
        <v-icon left>mdi-folder-download</v-icon>
        </v-btn>
    </v-toolbar>
      <v-card-title class="subheading font-weight-bold" v-if="itemDetails && taxonInfo">{{taxonInfo.acceptedName}}</v-card-title>
      <v-card-title class="subheading font-weight-bold" v-if="itemDetails && !taxonInfo">{{itemDetails.itemName}}</v-card-title>
      <v-card-subtitle  v-if="itemDetails && taxonInfo && (taxonInfo.acceptedName !== itemDetails.itemName)">{{itemDetails.itemName}}
      </v-card-subtitle>
    <!-- <v-card class="overflow-auto"> -->
    <v-card-text v-if="detailsError !== ''" class="wrap-text">{{detailsError}}</v-card-text>
    <v-card-actions v-if="!isMobile">
      <v-btn :color="colortheme.colordarken" fab dark small fixed left @click="swipe('Right')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn :color="colortheme.colordarken" fab dark small fixed right @click="swipe('Left')">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-text class="pl-0 pr-0">
    <v-row v-if="itemDetails" class="ml-0 mr-0">
      <v-col v-for="(group, g) in itemDetails.itemDescription" :key="g" :cols="12" class="pl-0 pr-0">
          <v-divider></v-divider>
          <v-expansion-panels flat tile v-model="panel" focusable multiple accordion>
            <v-expansion-panel flat>
              <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
                {{ $t('navikeyResultDetails.descriptorTitle')}}
              </v-expansion-panel-header>
              <v-expansion-panel-content :color="colortheme.greyText">
              <v-simple-table v-if="!isMobile" class="pl-2 pr-2" width="100%">
                <thead>
                  <tr>
                    <th class="text-left" width="40%">Descriptor</th>
                    <th class="text-left">State / Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(groupItem, i) in group.descriptorStates" :key="i">
                    <td>{{groupItem.descriptorName}}</td>
                    <td>
                      <template v-if="(groupItem.descriptorType === selectionDescriptorType)">
                          <template v-for="(descriptorItem, k) in groupItem.items">
                          <tr :key="k">{{descriptorItem.stateName}} <span v-if="descriptorItem.modifier"> ({{descriptorItem.modifier}}) </span></tr>
                        </template>
                        </template>
                    <template v-if="(groupItem.descriptorType === numberDescriptorType)">
                      <template v-for="(descriptorItem, k) in groupItem.items">
                        <tr :key="k"><span v-if="descriptorItem.unitIsPrefix && descriptorItem.unit">{{descriptorItem.unit}} </span> {{descriptorItem.stateName}}: {{descriptorItem.numberValue}} <span v-if="!descriptorItem.unitIsPrefix && descriptorItem.unit">{{descriptorItem.unit}} </span>
                        </tr>
                      </template>
                    </template>
                    <template v-if="(groupItem.descriptorType === textDescriptorType)">
                      <template v-for="(descriptorItem, k) in groupItem.items">
                        <tr :key="k" v-html="descriptorItem.txtValue"></tr>
                      </template>
                    </template>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              <v-list v-if="isMobile" class="pl-2 pr-2">
              <v-list-item v-for="(groupItem, i) in group.descriptorStates" :key="i">
                <v-list-item-content>
                  <v-list-item-title class="wrap-text">{{groupItem.descriptorName}}</v-list-item-title>
                  <template v-if="(groupItem.descriptorType === selectionDescriptorType)">
                    <v-list-item-subtitle class="wrap-text" v-for="(descriptorItem, k) in groupItem.items" :key="k">{{descriptorItem.stateName}} <span v-if="descriptorItem.modifier"> ({{descriptorItem.modifier}}) </span></v-list-item-subtitle>
                  </template>
                  <template v-if="(groupItem.descriptorType === numberDescriptorType)">
                    <v-list-item-subtitle class="wrap-text" v-for="(descriptorItem, k) in groupItem.items" :key="k"><span v-if="descriptorItem.unitIsPrefix && descriptorItem.unit">{{descriptorItem.unit}} </span> {{descriptorItem.stateName}}: {{descriptorItem.numberValue}} <span v-if="!descriptorItem.unitIsPrefix && descriptorItem.unit">{{descriptorItem.unit}} </span></v-list-item-subtitle>
                  </template>
                   <template v-if="(groupItem.descriptorType === textDescriptorType)">
                     <v-list-item-subtitle class="wrap-text" v-for="(descriptorItem, k) in groupItem.items" :key="k" v-html="descriptorItem.txtValue"></v-list-item-subtitle>
                   </template>
                </v-list-item-content>
              </v-list-item>
              </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="itemImages && itemImages.length > 0">
              <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
                {{ $t('navikeyResultDetails.imagesTitle')}}
              </v-expansion-panel-header>
              <v-expansion-panel-content :color="colortheme.greyText">
                <div-navikey-imagecarousel :carousel-images="itemImages"/>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel v-if="taxonInfo || citationInfo">
              <v-expansion-panel-header expand-icon="mdi-menu-down" :color="colortheme.color">
                {{ $t('navikeyResultDetails.scopeTitle')}}
              </v-expansion-panel-header>
              <v-expansion-panel-content :color="colortheme.greyText">
                <v-simple-table class="simpleAdditionalTable pl-2 pr-2" v-if="!isMobile">
                <tbody v-if="taxonInfo">
                  <tr>
                    <td>{{ $t('navikeyResultDetails.scopeTaxonAcceptedName') }}</td>
                    <td>{{ taxonInfo.acceptedName }}</td>
                  </tr>
                  </tbody>
                  <tbody v-if="citationInfo">
                  <tr v-for="(citInfo, i) in citationInfo" :key="i">
                      <td v-if="i===0">{{ $t('navikeyResultDetails.scopeCitTitle') }}</td>
                      <td v-else></td>
                      <td> {{ citInfo.citationDescription }} <br> {{ citInfo.citationInfo}}</td>
                  </tr>
                </tbody>
                </v-simple-table>
                <v-list v-if="isMobile && taxonInfo">
                <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="wrap-text">{{ $t('navikeyResultDetails.scopeTaxonAcceptedName') }}</v-list-item-title>
                    <v-list-item-subtitle class="wrap-text">
                      {{ taxonInfo.acceptedName }}
                      </v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>
                </v-list>
                <v-list v-if="isMobile && citationInfo">
                <v-list-item v-for="(citInfo, i) in citationInfo" :key="i">
                 <v-list-item-content>
                  <v-list-item-title v-if="i===0" class="wrap-text"> {{ $t('navikeyResultDetails.scopeCitTitle') }}</v-list-item-title>
                    <v-list-item-subtitle class="wrap-text">
                       {{ citInfo.citationDescription }} <br>{{ citInfo.citationInfo }}
                      </v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    </v-card-text>
    <!-- </v-card> -->
    <v-dialog v-model="exportDialog" @click:outside="onCancelExportButtonClick()">
      <export-dialog-form v-on:onOKExportButtonClick="onOKExportButtonClick($event)" v-on:onCancelExportButtonClick="onCancelExportButtonClick()" />
    </v-dialog>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import ExportDialogForm from './ExportDialogForm.vue'
import groupingAndSorting from '../mixins/groupingAndSortingMethods'
import DivNaviKeyImageCarousel from './DivNaviKeyImageCarousel'

export default {
  name: 'NaviKeyResultDetails',
  mixins: [groupingAndSorting],
  data: () => ({
    exportDialog: false,
    panel: [0, 1],
    onboarding: 0,
    selectionDescriptorType: process.env.VUE_APP_ENUMERATION_DESCRIPTOR,
    numberDescriptorType: process.env.VUE_APP_NUMBER_DESCRIPTOR,
    textDescriptorType: process.env.VUE_APP_TEXT_DESCRIPTOR,
    exportResultDetailsFileType: process.env.VUE_APP_RESULT_DETAILS_FILETYPE,
    appVersion: process.env.VUE_APP_VERSION
  }),
  components: {
    'export-dialog-form': ExportDialogForm,
    'div-navikey-imagecarousel': DivNaviKeyImageCarousel
  },
  computed: {
    ...mapGetters(['getSelectedItemDetailsByGroup', 'getGuiColorTheme', 'getNextIDFromResultList', 'getSelectedItemScopeTaxon', 'getSelectedItemScopeCitation', 'getCurrentImagesFromMap']),
    colortheme () {
      return this.getGuiColorTheme
    },
    isMobile () {
      if (this.$vuetify.breakpoint.mobile) {
        return true
      }
      return false
    },
    itemImages () {
      if (this.$store.getters.getShowItemImagesIfAvailable) {
        let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        let valid = false
        let itimages = []
        let currentImages = this.getCurrentImagesFromMap('item', 0)
        if (currentImages && currentImages.length > 0) {
          for (let img of currentImages) {
            if (img && img.URL) {
              for (const allowed of allowedExtension) {
                if (allowed === img.Type) {
                  valid = true
                }
              }
              if (valid) {
                itimages.push(img)
              }
            }
          }
          this.resetOnboarding()
          return itimages
        }
      }
      return []
    },
    itemDetails () {
      const description = this.getSelectedItemDetailsByGroup
      // sort (group, g) in itemDetails.itemDescription
      if (description) {
        // console.log('descrip', description)
        for (let group of description.itemDescription) { //  descriptorID: descriptor.id, descriptorName: descriptor.name, descriptorType: descriptor.type, descriptorAvailability: descriptor.availability, items: descriptorStates
          group.descriptorStates.sort(this.compareValuesForSorting('order', 'descriptorName', 'asc', 'asc'))
          for (let desc of group.descriptorStates) {
            if (desc.descriptorType === this.numberDescriptorType) {
              // sort items to Min < Low < Mean < Upp < Max (TODO should be done in DB)
              let sortetQuantitativStates = this.sortDefaultQuantRange(desc.items)
              desc.items = sortetQuantitativStates
            }
          }
        }
      }
      return description
    },
    taxonInfo () {
      let taxonInfo = this.getSelectedItemScopeTaxon
      if (taxonInfo && taxonInfo.acceptedName) {
        return taxonInfo
      }
      return null
    },
    citationInfo () {
      return this.getSelectedItemScopeCitation
    },
    detailsError () {
      if (!this.itemDetails) {
        return this.$t('navikeyResultDetails.noDetailsAvailable')
      } else {
        return ''
      }
    }
  },
  methods: {
    next () {
      console.log('next')
      this.onboarding = this.onboarding + 1 === this.itemImages.length
        ? 0
        : this.onboarding + 1
    },
    prev () {
      console.log('prev')
      this.onboarding = this.onboarding - 1 < 0
        ? this.itemImages.length - 1
        : this.onboarding - 1
    },
    resetOnboarding () {
      this.onboarding = 0
    },
    async swipe (direction) {
      if (direction === 'Right') {
        await this.$store.dispatch('setPreviousItemIDOfResult')
        await this.$store.dispatch('loadItemDescriptionJson')
      }
      if (direction === 'Left') {
        await this.$store.dispatch('setNextItemIDOfResult')
        await this.$store.dispatch('loadItemDescriptionJson')
      }
    },
    sortDefaultQuantRange (quantItemArray) {
      if (quantItemArray && quantItemArray.length > 0) {
        let newQuantItemArray = []
        let min = quantItemArray.find(st => st.CS === 'Min')
        let low = quantItemArray.find(st => st.CS === 'UMethLower')
        let mean = quantItemArray.find(st => st.CS === 'Mean')
        let upp = quantItemArray.find(st => st.CS === 'UMethUpper')
        let max = quantItemArray.find(st => st.CS === 'Max')
        if (min) {
          newQuantItemArray.push(min)
        }
        if (low) {
          newQuantItemArray.push(low)
        }
        if (mean) {
          newQuantItemArray.push(mean)
        }
        if (upp) {
          newQuantItemArray.push(upp)
        }
        if (max) {
          newQuantItemArray.push(max)
        }
        if (quantItemArray.length !== newQuantItemArray.length) {
          // add all other possible quantitative CS states at the end
          for (let otherItem of quantItemArray) {
            if (!newQuantItemArray.find(testItem => testItem.CS === otherItem.CS)) {
              newQuantItemArray.push(otherItem)
            }
          }
        }
        return newQuantItemArray
      }
    },
    /**
     * Export/Save current searchcriteria as json File
     */
    onOKExportButtonClick (value) {
      const filename = value
      // get datasource license info
      let metadataInfo = null
      let ds = this.$store.getters.getDataSourceData
      let licenseURI = ''
      let licenseText = ''
      let dbName = null
      if (ds) {
        dbName = ds.displayName
        let masterInfo = this.$store.getters.getDBMasterMetadata(ds)
        if (masterInfo && masterInfo.metadata.length > 0) {
          metadataInfo = masterInfo.metadata[0]
          if (metadataInfo) {
            licenseURI = metadataInfo.LicenseURI
            licenseText = metadataInfo.LicenseText
          }
        }
      }
      if (this.itemDetails) {
        const exportData = { version: this.appVersion, type: this.exportResultDetailsFileType, db_name: dbName, license: licenseText, licenseURI: licenseURI, itemDetails: this.itemDetails, taxonInfo: this.taxonInfo, citationInfo: this.citationInfo }
        const data = JSON.stringify(exportData)
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
      this.$emit('onCloseDetailsClick')
    },
    onExportCriteriaClick () {
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
.box {
  position: relative;
}
img {
  width: auto;
  height: 100%;
  opacity: 0.6;
}
.direction {
  position: absolute;
  bottom: 10px;
  right: 19px;
  font-size: 13px;
}
.simpleAdditionalTable /deep/ .v-data-table__wrapper table tbody tr td:first-child {
  border-bottom: none !important;
}
.simpleAdditionalTable /deep/ .v-data-table__wrapper table {
  border-spacing: 0 0.5rem !important;
}
.simpleAdditionalTable /deep/ .v-data-table__wrapper table tbody tr:last-child td {
  border-bottom: 1px solid rgba(0,0,0,0.12) !important;
}
.v-expansion-panel-content /deep/ .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
