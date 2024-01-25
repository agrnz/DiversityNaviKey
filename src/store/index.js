import { createStore } from 'vuex'
import AuthService from '../service/authService'
import DataService from '../service/dataService'

const getDefaultState = () => {
  return {
    descJson: [],
    descStatesJson: [],
    descriptorTypes: [],
    mappedDescStateItems: [],
    mappedNumericalDescStateItems: [],
    mappedTextDescStateItems: [],
    itemDescriptions: [],
    itemIdNameList: [],
    itemIdNameMap: null,
    taxonScope: [],
    citationScope: [],
    restrictedDescriptors: null,
    iidDescStateMap: null,
    currentSelectedItemsList: [],
    currentSelectedNamesList: [],
    currentSelectedAsMap: null, // used for names and items
    selectedKeys: [], // keys from resultitems to get next and previous in detailes view
    userSelectionSimpleSearch: [],
    // oldUserSelectedSimpleSearch: [],
    selectedOperatorSimpleSearch: ['AND', 'OR'],
    userSearchstringExtendedSearch: [],
    currentUserSelectedDescriptor: null,
    newSelectedDescriptorState: null,
    selectedItemID: 0,
    newSearch: false,
    textDescriptorType: process.env.VUE_APP_TEXT_DESCRIPTOR
  }
}
const moduleSingleDatastore = {
  state: () => (getDefaultState()),
  getters: {
    // Array of currently matching items in format: descriptorID, stateCS, itemlist[id1,id2,]
    mappedDescStateItems: state => {
      return state.mappedDescStateItems
    },
    /**
     * Values from API .. /quantitative [{IID: , NumberValue: oder X:}]
     * @param {} state
     */
    mappedNumericalDescStateItems: state => {
      return state.mappedNumericalDescStateItems
    },
    mappedTextDescStateItems: state => {
      return state.mappedTextDescStateItems
    },
    /**
     * Array of all possible descriptor types (categorical, quantitative, text,..)
     * @param {} state
     */
    getDescriptorTypes: state => {
      return state.descriptorTypes
    },
    // list of itemids and corresponding names
    getItemIDNamesList: state => {
      // console.log('getItemIDNAmeslist', state.itemIdNameList)
      return state.itemIdNameList
    },
    getItemIDNameMap: state => {
      // console.log('getIDNAmeMap', state.itemIdNameMap)
      return state.itemIdNameMap
    },
    getIidDescStateMap: state => {
      return state.iidDescStateMap
    },
    /**
     * mappes all descriptors and states from the json files to a format used by the components
    */
    mappedDescriptors: (state) => {
      let descriptors = []
      // console.log('desc', state.descJson)
      if (state.descJson && state.descJson.length) {
        descriptors = state.descJson.map(descriptor => ({
          id: descriptor.CID,
          name: descriptor.CharName,
          type: descriptor.Subclass,
          availability: descriptor.Availability,
          unit: descriptor.Unit,
          unitIsPrefix: descriptor.UnitIsPrefix,
          order: descriptor.Order,
          images: descriptor.images,
          notes: descriptor.Notes
        })
        )
      }
      // console.log('descriptors', descriptors)
      return descriptors
    },
    mappedConstraintDescriptors: (state, getters) => {
      // current selected items
      // console.log('mapped', state.restrictedDescriptors)
      if (state.restrictedDescriptors) {
        let restdescriptors = getters.mappedDescriptors.filter(desc => state.restrictedDescriptors.has(desc.id))
        // console.log('restdescr', restdescriptors)
        return restdescriptors
      }
      // return null
      return getters.mappedDescriptors
    },
    mappedTaxonScopes: (state) => {
      let scopes = []
      let scopeMap = new Map()
      // console.log('desc', state.descJson)
      if (state.taxonScope && state.taxonScope.length > 0) {
        scopes = state.taxonScope.map(scope => ({
          iid: scope.IID,
          taxonName: scope.TaxonName,
          acceptedName: scope.AcceptedName,
          taxonNameSinAuthor: scope.TaxonNameSinAuthor,
          acceptedNameSinAuthor: scope.AcceptedNameSinAuthor
        })
        )
        for (const scopeItem of scopes) {
          scopeMap.set(scopeItem.iid, scopeItem)
        }
      }
      // console.log('descriptors', descriptors)
      return scopeMap
    },
    mappedCitationScopes: (state) => {
      let scopes = []
      // console.log('desc', state.descJson)
      if (state.citationScope && state.citationScope.length) {
        scopes = state.citationScope.map(scope => ({
          iid: scope.IID,
          description: scope.DescriptionText,
          title: scope.Title,
          authors: scope.AuthorsOrEditors,
          publisher: scope.Publisher,
          year: scope.DateYear,
          seriesTitle: scope.SeriesTitle,
          periodical: scope.Periodical,
          volume: scope.Volume,
          issue: scope.Issue,
          pages: scope.Pages
        })
        )
      }
      // console.log('descriptors', descriptors)
      return scopes
    },
    /**
     * Returns corresponding descriptor info (id, name, type)
     * @param {*} state
     * @param {*} getters
    */
    getDescriptorByID: (state, getters) => (id) => {
      const descriptorByID = getters.mappedDescriptors.filter(by => by.id === id)
      return descriptorByID[0]
    },
    /**
     * Returns the current user selected descriptor
    */
    getCurrentUserSelectedDescriptor: (state, getters) => {
      return state.currentUserSelectedDescriptor
    },
    /**
     * Returns current user selected state of the desriptor
     * @param {*} state
     * @param {*} getters
    */
    getNewSelectedDescriptorState: (state, getters) => {
      return state.newSelectedDescriptorState
    },
    /**
     * returns all states of a given descriptor -> this data is used within state.userSelection -> array for userinputs
    */
    getChildrenOfDescriptor: (state, getters) => (id) => {
      let states = []
      let desc = getters.getDescriptorByID(id)
      const descriptorStates = state.descStatesJson.filter(descriptorState => descriptorState.CID === id)
      if (descriptorStates && descriptorStates.length === 0 && desc.type === state.textDescriptorType) {
        // default dummy state e.g. for descriptors of type text (they have no data in States Table)
        states.push({
          stateID: desc.id + 'TE',
          CS: 'TE',
          csName: 'Text',
          CID: id,
          descType: desc.type,
          descName: desc.name,
          order: 1,
          images: null,
          notes: null
        })
      }
      for (const curstate of descriptorStates) {
        states.push({
          stateID: curstate.StateID,
          CS: curstate.CS,
          csName: curstate.StateName,
          CID: id,
          descType: desc.type,
          descName: desc.name,
          order: curstate.Order,
          images: curstate.images,
          notes: curstate.Notes
          // descriptorStateUserInputs: ['='] // update: functionality added to view cuomputed values
        })
      }
      return states
    },
    getChildrenOfRestDescriptor: (state, getters) => (id) => {
      let states = []
      let desc = getters.getDescriptorByID(id)
      let descriptorStates = state.descStatesJson.filter(descriptorState => descriptorState.CID === id)
      if (state.restrictedDescriptors) {
        let restState = state.restrictedDescriptors.get(id)
        // console.log('reststate', restState)
        if (restState && restState.length > 0) {
          descriptorStates = descriptorStates.filter(descState => restState.includes(descState.CS))
          // console.log('descriptorStates rest', descriptorStates)
        }
      }
      if (descriptorStates && descriptorStates.length === 0 && desc.type === state.textDescriptorType) {
        // default dummy state e.g. for descriptors of type text (they have no data in States Table)
        states.push({
          stateID: desc.id + 'TE',
          CS: 'TE',
          csName: 'Text',
          CID: id,
          descType: desc.type,
          descName: desc.name,
          order: 1,
          images: null,
          notes: null
        })
      }
      for (const curstate of descriptorStates) {
        states.push({
          stateID: curstate.StateID,
          CS: curstate.CS,
          csName: curstate.StateName,
          CID: id,
          descType: desc.type,
          descName: desc.name,
          order: curstate.Order,
          images: curstate.images,
          notes: curstate.Notes
          // descriptorStateUserInputs: ['='] // update: functionality added to view cuomputed values
        })
      }
      return states
    },
    /**
     * get all name info of itemids within startIndex and stopIndex (Descriptor search)
    */
    getMappedSelectedItems: (state, getters) => (startIndex, stopIndex) => {
      if (state.currentSelectedItemsList.length < stopIndex) {
        stopIndex = state.currentSelectedItemsList.length
      }
      let slicedFilteredItems = state.currentSelectedItemsList.slice(startIndex, stopIndex)
      // console.log('getMappedSeel', state.currentSelectedItemsList)
      // // map scopeinfos ->
      // const mappedScopeInfo = getters.mappedTaxonScopes
      // if (mappedScopeInfo && mappedScopeInfo.size > 0) {
      //   // let newItemList = []
      //   for (let sel of state.currentSelectedItemsList) {
      //     if (mappedScopeInfo.has(sel.IID)) {
      //       const taxonInfo = mappedScopeInfo.get(sel.IID)
      //       sel.scopeTaxonInfo = taxonInfo
      //     }
      //   }
      // }
      // console.log('filteredItems danach', slicedFilteredItems)
      return slicedFilteredItems
    },
    getAllResultItems: (state) => {
      if (state.currentSelectedItemsList && state.currentSelectedItemsList.length > 0) {
        return state.currentSelectedItemsList
      }
      return []
    },
    getAllResultNames: (state) => {
      if (state.currentSelectedNamesList && state.currentSelectedNamesList.length > 0) {
        return state.currentSelectedNamesList
      }
      return []
    },
    /**
     * get all name info of itemids within startIndex and stopIndex
     */
    getItemInfoByIds: (state, getters) => (filteredItemIds, startIndex, stopIndex) => {
      // console.log('getItemInfoByIds', filteredItemIds)
      if (filteredItemIds.length < stopIndex) {
        stopIndex = filteredItemIds.length
      }
      let slicedFilteredItems = filteredItemIds.slice(startIndex, stopIndex)
      // console.log('filteredItems danach', slicedFilteredItems)
      return slicedFilteredItems
    },
    /**
     * Returns Itemname of the itemID
     * @param {} state
     * @param {*} getters
     */
    getItemNameById: (state, getters) => (itemId) => {
      const tempFilterList = getters.getItemIDNamesList
      const itemName = tempFilterList.filter(tempId => tempId.IID === itemId)
      if (itemName.length > 0) {
        return itemName[0].ItemName
      }
      return ''
    },
    getCurrentImagesFromMap: (state, getters) => (imageSource, sourceId) => {
      // console.log('getCurrentImagesFromMap', imageSource)
      const deepClone = require('rfdc')()
      if (imageSource === 'item') {
        let mappedItems = getters.getItemIDNameMap
        if (mappedItems && mappedItems.has(state.selectedItemID)) {
          let clonedItemInfos = deepClone(mappedItems.get(state.selectedItemID))
          // console.log('getCurrentImagesFromMap', clonedItemInfos)
          if (clonedItemInfos && clonedItemInfos.images && clonedItemInfos.images.length > 0) {
            return clonedItemInfos.images
          } else {
            return []
          }
        }
      }
      if (imageSource === 'descriptor') {
        let descriptor = getters.getDescriptorByID(sourceId)
        console.log('descriptor', descriptor)
      }
      return []
    },
    /**
     * Gets all result names within firstIndex and secondIndex (Name Search)
     * @param {} state
     * @param {*} getters
     */
    getMappedSelectedNames: (state, getters) => (firstIndex, secondIndex) => {
      if (state.currentSelectedNamesList && state.currentSelectedNamesList.length < secondIndex) {
        secondIndex = state.currentSelectedNamesList.length
      }
      // // map scopeinfos
      // const mappedScopeInfo = getters.mappedTaxonScopes
      // if (mappedScopeInfo && mappedScopeInfo.size > 0) {
      //   // let newItemList = []
      //   for (let sel of state.currentSelectedNamesList) {
      //     if (mappedScopeInfo.has(sel.IID)) {
      //       const taxonInfo = mappedScopeInfo.get(sel.IID)
      //       sel.scopeTaxonInfo = taxonInfo
      //     }
      //   }
      // }
      // console.log('state.currentnames', state.currentSelectedNamesList)
      return state.currentSelectedNamesList.slice(firstIndex, secondIndex)
    },
    /**
     * returns currentSelectedItemsList (Descriptor Search)
    */
    getCurrentSelectedItems: (state) => {
      // list of currently selected itemIDs -> call getItemInfoByIDs to get name
      // return getters.getItemInfoByIds(state.currentSelectedItemsList)
      return state.currentSelectedItemsList
    },
    /**
     * Returns number of matches (Descriptor and Name Serach)
     * @param {} state
     */
    getNumberOfMatches: (state) => (ofItems) => {
      if (state.currentSelectedItemsList && ofItems) {
        return state.currentSelectedItemsList.length
      } else {
        if (state.currentSelectedNamesList) {
          return state.currentSelectedNamesList.length
        }
        return 0
      }
    },
    /**
     * returns all information to the current selected item by id
    */
    getSelectedItemDetails: (state) => {
      if (state.selectedItemID !== 0 && state.itemDescriptions) {
        if (state.itemDescriptions.Descriptors && state.itemDescriptions.Descriptors.length > 0) {
          if (state.itemDescriptions.Descriptors.includes('undefined') || state.itemDescriptions.Descriptors.includes(null)) {
            return {}
          }
          return state.itemDescriptions
        }
      }
      return {}
    },
    /**
     * returns all information to the current selected item sorted by group
    */
    getSelectedItemDetailsByGroup: (state, getters) => {
      let itemDescription = []
      if (state.selectedItemID !== 0 && state.itemDescriptions && state.itemDescriptions.Descriptors) {
        // if we have no descriptors, DB may deliver [null]
        if (state.itemDescriptions.Descriptors.length > 0) {
          if (state.itemDescriptions.Descriptors.includes('undefined') || state.itemDescriptions.Descriptors.includes(null)) {
            const getItemName = getters.getItemNameById(state.selectedItemID)
            const description = { itemName: getItemName, itemDescription: itemDescription }
            return description
          }
        }
        // // grouping / hierarchy
        // for (const group of getters.groupedDescriptors) {
        // const groupDescriptors = []
        // for (const descriptor of group.items) {
        //   const includedDescriptor = state.itemDescriptions.Descriptors.filter(d => d.CID === descriptor.id)
        //   // console.log('includedDescriptor', includedDescriptor)
        //   const descriptorStates = []
        //   if (includedDescriptor && includedDescriptor.length > 0) {
        //     // getName of CSState, ..
        //     for (let i = 0, j = includedDescriptor.length; i < j; i++) {
        //       const descState = [{ CID: includedDescriptor[i].CID, CS: includedDescriptor[i].CS }]
        //       // console.log('descState', descState)
        //       let stateName = getters.getStateName(descState)
        //       if (!stateName && descriptor.type === state.textDescriptorType) {
        //         stateName = ''
        //       }
        //       // map information for result-view
        //       const itemDescriptionValue = {
        //         CS: descState[0].CS,
        //         stateName: stateName,
        //         numberValue: includedDescriptor[i].X, // CHANGE API X OR NumberVALUE HERE!!   descriptorItem.numberValue oder descriptorItem.X
        //         modifier: includedDescriptor[i].Modifier,
        //         txtValue: includedDescriptor[i].TXT, // CHANGE API TXT OR TxtVALUE HERE!!   descriptorItem.txtValue oder descriptorItem.TXT
        //         notes: includedDescriptor[i].Notes
        //       }
        //       descriptorStates.push(itemDescriptionValue)
        //     }
        //     groupDescriptors.push({ descriptorID: descriptor.id, descriptorName: descriptor.name, descriptorType: descriptor.type, items: descriptorStates })
        //   }
        // }
        // itemDescription.push({ group: group.group, descriptorStates: groupDescriptors })
        let groupDescriptors = []
        let defaultgroup = 'Descriptors'
        for (const descriptor of getters.mappedDescriptors) {
          const includedDescriptor = state.itemDescriptions.Descriptors.filter(d => d.CID === descriptor.id)
          let descriptorStates = []
          if (includedDescriptor && includedDescriptor.length > 0) {
            for (let i = 0, j = includedDescriptor.length; i < j; i++) {
              const descState = [{ CID: includedDescriptor[i].CID, CS: includedDescriptor[i].CS }]
              let stateName = getters.getStateName(descState)
              if (!stateName && descriptor.type === state.textDescriptorType) {
                stateName = ''
              }
              // map information for result-view
              const itemDescriptionValue = {
                CS: descState[0].CS,
                stateName: stateName,
                numberValue: includedDescriptor[i].X, // CHANGE API X OR NumberVALUE HERE!!   descriptorItem.numberValue oder descriptorItem.X
                modifier: includedDescriptor[i].Modifier,
                txtValue: includedDescriptor[i].TXT, // CHANGE API TXT OR TxtVALUE HERE!!   descriptorItem.txtValue oder descriptorItem.TXT
                notes: includedDescriptor[i].Notes,
                unit: descriptor.unit,
                unitIsPrefix: descriptor.unitIsPrefix
              }
              descriptorStates.push(itemDescriptionValue)
              // console.log('descriptorStates', descriptorStates)
            }
            groupDescriptors.push({ descriptorID: descriptor.id, descriptorName: descriptor.name, descriptorType: descriptor.type, descriptorAvailability: descriptor.availability, items: descriptorStates })
          }
        }
        itemDescription.push({ group: defaultgroup, descriptorStates: groupDescriptors })
        const getItemName = getters.getItemNameById(state.selectedItemID)
        const description = { itemName: getItemName, itemDescription: itemDescription }
        // console.log('description', description)
        return description
      }
      // } else {
      //   return { itemName: 'Missing File', itemDescription: null }
      // }
    },
    getSelectedItemScopeTaxon: (state, getters) => {
      let taxonScope = getters.getTaxonInfos(state.selectedItemID)
      if (taxonScope) {
        return taxonScope
      }
      return null
    },
    getSelectedItemScopeCitation: (state, getters) => {
      let citations = getters.getCitationInfos(state.selectedItemID)
      if (citations && citations.length > 0) {
        let citationsArray = []
        for (const citationInfo of citations) {
          let citation
          let citationList = ''
          let citationDesc = ''
          citationInfo.description ? citationDesc = citationDesc + citationInfo.description + '; ' : citationDesc = citationDesc + ''
          citationInfo.title ? citationList = citationList + citationInfo.title + '; ' : citationList = citationList + ''
          citationInfo.authors ? citationList = citationList + citationInfo.authors + '; ' : citationList = citationList + ''
          citationInfo.publisher ? citationList = citationList + citationInfo.publisher + '; ' : citationList = citationList + ''
          citationInfo.year ? citationList = citationList + citationInfo.year + '; ' : citationList = citationList + ''
          citationInfo.seriesTitle ? citationList = citationList + citationInfo.seriesTitle + '; ' : citationList = citationList + ''
          citationInfo.periodical ? citationList = citationList + citationInfo.periodical + '; ' : citationList = citationList + ''
          citationInfo.volume ? citationList = citationList + citationInfo.volume + '; ' : citationList = citationList + ''
          citationInfo.issue ? citationList = citationList + citationInfo.issue + '; ' : citationList = citationList + ''
          citationInfo.pages ? citationList = citationList + citationInfo.pages + '; ' : citationList = citationList + ''
          // console.log('citaTION ', citation)
          if (citationList !== '' || citationDesc !== '') {
            citation = { citationDescription: citationDesc, citationInfo: citationList }
            citationsArray.push(citation)
          }
        }
        return citationsArray
      }
      return null
    },
    getTaxonInfos: (state, getters) => id => {
      if (id !== 0 && getters.mappedTaxonScopes.size > 0) {
        const iidScopes = getters.mappedTaxonScopes.get(id)
        // console.log('iidScopes', iidScopes)
        return iidScopes
      }
      return null
    },
    getCitationInfos: (state, getters) => id => {
      // console.log('getters', getters.mappedCitationScopes)
      if (id !== 0) {
        const iidScopes = getters.mappedCitationScopes.filter(d => d.iid === id)
        return iidScopes
      }
      return null
    },
    /**
     * returns the name of the state of the defined descriptor/state pair
     */
    getStateName: (state) => (descState) => {
      // TODO error handling ergebnis wenn kein match!!
      const temp = (state.descStatesJson.find(itemState => (itemState.CID === descState[0].CID && itemState.CS === descState[0].CS)))
      if (temp && temp !== 'undefined') {
        return temp.StateName
      }
      return ''
    },
    /**
     * returns currently set user selection string of descriptors and logical operators in ListSelectedDescriptorPairs.vue
     */
    getUserSearchString: (state) => {
      return state.userSelectionSimpleSearch
    },
    // getOldUserSearchString: (state) => {
    //   return state.oldUserSelectedSimpleSearch
    // },
    getUserSelectedOperator: (state) => {
      return state.selectedOperatorSimpleSearch
    },
    getUserSearchStringExtendedSearch: (state) => {
      return state.userSearchstringExtendedSearch
    },
    getNewSearch: (state) => {
      return state.newSearch
    },
    getTaxonScopeAvailable: (state) => {
      if (state.taxonScope && state.taxonScope.length > 0) {
        return true
      }
      return false
    }
  },
  mutations: {
    resetState (state) {
      console.log('resetState')
      // state = Object.assign({}, state, getDefaultState())
      Object.assign(state, getDefaultState())
    },
    setDescJson (state, apiDescriptorList) {
      // console.log('setDescJson', apiDescriptorList)
      state.descJson = apiDescriptorList
    },
    setRestrictedDescriptors (state, descRest) {
      // console.log('setRestrictedMap', descRest)
      state.restrictedDescriptors = descRest
      // state.restrictedAvailable = true
    },
    setDescStatesJson (state, descriptorStates) {
      state.descStatesJson = descriptorStates
    },
    setDescTypesJson (state, descTypes) {
      state.descriptorTypes = descTypes
    },
    setItemIds (state, itemIds) {
      state.itemIds = itemIds
    },
    // setTaxonItems (state, items) {
    //   // console.log('taxon_items', items)
    //   state.taxonItems = items
    // },
    setTaxonScope (state, scope) {
      if (scope && scope.length > 0) {
        state.taxonScope = scope
      } else {
        state.taxonScope = null
      }
    },
    // setCitationItems (state, items) {
    //   // console.log('citaiton_items', items)
    //   state.citationItems = items
    // },
    setCitationScope (state, scope) {
      // console.log('citation_scope', scope)
      state.citationScope = scope
    },
    setItemIdNamesList (state, iFilterList) {
      let mappedNameList = new Map()
      if (iFilterList) {
        for (const nameitem of iFilterList) {
          mappedNameList.set(nameitem.IID, nameitem)
        }
      }
      state.itemIdNameList = iFilterList
      state.itemIdNameMap = mappedNameList
    },
    setItemDescriptionsAPI (state, apiItemDescriptions) {
      // console.log('setItemDescriptionsAPI', apiItemDescriptions)
      if (apiItemDescriptions && apiItemDescriptions.length === 1) {
        state.itemDescriptions = apiItemDescriptions[0]
      } else {
        state.itemDescriptions = []
      }
    },
    setMappedDescStateItemsAPI (state, apiMappedStateItems) {
      // let test = apiMappedStateItems
      state.mappedDescStateItems = apiMappedStateItems
    },
    setMappedNumericalDescStateItemsAPI (state, apiMappedNumericalStateItems) {
      state.mappedNumericalDescStateItems = apiMappedNumericalStateItems
    },
    setMappedTextDescStateItemsAPI (state, apiMappedStateItems) {
      // console.log('setMappedTextDesc', apiMappedStateItems)
      state.mappedTextDescStateItems = apiMappedStateItems
    },
    setIIDDescStateMap (state, iidMap) {
      state.iidDescStateMap = iidMap
    },
    /**
     * Saves current (view) descriptor value
     * @param {} state
     * @param {*} currentDescriptor
     */
    setCurrentUserSelectedDescriptor (state, currentDescriptor) {
      state.currentUserSelectedDescriptor = currentDescriptor
    },
    /**
     * Saves the current user selection to state parameter userSelection, thus all other components using this info will be informed (reactive)
     * The param selectedCriterias is the current selected subset of mappedDescriptors.children,  by user, including:
     *    stateID: ,stateCS:, csName: , descID:, descriptorStateUserInputs:
     * @param {*} state
     * @param {*} selectedCriterias
     */
    setSelectedDescriptors (state, selectedCriterias) {
      // console.log('setSeelcteDescr', selectedCriterias)
      state.userSelectionSimpleSearch = selectedCriterias
    },
    // setOldSelectedDescriptors (state, oldSelectedCriteria) {
    //   state.oldUserSelectedSimpleSearch = oldSelectedCriteria
    // },
    setSelectedOperator (state, selectedOperators) {
      state.selectedOperatorSimpleSearch = selectedOperators
    },
    setSearchstringExtendedSearch (state, searchstring) {
      state.userSearchstringExtendedSearch = searchstring
    },
    // csName:, descID, descriptorStateUserInputs, stateCS, stateID
    setNewSelectedDescriptorState (state, selectedDescState) {
      // console.log('newSelectedDescriptorSTate: ', selectedDescState)
      state.newSelectedDescriptorState = selectedDescState
    },
    /**
     * Currently not in use
     * @param {} state
     * @param {*} selectedDescriptor
     */
    addSelectedDescriptor (state, selectedDescriptor) {
      state.userSelectionSimpleSearch.push(selectedDescriptor)
    },
    /**
     * Gets and sets all items matching the current selected criteria
     * @param {*} state
     * @param filteredItems selectedItems
     */
    setSelectedItems (state, filteredItems) {
      // console.log('set state.currentSelectedItemsList ' + filteredItems)
      state.currentSelectedItemsList = filteredItems
      state.newSearch = true
    },
    setSelectedNames (state, filteredNames) {
      state.currentSelectedNamesList = filteredNames
      state.newSearch = true
    },
    setSelectedAsMap (state, filteredItemsMap) {
      state.currentSelectedAsMap = filteredItemsMap
      filteredItemsMap ? state.selectedKeys = [ ...state.currentSelectedAsMap.keys() ] : state.selectedKeys = []
      // state.selectedKeys = [ ...state.currentSelectedAsMap.keys() ]
    },
    /**
     * Sets the current active item identifier
     * @param {*} state
     * @param {*} itemID
     */
    setSelectedItemID (state, itemID) {
      // console.log('set selected item id', itemID)
      state.selectedItemID = itemID
    },
    // setSimpleSearchDescriptorMode (state, simpleMode) {
    //   state.simpleSearchDescriptorMode = simpleMode
    // },
    setNewSearch (state, value) {
      state.newSearch = value
    }
  },
  actions: {
    async resetState ({ commit }) {
      commit('resetState')
    },
    async resetAllUserData ({ commit, dispatch }) {
      console.log('reset user data')
      /// console.log('datasourceid?', state.currentDatasourceId)
      // reset all result values
      dispatch('passSelectedItems', { filteredItems: [], resetResult: true })
      dispatch('passSelectedNames', { filteredNames: [], resetResult: true })
      // commit('setSelectedItems', []) // state.currentSelectedItemsList = []
      // commit('setSelectedNames', []) // state.currentSelectedNamesList = []
      commit('setSelectedDescriptors', []) // state.userSelection = []
      // commit('setOldSelectedDescriptors', [])
      commit('setSelectedOperator', ['AND', 'OR'])
      commit('setSearchstringExtendedSearch', [])
      commit('setNewSelectedDescriptorState', null) // state.newSelectedDescriptorState = null
      commit('setSelectedItemID', 0) // state.selectedItemID = 0
      commit('setCurrentUserSelectedDescriptor', null) // state.currentUserSelectedDescriptor = null
    },
    async resetForExpertMode ({ commit, dispatch }) {
      console.log('reset for expert mode')
      // reset all result values
      dispatch('passSelectedItems', { filteredItems: [], resetResult: true })
      dispatch('passSelectedNames', { filteredNames: [], resetResult: true })
      commit('setSearchstringExtendedSearch', [])
      commit('setNewSelectedDescriptorState', null) // state.newSelectedDescriptorState = null
      commit('setSelectedItemID', 0) // state.selectedItemID = 0
      commit('setCurrentUserSelectedDescriptor', null) // state.currentUserSelectedDescriptor = null
    },
    mapNameScopeToItemList ({ getters, commit }) {
      let tempFilterMap = getters.getItemIDNameMap
      let nameScopeMap = getters.mappedTaxonScopes
      if (tempFilterMap && nameScopeMap && nameScopeMap.size > 0) {
        for (let tfmi of tempFilterMap.values()) {
          if (tfmi) {
            tfmi.scopeTaxonInfo = []
            if (nameScopeMap && nameScopeMap.has(tfmi.IID)) {
              tfmi.scopeTaxonInfo.push(nameScopeMap.get(tfmi.IID))
            }
            tempFilterMap.set(tfmi.IID, tfmi)
          }
        }
      }
      // change ItemIDNameList
      let newList = Array.from(tempFilterMap.values())
      commit('setItemIdNamesList', newList)
    },
    mapCIDCStoIID ({ getters, commit }) {
      // console.log('mapCIDCStoIID')
      let tempFilterList = getters.getItemIDNameMap
      if (tempFilterList) {
        let allCategoricalsList = getters.mappedDescStateItems
        let allQuantitativsList = getters.mappedNumericalDescStateItems
        let allTextList = getters.mappedTextDescStateItems
        // let timebefore = Date.now()
        let iidCIDCSMap = new Map()
        if (allCategoricalsList) {
          for (let catDescState of allCategoricalsList) {
            for (const ite of catDescState.ItemList) {
              let itemInMap = iidCIDCSMap.has(ite.IID)
              if (itemInMap) {
                let mapValue = iidCIDCSMap.get(ite.IID)
                mapValue.push({ CID: catDescState.CID, CS: catDescState.CS })
                iidCIDCSMap.set(ite.IID, mapValue)
              } else {
                iidCIDCSMap.set(ite.IID, [{ CID: catDescState.CID, CS: catDescState.CS }])
              }
            }
          }
        }
        if (allQuantitativsList) {
          for (let quanDescState of allQuantitativsList) {
            for (const ite of quanDescState.ItemList) {
              let itemInMap = iidCIDCSMap.has(ite.IID)
              if (itemInMap) {
                let mapValue = iidCIDCSMap.get(ite.IID)
                mapValue.push({ CID: quanDescState.CID, CS: quanDescState.CS })
                iidCIDCSMap.set(ite.IID, mapValue)
              } else {
                iidCIDCSMap.set(ite.IID, [{ CID: quanDescState.CID, CS: quanDescState.CS }])
              }
            }
          }
        }
        if (allTextList) {
          for (let txtDescState of allTextList) {
            for (const ite of txtDescState.ItemList) {
              // add to iidmap
              let itemInMap = iidCIDCSMap.has(ite.IID)
              if (itemInMap) {
                let mapValue = iidCIDCSMap.get(ite.IID)
                mapValue.push({ CID: txtDescState.CID, CS: txtDescState.CS })
                iidCIDCSMap.set(ite.IID, mapValue)
              } else {
                iidCIDCSMap.set(ite.IID, [{ CID: txtDescState.CID, CS: txtDescState.CS }])
              }
            }
          }
        }
        // let timeafter = Date.now()
        commit('setIIDDescStateMap', iidCIDCSMap)
        // console.log('mapCIDCStoIID', iidCIDCSMap)
        // console.log('duration of mapping(ms): ', timeafter - timebefore)
      } else {
        console.log('Error: NameMap is null??')
      }
    },
    sortItemNameList ({ getters, rootGetters, commit }) {
      // console.log('mapped', mappedNameList)
      let sortDefault = true
      // sort per acceptedName
      if (rootGetters.getUseTaxonScope && getters.getTaxonScopeAvailable) {
        sortDefault = false
      }
      if (getters.getItemIDNamesList && sortDefault) {
        const deepClone = require('rfdc')()
        let sortedList = deepClone(getters.getItemIDNamesList)
        // console.log('sortedList', sortedList)
        sortedList.sort((a, b) => {
          // if (a.DisplayName && b.DisplayName) {
          const comparison = a.ItemName.localeCompare(b.ItemName)
          return comparison
          // }
        })
        commit('setItemIdNamesList', sortedList)
      }
      if (getters.getItemIDNamesList && !sortDefault) {
        const deepClone = require('rfdc')()
        let sortedList = deepClone(getters.getItemIDNamesList)
        sortedList.sort((a, b) => {
          if (a.scopeTaxonInfo && b.scopeTaxonInfo) {
            // if (a.scopeTaxonInfo.length > 0 && b.scopeTaxonInfo.length > 0) {
            let sortA
            let sortB
            if (a.scopeTaxonInfo.length === 0 || (a.scopeTaxonInfo.length > 0 && !a.scopeTaxonInfo[0].acceptedName)) {
              sortA = a.ItemName
            } else {
              sortA = a.scopeTaxonInfo[0].acceptedName
            }
            if (b.scopeTaxonInfo.length === 0 || (b.scopeTaxonInfo.length > 0 && !b.scopeTaxonInfo[0].acceptedName)) {
              sortB = b.ItemName
            } else {
              sortB = b.scopeTaxonInfo[0].acceptedName
            }
            const comparison = sortA.localeCompare(sortB)
            return comparison
            // } else {
            //   console.log('here', a)
            //   console.log('here', b)
            // }
          } else {
            const comparison = a.ItemName.localeCompare(b.ItemName)
            return comparison
          }
        })
        commit('setItemIdNamesList', sortedList)
      }
    },
    /**
     * Load all descriptors data from API or IndexedDB as json data
     * @param {} param0 commit param to send to mutations method
     */
    async loadDescJson ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_DESCRIPTORS_LIST // only relative url part of descriptors_list json file
      // console.log('rootGetters.getDataSourceData', rootGetters.getDataSourceData)
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: false, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setDescJson', reactive: true })
      } else {
        console.log('<loadDescJson> no datasource available??')
      }
    },
    /**
     * Load all descriptor-states data from API or IndexedDB as json data
     * @param {*} param0
     */
    async loadDescStatesJson ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_DESCRIPTORS_STATES_LIST // only url part of descriptors_list json file
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: false, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setDescStatesJson', reactive: true })
      } else {
        console.log('<loadDescStatesJson> no datasource available??')
      }
    },
    async loadDescirptorTypesJson ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_DESCRIPTOR_TYPES
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: false, urlString: urlString, params: null, commitMethod: 'setDescTypesJson', reactive: true })
      } else {
        console.log('<loadDescirptorTypesJson> no datasource available??')
      }
    },
    /**
     * Load a list of all categorical descriptors with all ItemIds
     * @param {} param0
     */
    async loadMappedDescriptorStateItemIds ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_MAPPED_DESCRIPTOR_STATE_ITEMIDS // only url part of descriptors_list json file
      // set optional true, if dataset has no categorical descriptors
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: true, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setMappedDescStateItemsAPI', reactive: false })
      } else {
        console.log('<loadMappedDescriptorStateItemIds> no datasource available??')
      }
    },
    /**
     * Load a list of all numerical descriptors with all ItemIds and number values
     * @param {} param0
    */
    async loadMappedNumericalDescriptorStateItemIds ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_MAPPED_NUMERICAL_DESCRIPTOR_STATE_ITEMIDS // only url part of descriptors_list json file
      // set optional true, if dataset has no numerical/quantitative descriptors
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: true, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setMappedNumericalDescStateItemsAPI', reactive: false })
      } else {
        console.log('<loadMappedNumericalDescriptorStateItemIds> no datasource available??')
      }
    },
    /**
     * Load a list of all itemIds with their names
     * @param {} param0
     */
    async loadItemIdNameList ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_ITEMIDLIST // only url part of descriptors_list json file
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: false, urlString: urlString, params: { page: 1, pagesize: 12000 }, commitMethod: 'setItemIdNamesList', reactive: false })
      } else {
        console.log('<loadItemIdNameList> no datasource available??')
      }
    },
    async loadMappedTextDescriptorStateItemIds ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_MAPPED_TEXT_DESCRIPTOR_STATE_ITEMIDS
      // set optional true, if dataset has no textual descriptors
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: true, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setMappedTextDescStateItemsAPI', reactive: false })
      } else {
        console.log('<loadMappedTextDescriptorStateItemIds> no datasource available??')
      }
    },
    async loadTaxonScope ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_TAXON_SCOPE
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: true, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setTaxonScope', reactive: false })
      } else {
        console.log('<lloadTaxonScope> no datasource available??')
      }
    },
    // async loadTaxonItems ({ dispatch, rootGetters }) {
    //   let urlString = process.env.VUE_APP_TAXON_ITEMS
    //   if (rootGetters.getDataSourceData) {
    //     await dispatch('getApiData', { urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setTaxonItems', reactive: false })
    //   } else {
    //     console.log('<loadTaxonItems> no datasource available??')
    //   }
    // },
    async loadCitationScope ({ dispatch, rootGetters }) {
      let urlString = process.env.VUE_APP_CITATION_SCOPE
      if (rootGetters.getDataSourceData) {
        await dispatch('getApiData', { optional: true, urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setCitationScope', reactive: false })
      } else {
        console.log('<loadCitationScope> no datasource available??')
      }
    },
    // async loadCitationItems ({ dispatch, rootGetters }) {
    //   let urlString = process.env.VUE_APP_CITATION_ITEMS
    //   if (rootGetters.getDataSourceData) {
    //     await dispatch('getApiData', { urlString: urlString, params: { page: 1, pagesize: 5000 }, commitMethod: 'setCitationItems', reactive: false })
    //   } else {
    //     console.log('<loadCitationItems> no datasource available??')
    //   }
    // },
    async loadItemDescriptionJson ({ dispatch, state, rootGetters }) {
      if (state.selectedItemID) {
        let urlString = process.env.VUE_APP_ITEM_DESCRIPTION
        if (rootGetters.getDataSourceData) {
          await dispatch('getApiData', { optional: false, urlString: urlString, appendUrl: state.selectedItemID, params: { page: 1, pagesize: 5000 }, commitMethod: 'setItemDescriptionsAPI', reactive: true })
        } else {
          console.log('<loadItemDescriptonJson> no datasource available??')
        }
      } else {
        console.log('<loadItemDescriptionJson> No Item selected')
      }
    },
    /**
     * Saves the user selected descriptor (without state value!) value
     * @param {*} param0
     * @param {*} currentDescriptor
     */
    passCurrentUserSelectedDescriptor ({ commit }, currentDescriptor) {
      commit('setCurrentUserSelectedDescriptor', currentDescriptor)
    },
    /**
     * If user selection criteria changes within a component, this action will be called via $store.dispatch
     * @param {*} param0
     * @param {*} selectedDescriptors
     */
    passUserSelectedDescriptors ({ commit }, selectedDescriptors) {
      // console.log('passUserSelectedDescriptors', selectedDescriptors)
      commit('setSelectedDescriptors', selectedDescriptors)
    },
    // passOldUserSelectedDescriptors ({ commit }, oldDescriptors) {
    //   commit('setOldSelectedDescriptors', oldDescriptors)
    // },
    passUserSelectedOperator ({ commit }, selectedOperator) {
      commit('setSelectedOperator', selectedOperator)
    },
    passSearchstringExtendedSearch ({ commit }, searchstring) {
      commit('setSearchstringExtendedSearch', searchstring)
    },
    passNewUserSelectedDescriptorState ({ commit }, newDescState) {
      commit('setNewSelectedDescriptorState', newDescState)
    },
    passSelectedItems ({ commit, getters, rootGetters, state }, { filteredItems, resetResult }) {
      // console.log('passSelectedItems', filteredItems)
      // console.log('reset', resetResult)
      let filteredItemsMap = new Map()
      let mappedFiltedItems = []
      // console.log('filteredIUtems', filteredItems)
      // sort criteria
      let sortDefault = true
      if (rootGetters.getUseTaxonScope) {
        sortDefault = false
      }
      if (!filteredItems && getters.getAllResultItems && getters.getAllResultItems.length > 0) {
        filteredItems = getters.getAllResultItems
      }
      // console.log('filteredItems', filteredItems)
      if (filteredItems && filteredItems.length > 0 && !resetResult) {
        let tempFilterItemMap = getters.getItemIDNameMap
        // console.log('tempFilterItemMap', tempFilterItemMap)
        for (let fiItem of filteredItems) {
          if (tempFilterItemMap.has(fiItem.IID)) {
            mappedFiltedItems.push(tempFilterItemMap.get(fiItem.IID))
          }
        }
        // console.log('mapped', mappedFiltedItems)
        if (sortDefault) {
          mappedFiltedItems.sort((a, b) => {
            const comparison = a.ItemName.localeCompare(b.ItemName)
            return comparison
          })
        } else {
          mappedFiltedItems.sort((a, b) => {
            if (a.scopeTaxonInfo && b.scopeTaxonInfo) {
              // if (a.scopeTaxonInfo.length > 0 && b.scopeTaxonInfo.length > 0) {
              let sortA
              let sortB
              if (a.scopeTaxonInfo.length === 0 || (a.scopeTaxonInfo.length > 0 && !a.scopeTaxonInfo[0].acceptedName)) {
                sortA = a.ItemName
              } else {
                sortA = a.scopeTaxonInfo[0].acceptedName
              }
              if (b.scopeTaxonInfo.length === 0 || (b.scopeTaxonInfo.length > 0 && !b.scopeTaxonInfo[0].acceptedName)) {
                sortB = b.ItemName
              } else {
                sortB = b.scopeTaxonInfo[0].acceptedName
              }
              const comparison = sortA.localeCompare(sortB)
              return comparison
              // } else {
              //   console.log('here', a)
              //   console.log('here', b)
              // }
            } else {
              const comparison = a.ItemName.localeCompare(b.ItemName)
              return comparison
            }
            // if (a.scopeTaxonInfo && b.scopeTaxonInfo) {
            //   if (a.scopeTaxonInfo.length > 0 && b.scopeTaxonInfo.length > 0) {
            //     let sortA
            //     let sortB
            //     a.scopeTaxonInfo[0].acceptedName ? sortA = a.scopeTaxonInfo[0].acceptedName : sortA = a.ItemName
            //     b.scopeTaxonInfo[0].acceptedName ? sortB = b.scopeTaxonInfo[0].acceptedName : sortB = b.ItemName
            //     const comparison = sortA.localeCompare(sortB)
            //     return comparison
            //   }
            // } else {
            //   const comparison = a.ItemName.localeCompare(b.ItemName)
            //   return comparison
            // }
          })
        }
        for (let matchedItem of mappedFiltedItems) {
          filteredItemsMap.set(matchedItem.IID, matchedItem)
        }
      } else {
        // if (!filteredItems) {
        // initial load all items as result
        if (resetResult) {
          if (getters.getItemIDNamesList) {
            mappedFiltedItems = getters.getItemIDNamesList
            filteredItemsMap = getters.getItemIDNameMap
          }
        }
      }
      // let timeafter = Date.now()
      // console.log('duration of sorting (ms): ', timeafter - timebefore)
      commit('setSelectedItems', mappedFiltedItems)
      commit('setSelectedAsMap', filteredItemsMap)
      // restrict descriptor and state selection in quick search if enabled
      if (rootGetters.getUseRestrictFilter && !rootGetters.getExpertViewMode && rootGetters.isCurrentSearchDescriptorMode && mappedFiltedItems) {
        // console.log('set restricted')
        let restrictedDescs = new Map()
        let iidMap = getters.getIidDescStateMap
        for (const matchedItem of mappedFiltedItems) {
          let itemDescs = iidMap.get(matchedItem.IID)
          if (itemDescs) {
            for (const descCS of itemDescs) {
              let testDC = restrictedDescs.has(descCS.CID)
              if (testDC) {
                let dc = restrictedDescs.get(descCS.CID)
                if (!dc.includes(descCS.CS)) {
                  dc.push(descCS.CS)
                }
                restrictedDescs.set(descCS.CID, dc)
              } else {
                restrictedDescs.set(descCS.CID, [descCS.CS])
              }
            }
          }
        }
        let toDelete = []
        // check if only single state left, than delete this descriptor as well
        for (let checkForSingles of restrictedDescs) {
          if (checkForSingles && checkForSingles.length === 2) {
            if (checkForSingles[1].length === 1) {
              // only single state left, check if categorical type then delete
              let isCatId = getters.mappedDescStateItems.filter(catDesc => catDesc.CID === checkForSingles[0])
              if (isCatId && isCatId.length > 0) {
                toDelete.push(checkForSingles[0])
              }
            }
          }
        }
        for (let descToDel of toDelete) {
          if (restrictedDescs.has(descToDel)) {
            restrictedDescs.delete(descToDel)
          }
        }
        // console.log('restrictedDescs', restrictedDescs)
        commit('setRestrictedDescriptors', restrictedDescs)
      } else {
        if (mappedFiltedItems && resetResult) {
          // console.log('restrict descriptors list once to eliminate nulls ')
          let restrictedDescKeys = new Map()
          let iidMap = getters.getIidDescStateMap
          for (const matchedItem of mappedFiltedItems) {
            let itemDescs = iidMap.get(matchedItem.IID)
            if (itemDescs) {
              for (const descCS of itemDescs) {
                restrictedDescKeys.set(descCS.CID, descCS)
              }
            }
          }
          let descKeys = [ ...restrictedDescKeys.keys() ]
          let tempDesc = state.descJson.filter(desc => descKeys.includes(desc.CID))
          // console.log('tempDesc', tempDesc)
          commit('setDescJson', tempDesc)
        }
      }
    },
    passSelectedNames ({ commit, getters, rootGetters }, { filteredNames, resetResult }) {
      // console.log('resetResult', resetResult)
      let filteredItemsMap = new Map()
      let mappedFiltedNames = []
      let sortDefault = true
      if (rootGetters.getUseTaxonScope) {
        sortDefault = false
      }
      if (!filteredNames && getters.getAllResultNames && getters.getAllResultNames.length > 0) {
        filteredNames = getters.getAllResultNames
      }
      if (filteredNames && filteredNames.length > 0 && !resetResult) {
        let tempFilterItemMap = getters.getItemIDNameMap
        // console.log('tempFilterItemMap', tempFilterItemMap)
        for (let fiItem of filteredNames) {
          if (tempFilterItemMap.has(fiItem.IID)) {
            mappedFiltedNames.push(tempFilterItemMap.get(fiItem.IID))
          }
        }
        // console.log('mapped', mappedFiltedNames)
        if (sortDefault) {
          mappedFiltedNames.sort((a, b) => {
            const comparison = a.ItemName.localeCompare(b.ItemName)
            return comparison
            //  return ((order === 'desc') ? (comparison * -1) : comparison)
            // let fa = a.ItemName.toUpperCase()
            // let fb = b.ItemName.toUpperCase()
            // if (fa < fb) {
            //   return -1
            // }
            // if (fa > fb) {
            //   return 1
            // }
            // return 0
          })
        } else {
          // console.log('sort accepted')
          mappedFiltedNames.sort((a, b) => {
            if (a.scopeTaxonInfo && b.scopeTaxonInfo) {
              // if (a.scopeTaxonInfo.length > 0 && b.scopeTaxonInfo.length > 0) {
              let sortA
              let sortB
              if (a.scopeTaxonInfo.length === 0 || (a.scopeTaxonInfo.length > 0 && !a.scopeTaxonInfo[0].acceptedName)) {
                sortA = a.ItemName
              } else {
                sortA = a.scopeTaxonInfo[0].acceptedName
              }
              if (b.scopeTaxonInfo.length === 0 || (b.scopeTaxonInfo.length > 0 && !b.scopeTaxonInfo[0].acceptedName)) {
                sortB = b.ItemName
              } else {
                sortB = b.scopeTaxonInfo[0].acceptedName
              }
              const comparison = sortA.localeCompare(sortB)
              return comparison
              // } else {
              //   console.log('here', a)
              //   console.log('here', b)
              // }
            } else {
              const comparison = a.ItemName.localeCompare(b.ItemName)
              return comparison
            }
            // if (a.scopeTaxonInfo && b.scopeTaxonInfo) {
            //   if (a.scopeTaxonInfo.length > 0 && b.scopeTaxonInfo.length > 0) {
            //     let sortA
            //     let sortB
            //     a.scopeTaxonInfo[0].acceptedName ? sortA = a.scopeTaxonInfo[0].acceptedName : sortA = a.ItemName
            //     b.scopeTaxonInfo[0].acceptedName ? sortB = b.scopeTaxonInfo[0].acceptedName : sortB = b.ItemName
            //     const comparison = sortA.localeCompare(sortB)
            //     return comparison
            //   }
            // } else {
            //   const comparison = a.ItemName.localeCompare(b.ItemName)
            //   return comparison
            // }
          })
        }
        for (let matchedItem of mappedFiltedNames) {
          filteredItemsMap.set(matchedItem.IID, matchedItem)
        }
      } else {
        // initial load all items as result
        if (resetResult) {
          if (getters.getItemIDNamesList) {
            mappedFiltedNames = getters.getItemIDNamesList
            filteredItemsMap = getters.getItemIDNameMap
          }
        }
      }
      commit('setSelectedNames', mappedFiltedNames)
      commit('setSelectedAsMap', filteredItemsMap)
    },
    /**
     * Sets the current selected item identifier for the details view - via $store.dispatch
     * @param {*} param0
     * @param {*} itemID
     */
    passSelectedItemID ({ commit }, itemID) {
      commit('setSelectedItemID', itemID)
    },
    async setNextItemIDOfResult ({ commit, dispatch, state }) {
      // const currentItem = state.selectedItemID
      if (state.selectedKeys && state.selectedKeys.length > 0) {
        let currentItemIndex = state.selectedKeys.indexOf(state.selectedItemID)
        let next = null
        state.selectedKeys.length > currentItemIndex + 1 ? next = state.selectedKeys[currentItemIndex + 1] : next = state.selectedKeys[currentItemIndex]
        commit('setSelectedItemID', next)
        await dispatch('loadItemDescriptionJson')
      }
    },
    async setPreviousItemIDOfResult ({ commit, dispatch, state }) {
      // const currentItem = state.selectedItemID
      if (state.selectedKeys && state.selectedKeys.length > 0) {
        let currentItemIndex = state.selectedKeys.indexOf(state.selectedItemID)
        let prev = null
        currentItemIndex > 0 ? prev = state.selectedKeys[currentItemIndex - 1] : prev = state.selectedKeys[currentItemIndex]
        commit('setSelectedItemID', prev)
        await dispatch('loadItemDescriptionJson')
      }
    },
    passNewSearch ({ commit }, value) {
      commit('setNewSearch', value)
    }
  }
}

const rootModule = {
  root: true,
  state: {
    datasources: [],
    masterDatasources: [],
    loadedAllDatasources: false,
    mastersMetadata: [],
    defaultDatasourceId: null,
    currentDatasourceId: null,
    synchronizeDatasourceLanguage: true,
    datasourceData: null,
    apiLoading: false,
    apiErrored: false,
    indexedDBError: false,
    isCategoricalToleranceMode: false,
    isPositiveCategoricalToleranceMode: false,
    isQuantitativeToleranceMode: false,
    numFilterIncludeExtremeValues: true,
    expertViewMode: false,
    isCurrentSearchDescriptorMode: true,
    noDatasourceInfoDialog: false,
    useRestrictFilter: true,
    restrictFilterPossible: true,
    switchType: 'text',
    resultsPerPageSetting: 50,
    useTaxonScope: true,
    useTaxonSinAuthors: false,
    showDescriptorStateImagesIfAvailable: false,
    showItemImagesIfAvailable: false,
    userLoggedIn: false,
    userName: '',
    userLoginExpired: false,
    isNewVersionObject: { 'isNewAppVersion': false, 'isNewRestVersion': false },
    sortSettings: { 'descriptors': { 'key1': 'order', 'order1': 'asc', 'key2': 'name', 'order2': 'asc' }, 'states': { 'key1': 'order', 'order1': 'asc', 'key2': 'csName', 'order2': 'asc' } },
    appLanguage: { 'key': 'en', 'languageText': 'settings.en' },
    loadingMode: { 'key': 'cacheFirst', 'loadingText': 'Offline first mode: Try to get data from cache, otherwise online', 'shortText': 'settings.shortCacheFirst' },
    guiColorTheme: { 'key': 'indigo', 'colorlabel': 'settings.indigoColorTheme', 'color': 'grey lighten-4 indigo--text text--darken-3', 'toolbarcolor': 'indigo lighten-2', 'colordarken': 'grey lighten-2 indigo--text text--darken-3', 'colortext': 'indigo darken-3', 'darktext': 'indigo darken-3', 'greyText': 'grey lighten-4 grey--text text--darken-2' }
  },
  getters: {
    getApiLoading: state => {
      return state.apiLoading
    },
    getApiErrored: state => {
      return state.apiErrored
    },
    getIndexedDBError: state => {
      return state.indexedDBError
    },
    getAvailableDatasources: state => {
      return state.datasources
    },
    getMasterDatasources: state => {
      return state.masterDatasources
    },
    getAvailabelSchemesOfMaster: (state, getters) => (master) => {
      let allDBs = getters.getAvailableDatasources
      if (allDBs) {
        // console.log('allDBs', allDBs)
        let filtered = allDBs.filter(m => m.scheme_master === master.scheme_master && m.ds_name === master.ds_name)
        return filtered
      }
      return null
    },
    getDataSourceInfoById: (state, getters) => (id) => {
      let allDbs = getters.getAvailableDatasources
      if (allDbs) {
        let infoDB = allDbs.filter(m => m.id === id)
        return infoDB
      }
      return null
    },
    getMasterDataSourceInfo: (state, getters) => (ds) => {
      // console.log('get', ds)
      let mastername = ds.ds_name + '_' + ds.scheme_master
      let info = getters.getMasterDatasources.filter(mas => mas.id === mastername)
      if (info && info.length > 0) {
        return info[0]
      }
      return null
    },
    /**
     * Returns current active datasource or null if nothing is loaded
     * @param {} state
     */
    getCurrentDatasourceID: state => {
      return state.currentDatasourceId
    },
    getDataSourceData: state => {
      return state.datasourceData
    },
    getIsCategoricalToleranceMode: (state) => {
      return state.isCategoricalToleranceMode
    },
    getIsPositiveCategoricalToleranceMode: (state) => {
      return state.isPositiveCategoricalToleranceMode
    },
    isQuantitativeToleranceMode: (state) => {
      return state.isQuantitativeToleranceMode
    },
    getNumFilterIncludeExtremeValues: (state) => {
      return state.numFilterIncludeExtremeValues
    },
    getCurrentLoadMode: (state) => {
      return state.loadingMode
    },
    getGuiColorTheme: (state) => {
      return state.guiColorTheme
    },
    getCurrentLanguage: (state) => {
      return state.appLanguage
    },
    getSwitchType: (state) => {
      return state.switchType
    },
    getNoDatascourceInfoDialog: (state) => {
      return state.noDatasourceInfoDialog
    },
    getLoadedAllDatasources: (state) => {
      return state.loadedAllDatasources
    },
    getDefaultDatasourceId: (state) => {
      return state.defaultDatasourceId
    },
    getSynchronizeDatasourceLanguage: (state) => {
      return state.synchronizeDatasourceLanguage
    },
    /**
    * Returns true if user selects descriptor search in SelectDescriptoSearchView.vue
    * and false if user selects name search
    * @param {} state
    */
    isCurrentSearchDescriptorMode: state => {
      return state.isCurrentSearchDescriptorMode
    },
    /**
     * returns current mode for search view (simple vs. extended search)
     */
    getExpertViewMode: (state) => {
      return state.expertViewMode
    },
    getUseRestrictFilter: (state) => {
      // console.log('state', state.useRestrictFilter)
      return state.useRestrictFilter
    },
    getRestrictFilterPossible: (state) => {
      return state.restrictFilterPossible
    },
    getResultsPerPageSetting: (state) => {
      return state.resultsPerPageSetting
    },
    getSortSettings: (state) => {
      return state.sortSettings
    },
    getUseTaxonScope: (state) => {
      return state.useTaxonScope
    },
    getUseTaxonSinAuthors: (state) => {
      return state.useTaxonSinAuthors
    },
    getShowDescriptorStateImagesIfAvailable: (state) => {
      return state.showDescriptorStateImagesIfAvailable
    },
    getShowItemImagesIfAvailable: (state) => {
      return state.showItemImagesIfAvailable
    },
    getIsNewAppVersion: (state) => {
      return state.isNewVersionObject.isNewAppVersion
    },
    getIsNewRestVersion: (state) => {
      return state.isNewVersionObject.isNewRestVersion
    },
    getDBMasterMetadata: (state, getters) => (ds) => {
      // console.log('get', ds)
      let mastername = ds.ds_name + '_' + ds.scheme_master
      let info = state.mastersMetaData.filter(mas => mas.id === mastername)
      if (info && info.length > 0) {
        return info[0]
      }
      return null
    },
    getUserLoggedInStatus: (state) => {
      return state.userLoggedIn
    },
    getUserLoginName: (state) => {
      return state.userName
    },
    getUserLoginExpired: (state) => {
      return state.userLoginExpired
    }
  },
  mutations: {
    setAllAvailableDatasources (state, availableDatasources) {
      availableDatasources ? state.datasources = availableDatasources : state.datasources = []
    },
    setMasterDatasources (state, masterDatasources) {
      masterDatasources ? state.masterDatasources = masterDatasources : state.masterDatasources = []
      // console.log('set master data', state.masterDatasources)
      // state.masterDatasources = masterDatasources
    },
    setMastersMetaData (state, mastersMetaData) {
      // console.log('set', mastersMetaData)
      // mastersMetaData ? state.mastersMetadata = mastersMetaData : state.mastersMetadata = []
      if (mastersMetaData) {
        state.mastersMetaData = mastersMetaData
      } else {
        state.mastersMetaData = []
      }
      // console.log('set', state.mastersMetaData)
      // state.mastersMetadata = mastersMetaData
    },
    setDefaultDatasource (state, defaultID) {
      // console.log('setDefaultID', defaultID)
      state.defaultDatasourceId = defaultID
    },
    setDatasource (state, passedDatasourceID) {
      console.log('setDatasource')
      state.currentDatasourceId = passedDatasourceID
      if (state.datasources && state.currentDatasourceId) {
        const tempdatasourceArray = state.datasources.filter(datasrcItem => datasrcItem.id === state.currentDatasourceId)
        if (tempdatasourceArray && tempdatasourceArray.length > 0) {
          state.datasourceData = tempdatasourceArray[0]
        } else {
          state.datasourceData = null
          state.currentDatasourceId = null
        }
      } else {
        state.datasourceData = null
        state.currentDatasourceId = null
      }
      // console.log('state.datasourcData', state.datasourceData)
    },
    setApiLoading (state, loading) {
      state.apiLoading = loading
    },
    setApiErrored (state, error) {
      state.apiErrored = error
    },
    setIndexedDBError (state, error) {
      state.indexedDBError = error
    },
    setIsCategoricalToleranceMode (state, tolerance) {
      state.isCategoricalToleranceMode = tolerance
    },
    setIsPositiveCategoricalToleranceMode (state, tolerance) {
      state.isPositiveCategoricalToleranceMode = tolerance
    },
    setIsQuantitativeToleranceMode (state, tolerance) {
      state.isQuantitativeToleranceMode = tolerance
    },
    setNumFilterIncludeExtremeValues (state, extemeValues) {
      state.numFilterIncludeExtremeValues = extemeValues
    },
    setCurrentLoadMode (state, mode) {
      state.loadingMode = mode
    },
    setGuiColorTheme (state, colorTheme) {
      state.guiColorTheme = colorTheme
    },
    setCurrentLanguage (state, lang) {
      state.appLanguage = lang
    },
    setSwitchType (state, type) {
      state.switchType = type
    },
    setNoDatasourceInfoDialog (state, info) {
      state.noDatasourceInfoDialog = info
    },
    setLoadedDatasources (state, loaded) {
      // console.log('setloaded', loaded)
      state.loadedAllDatasources = loaded
    },
    setSynchronizeDataSourceLanguage (state, syncro) {
      state.synchronizeDatasourceLanguage = syncro
    },
    setCurrentModeDesriptorMode (state, isCurrentModeDescriptor) {
      state.isCurrentSearchDescriptorMode = isCurrentModeDescriptor
    },
    setExpertViewMode (state, viewMode) {
      state.expertViewMode = viewMode
    },
    setUseRestrictFilter (state, filterOption) {
      state.useRestrictFilter = filterOption
    },
    setRestrictFilterPossible (state, filterPossible) {
      state.restrictFilterPossible = filterPossible
    },
    setResultsPerPageSetting (state, pP) {
      state.resultsPerPageSetting = pP
    },
    setSortSettings (state, sortS) {
      state.sortSettings = sortS
    },
    setUseTaxonScope: (state, value) => {
      state.useTaxonScope = value
    },
    setUseTaxonSinAuthors: (state, value) => {
      state.useTaxonSinAuthors = value
    },
    setShowDescriptorStateImagesIfAvailable: (state, value) => {
      state.showDescriptorStateImagesIfAvailable = value
    },
    setShowItemImagesIfAvailable: (state, value) => {
      state.showItemImagesIfAvailable = value
    },
    setIsNewVersionObject: (state, value) => {
      state.isNewVersionObject = value
    },
    setUserLoggedInStatus: (state, value) => {
      state.userLoggedIn = value
    },
    setUserName: (state, value) => {
      state.userName = value
    },
    setUserLoginExpired: (state, value) => {
      state.userLoginExpired = value
    }
  },
  actions: {
    // LOADING DATA PART ---------------------------------------
    /**
     * Load a list of all available sources (REST Endpoints) with all meta data
     * @param {*} param0
     */
    async loadAllAvailableDatasources ({ commit, dispatch, getters }) {
      console.log('loadAllAvailableDatasources')
      const baseurl = process.env.VUE_APP_ROOT_API
      const hosturl = baseurl + process.env.VUE_APP_API_DATA
      const serviceurl = baseurl + process.env.VUE_APP_API_SERVICE
      const versionInfo = await DataService.initIndexDB()
      // const versionInfo = [{ id: 1, dnk_app_version: 'v0.8.3', dnk_rest_version: '' }]
      // console.log('old version info', versionInfo)
      let isNewVersionObject = await DataService.checkVersionChanges(versionInfo, serviceurl, process.env.VUE_APP_API_VERSION, process.env.VUE_APP_VERSION, process.env.VUE_APP_VERSION_INFOS)
      // console.log('isNewVers', isNewVersionObject)
      commit('setIsNewVersionObject', isNewVersionObject)
      let availableDbs = []
      let tempBindings = []
      try {
        availableDbs = await DataService.getAvailableDatasourcesFromREST(hosturl, process.env.VUE_APP_API_PROJECTS, tempBindings, process.env.VUE_APP_LIST_DATASOURCES)
      } catch (error) {
        if (error.status_code === 401 && getters.getUserLoggedInStatus) {
          // console.log('ERROR loadAllAvailbales???')
          commit('setUserLoginExpired', true)
          await dispatch('logoutUser', true)
          // await dispatch('resetDataAfterLogout')
        }
        console.log('no available DBs online and offline')
        commit('setApiErrored', true)
        throw error
      }
      let tempDatasources = availableDbs
      let tempMasterDatasources = []
      // filter master dbs
      tempMasterDatasources = tempDatasources.filter((item2, index, self) => self.findIndex(t => t.scheme_master === item2.scheme_master && t.ds_name === item2.ds_name) === index)
      let mastersMetadata = []
      try {
        mastersMetadata = await DataService.getMasterMetaData(tempDatasources, tempMasterDatasources, hosturl, process.env.VUE_APP_DATASOURCE_METADATA, tempBindings, process.env.VUE_APP_LIST_MASTERS_METADATA)
      } catch (error) {
        console.log('no available DBs online and offline')
        commit('setApiErrored', true)
        throw error
      }
      // check if indexDB has to be updated for some data sources (based on LogTransferDate of master data source)
      // try {
      await DataService.checkDBChanges(process.env.VUE_APP_LIST_DATASOURCES, tempDatasources, process.env.VUE_APP_DESCRIPTORS_LIST)
      // } catch (error) {
      //   console.log('cache error?')
      //   commit('setApiErrored', true)
      //   throw error
      // }
      // save to indexedDB stores
      if (tempDatasources && tempDatasources.length > 0) {
        const dbRoot = ''
        try {
          await DataService.saveDataToCache('offline', dbRoot, dbRoot, process.env.VUE_APP_LIST_DATASOURCES, tempDatasources)
          await DataService.saveDataToCache('offline', dbRoot, dbRoot, process.env.VUE_APP_LIST_MASTERS_METADATA, mastersMetadata)
        } catch (error) {
          console.log('saving datasource lists to cache is not possible', error)
        }
      }
      commit('setMastersMetaData', mastersMetadata)
      commit('setAllAvailableDatasources', tempDatasources)
      commit('setMasterDatasources', tempMasterDatasources)
    },
    async loadAndSaveDetailedInfoTableDataToCache ({ getters, dispatch, commit }) {
      // saveTableDataToCache
      const dbRoot = getters.getDataSourceData.ds_rest_endpoint
      const hosturl = process.env.VUE_APP_ROOT_API + process.env.VUE_APP_API_DATA
      const table = process.env.VUE_APP_ITEM_DESCRIPTION
      try {
        await DataService.loadAndSaveTableDataToCache(hosturl, dbRoot, table)
      } catch (err) {
        // console.log(err)
        if (err.status_code === 401 && getters.getUserLoggedInStatus) {
        // if (err.response.status === 401) {
          commit('setUserLoginExpired', true)
          await dispatch('logoutUser', true)
          // await dispatch('resetDataAfterLogout')
        }
        // console.log(err.status)
        // commit('setApiErrored', true)
        throw err
      }
    },
    async getApiData ({ commit, state, getters, dispatch }, params) {
      // const timebefore = Date.now()
      const dbRoot = getters.getDataSourceData.ds_rest_endpoint
      const hosturl = process.env.VUE_APP_ROOT_API + process.env.VUE_APP_API_DATA
      let pageParameter = params.params
      const commitMethod = params.commitMethod
      let appendUrl
      params.appendUrl ? appendUrl = params.appendUrl : appendUrl = ''
      // const reactive = params.reactive
      let urlString = params.urlString
      let dbOptional = params.optional
      let rresp = []
      if (appendUrl !== '') {
        try {
          rresp = await DataService.getData(dbOptional, state.loadingMode.key, hosturl, dbRoot, urlString, pageParameter, appendUrl)
        } catch (err) {
          console.log('getApiDAta: ', err)
          // if (err.response.status === 401) {
          if (err.status_code === 401 && getters.getUserLoggedInStatus) {
            commit('setUserLoginExpired', true)
            await dispatch('logoutUser', true)
            // await dispatch('resetDataAfterLogout')
          }
          // console.log(err.status)
          // commit('setApiErrored', true)
          throw err
        }
      } else {
        try {
          rresp = await DataService.getData(dbOptional, state.loadingMode.key, hosturl, dbRoot, urlString, pageParameter)
        } catch (err) {
          console.log('getApiDAta: ', err)
          commit('setApiErrored', true)
          // if (err.response.status === 401) {
          if (err.status_code === 401 && getters.getUserLoggedInStatus) {
            commit('setUserLoginExpired', true)
            await dispatch('logoutUser', true)
            // await dispatch('resetDataAfterLogout')
          }
          throw err
        }
      }
      // console.log('rresp', rresp)
      Object.freeze(rresp) // set not reactive!
      // const timeafter = Date.now()
      // console.log('duration of loading ' + urlString + ' (ms): ', timeafter - timebefore)
      // commit data
      if (rresp && !Array.isArray(rresp)) {
        rresp = [rresp] // if only one object is returned by getAllDataLocallyByKey
      }
      if (typeof rresp === 'undefined') {
        rresp = null
      }
      commit(commitMethod, rresp)
    },
    async loadNewDatasourceData ({ dispatch, commit, state }) {
      // console.log('loadNewDatasourceData', state.datasourceData)
      // console.log('datasourceid?', state.currentDatasourceId)
      // reset user data
      await dispatch('loadData')
      await dispatch('resetAllUserData')
    },
    async loadData ({ dispatch, commit, state }) {
      // console.log('loadData', state.datasourceData)
      // reset datasource data to null
      await dispatch('resetState')
      commit('setApiLoading', true)
      commit('setApiErrored', false)
      try {
        await dispatch('loadDescJson')
        await dispatch('loadDescStatesJson')
        await dispatch('loadMappedDescriptorStateItemIds')
        await dispatch('loadMappedNumericalDescriptorStateItemIds')
        await dispatch('loadMappedTextDescriptorStateItemIds')
        await dispatch('loadTaxonScope')
        await dispatch('loadItemIdNameList')
        await dispatch('loadDescirptorTypesJson')
        await dispatch('loadCitationScope')
        await dispatch('mapNameScopeToItemList')
        // mapping iid listen
        await dispatch('mapCIDCStoIID')
        await dispatch('sortItemNameList')
      } catch (err) {
        console.log(err)
        // console.log(err.status)
        commit('setApiErrored', true)
        // reset datasource data to null
        console.log('resetState and user data')
        await dispatch('resetState')
        await dispatch('resetAllUserData')
        commit('setDatasource', null)
      } finally {
        commit('setApiLoading', false)
      }
    },
    async resetDataAfterLogout ({ dispatch, commit, getters }) {
      console.log('resetDataAfterLogout')
      // get locally stored db id and load if still available after logout
      const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
      let id = null
      if (localStorage.getItem(localStorageName + '/diversityDefaultDatasourceID')) {
        id = localStorage.getItem(localStorageName + '/diversityDefaultDatasourceID')
        // console.log('set id from localStorage', id)
      }
      commit('setDatasource', id)
      if (getters.getDataSourceData) {
        await dispatch('loadNewDatasourceData')
      } else {
        await dispatch('resetState')
        await dispatch('resetAllUserData')
      }
    },
    async registerUser ({ commit }, userData) {
      const hosturl = process.env.VUE_APP_ROOT_API + process.env.VUE_APP_API_SERVICE
      let registerUrl = hosturl + process.env.VUE_APP_API_USER_REGISTER
      try {
        await AuthService.register(registerUrl, userData)
      } catch (err) {
        console.log('error in register: ', err)
        throw err
      }
      return Promise.resolve()
    },
    async loginUser ({ commit, dispatch, getters }, userData) {
      // console.log('login User')
      const hosturl = process.env.VUE_APP_ROOT_API + process.env.VUE_APP_API_SERVICE
      let loginUrl = hosturl + process.env.VUE_APP_API_USER_LOGIN
      // console.log('loginUrl', loginUrl)
      try {
        await AuthService.login(loginUrl, userData)
        // reinit DB-list
        await dispatch('loadAllAvailableDatasources')
        commit('setUserLoggedInStatus', true)
        commit('setUserName', userData.username)

        // get locally stored db id and load if still available after logout
        const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
        let id = null
        if (localStorage.getItem(localStorageName + '/diversityDefaultDatasourceID')) {
          id = localStorage.getItem(localStorageName + '/diversityDefaultDatasourceID')
          // console.log('set id from localStorage', id)
        }
        commit('setDatasource', id)
        if (getters.getDataSourceData) {
          await dispatch('loadNewDatasourceData')
        }
      } catch (err) {
        // if (Api.axiosInstance.isCancel(err)) {
        //   console.log('Request canceled', err.message)
        //   throw err
        // }
        commit('setUserLoggedInStatus', false)
        commit('setUserName', '')
        throw err
      }
      return Promise.resolve()
    },
    async logoutUser ({ commit, dispatch }, deleteData) {
      console.log('logout and delete', deleteData)
      const hosturl = process.env.VUE_APP_ROOT_API + process.env.VUE_APP_API_SERVICE
      let logoutUrl = hosturl + process.env.VUE_APP_API_USER_LOGOUT
      // console.log('logoutUrl', logoutUrl)
      try {
        await AuthService.logout(logoutUrl)
          .then(async () => {
            // console.log('responseData', response)
            if (deleteData) {
              try {
                await DataService.removeIndexDB()
                console.log('indexDB removed')
                commit('setUserLoggedInStatus', false)
                commit('setUserName', '')
                // reinit
                await dispatch('loadAllAvailableDatasources')
                await dispatch('resetDataAfterLogout')
              } catch (err) {
                // console.log(err)
                throw err
              }
            }
          })
          .catch(async err => {
            // console.log('error in logoutUser(): ', err)
            if (err.status_code === 401) {
              await commit('setUserLoggedInStatus', false)
              await commit('setUserName', '')
              if (deleteData) {
                try {
                  await DataService.removeIndexDB()
                  console.log('indexDB removed')
                  // reinit
                  await dispatch('loadAllAvailableDatasources')
                  await dispatch('resetDataAfterLogout')
                } catch (err) {
                  // console.log(err)
                  throw err
                }
              }
            }
            throw err
          })
      } catch (err) {
        throw err
      }
      return Promise.resolve()
    },
    /**
     * Sets the current datasource
     * @param {*} param0
     * @param {*} newUserDatasource
     */
    passSelectedDatasourceId ({ commit }, newUserDatasource) {
      commit('setDatasource', newUserDatasource)
    },
    passSelectedDefaultDatasourceId ({ commit }, newUserDatasource) {
      // console.log('datasourceid', newUserDatasource)
      commit('setDefaultDatasource', newUserDatasource)
    },
    passLoadedAllDatasources ({ commit }, loaded) {
      // console.log('passLoaded', loaded)
      commit('setLoadedDatasources', loaded)
    },
    passAPILoading ({ commit }, apiLoading) {
      commit('setApiLoading', apiLoading)
    },
    passAPIErrored ({ commit }, apiErrored) {
      commit('setApiErrored', apiErrored)
    },
    passCancelAPILoading () {
      // console.log('passCancelAPILoading')
      DataService.cancelLoading()
      // source.cancel('Canceled by User')
    },
    passIsCategoricalToleranceMode ({ commit }, toleranceMode) {
      commit('setIsCategoricalToleranceMode', toleranceMode)
    },
    passIsPositiveCategoricalToleranceMode ({ commit }, toleranceMode) {
      commit('setIsPositiveCategoricalToleranceMode', toleranceMode)
    },
    passIsQuantitativeToleranceMode ({ commit }, toleranceMode) {
      commit('setIsQuantitativeToleranceMode', toleranceMode)
    },
    passNumFilterIncludeExtremeValues ({ commit }, extremeValues) {
      commit('setNumFilterIncludeExtremeValues', extremeValues)
    },
    passCurrentLoadMode ({ commit }, mode) {
      commit('setCurrentLoadMode', mode)
    },
    passGuiColorTheme ({ commit }, colorTheme) {
      commit('setGuiColorTheme', colorTheme)
    },
    async passCurrentLanguage ({ commit, state, getters, dispatch }, lang) {
      commit('setCurrentLanguage', lang)
      if (state.synchronizeDatasourceLanguage) {
        // console.log('try to synchronize datasource with', (state.datasourceData))
        if (state.datasourceData && state.datasourceData.scheme_lang === lang) {
          // nothing to do
          return
        }
        if (state.datasourceData) {
          // get master db
          let masterInfo = getters.getMasterDataSourceInfo(state.datasourceData)
          if (masterInfo) {
            let availableSchemes = getters.getAvailabelSchemesOfMaster(masterInfo)
            let checkForLanguageScheme = availableSchemes.filter(scm => scm.scheme_lang === lang.key)
            if (checkForLanguageScheme && checkForLanguageScheme.length > 0) {
              // load datasource
              // load project default datasource - master
              if (state.datasourceData.id !== checkForLanguageScheme[0].id) {
                // console.log('load syncrhonized datasource')
                commit('setDatasource', checkForLanguageScheme[0].id)
                await dispatch('loadNewDatasourceData')
              }
            } else {
              // load project default datasource - master
              if (state.datasourceData.id !== masterInfo.id) {
                // console.log('load master')
                commit('setDatasource', masterInfo.id)
                await dispatch('loadNewDatasourceData')
              }
            }
          }
        }
      }
    },
    passSwitchType ({ commit }, type) {
      commit('setSwitchType', type)
    },
    passNoDatasourceDialog ({ commit }, info) {
      commit('setNoDatasourceInfoDialog', info)
    },
    passSynchronizeDataSourceLanguage ({ commit }, sncr) {
      commit('setSynchronizeDataSourceLanguage', sncr)
    },
    async passExpertViewMode ({ commit, dispatch }, expertViewMode) {
      commit('setExpertViewMode', expertViewMode)
      // await dispatch('resetAllUserData')
      if (expertViewMode) {
        await dispatch('resetForExpertMode')
      } else {
        await dispatch('resetAllUserData')
      }
    },
    passIsCurrentModeDesriptorMode ({ commit }, isDescriptorMode) {
      commit('setCurrentModeDesriptorMode', isDescriptorMode)
    },
    passUseRestrictFilter ({ commit }, filter) {
      commit('setUseRestrictFilter', filter)
    },
    passRestrictFilterPossible ({ commit }, filter) {
      commit('setRestrictFilterPossible', filter)
    },
    passResultsPerPageSetting ({ commit }, pP) {
      commit('setResultsPerPageSetting', pP)
    },
    passSortSettings ({ commit }, sortS) {
      commit('setSortSettings', sortS)
    },
    passUseTaxonScope ({ commit }, value) {
      commit('setUseTaxonScope', value)
    },
    passUseTaxonSinAuthors ({ commit }, value) {
      commit('setUseTaxonSinAuthors', value)
    },
    passShowDescriptorStateImagesIfAvailable ({ commit }, value) {
      commit('setShowDescriptorStateImagesIfAvailable', value)
    },
    passShowItemImagesIfAvailable ({ commit }, value) {
      commit('setShowItemImagesIfAvailable', value)
    },
    passOKNewVersionInfo ({ commit }) {
      // reset
      commit('setIsNewVersionObject', { 'isNewAppVersion': false, 'isNewRestVersion': false })
    },
    passUsername ({ commit }, value) {
      // console.log('pass username', value)
      // console.log('commit username', value)
      commit('setUserLoggedInStatus', true)
      commit('setUserName', value)
    }
  }
}
/**
 * A Vuex.Store instance (global singleton) for storing shared state to all components.
 * Shared state in Navikey:
 *  + descriptors with child states
 *  + all items
 *  + user selection criteria
 *
 * TODO Exception handling!!!!!!!!!!!!!!!!!!!!!!!
 *
 */
export const store = createStore({
  modules: {
    singleDataStore: moduleSingleDatastore,
    rootStore: rootModule
  }
})
