
import QuantitativeRangeDescriptorDataType from '../models/QuantitativeRangeDescriptor.js'
const SELECTIONTYPE = process.env.VUE_APP_ENUMERATION_DESCRIPTOR
const QUANTTYPE = process.env.VUE_APP_NUMBER_DESCRIPTOR
const TEXTTYPE = process.env.VUE_APP_TEXT_DESCRIPTOR

export default {
  data: () => ({
    categoricalFilters: [],
    quantiativeFilters: [],
    textFilters: [],
    fileNameLists: [],
    fileNameMap: null,
    isPositiveToleranceMode: false,
    isNegativeToleranceMode: false,
    numFilterIncludeExtremValues: false
  }),
  methods: {
    // Initialize tolerance mode
    initToleranceModes (catNeg, catPos) {
      this.isPositiveToleranceMode = catPos
      this.isNegativeToleranceMode = catNeg
    },
    // Initialize the use of extreme values for the quantitative descriptors
    initNumFilterIncludeExtremeValues (includeExtremValues) {
      this.numFilterIncludeExtremValues = includeExtremValues
    },
    // Initialize list with names
    initInvertedNameFilters (fileNameItems) {
      this.fileNameLists = fileNameItems
    },
    // Initialize map with names
    initNameMap (nameMap) {
      this.fileNameMap = nameMap
    },
    // Set inverted lists for categorical, quantitative and text descriptors
    initInvertedFilters (categoricals, quantiative, text) {
      this.categoricalFilters = categoricals
      this.quantiativeFilters = quantiative
      this.textFilters = text
    },
    /**
     * Method returns all items matching the given searchstring according to the parameter filterAlgorithm
     * @param {string} name of filterAlgorithm, currently only 'Inverted'
     * @param {Array} operators: [operator between different descriptors, operator between identical descriptors], e.g. ['AND', 'OR'] = AND between different, OR between identical
     * @param {Array} selectedDescriptorStatePairs [{stateID, CS, csName, descriptore (id, type, name), descriptorStateUserInputs[]}] all user selected descriptor-state pairs
     */
    getFilteredItems (filterAlgorithm, operators, selectedDescriptorStatePairs) {
      switch (filterAlgorithm) {
        case 'Inverted':
          return this._getSelectedItems(operators, selectedDescriptorStatePairs)
        default:
          return this._getSelectedItems(operators, selectedDescriptorStatePairs)
      }
    },
    /**
     * InvertedIndexSearch: search items for given descriptor state pairs within an inverted index list:
     * [{CID, CS, ItemList: [{IID}]}]
     *
     * @param {Array} operators -> ['AND', 'OR'] first position operator between different descriptors, second position operator between different states of one descriptor
     * @param {Array} selectedDescriptorStatePairs [{stateID, CS, csName, descriptore (id, type, name), descriptorStateUserInputs[]}] all user selected descriptor-state pairs
     */
    _getSelectedItems (operators, selectedDescriptorStatePairs) {
      let currentSelectedItemsList = []
      const deepClone = require('rfdc')()
      // empty search list
      if (selectedDescriptorStatePairs.length === 0) {
        return currentSelectedItemsList
      }
      // get all identical descriptor-CIDs
      let listIdenticalDescriptors = selectedDescriptorStatePairs.filter((item, index, self) => self.findIndex(t => t.CID === item.CID) === index)
      listIdenticalDescriptors = deepClone(listIdenticalDescriptors)
      let count = 0
      // combine all identical descriptors with second operator, otherwise with first operator
      for (const identList of listIdenticalDescriptors) {
        let identicalSelectedItemsList = []
        let identicalDescripors = selectedDescriptorStatePairs.filter(desc => desc.CID === identList.CID)
        identicalDescripors = deepClone(identicalDescripors)
        if (identicalDescripors.length > 1) { // always true for numerical descriptors! (states Low, Upp,..)
          for (const desclistItem of identicalDescripors) {
            // check if numerical type
            if (desclistItem.descType === QUANTTYPE) {
              // range search over all states within invertedIndexSearchDescriptorState -> all identicalDescriptor
              identicalSelectedItemsList = this.invertedIndexSearchQuantDescriptorStates(identicalDescripors, operators[1], identicalSelectedItemsList)
              break
            } else {
              identicalSelectedItemsList = this.invertedIndexSearchDescriptorState(desclistItem, operators[1], identicalSelectedItemsList)
              if (identicalSelectedItemsList && identicalSelectedItemsList.length === 0 && operators[1] === 'AND') {
                // AND search already has no results -> break
                break
              }
            }
          }
          // first result
          if (currentSelectedItemsList.length === 0 && count === 0) {
            currentSelectedItemsList = identicalSelectedItemsList
          } else {
            if (currentSelectedItemsList.length === 0 && count > 0 && operators[0] === 'AND') {
              return currentSelectedItemsList
            }
            let resultItems = []
            // AND or OR combine new with old
            if (operators[0] === 'AND') {
              let presentinboth = currentSelectedItemsList.filter(firstItem => identicalSelectedItemsList.find(secondItem => secondItem.IID === firstItem.IID))
              presentinboth = deepClone(presentinboth)
              resultItems = resultItems.concat(presentinboth)
            } else {
              resultItems = deepClone(currentSelectedItemsList)
              let presentonlyinsecond = identicalSelectedItemsList.filter(second => !currentSelectedItemsList.find(first => first.IID === second.IID))
              presentonlyinsecond = deepClone(presentonlyinsecond)
              resultItems = resultItems.concat(presentonlyinsecond)
            }
            currentSelectedItemsList = resultItems
          }
        } else {
          // else is not! possible for numerical descriptors
          if (currentSelectedItemsList.length === 0 && count > 0 && operators[0] === 'AND') {
            // previous selection already null
            return currentSelectedItemsList
          }
          // check if numerical type
          if (identList.descType === QUANTTYPE) {
            // range search over all states within invertedIndesSearchDescriptorState -> all identicalDescriptor
            currentSelectedItemsList = this.invertedIndexSearchQuantDescriptorStates(identList, operators[0], currentSelectedItemsList)
          } else {
            currentSelectedItemsList = this.invertedIndexSearchDescriptorState(identList, operators[0], currentSelectedItemsList)
          }
        }
        count++
      }
      return currentSelectedItemsList
    },
    invertedIndexSearchQuantDescriptorStates (desclistItem, operator, identicalSelectedItemsList) {
      let selectedIs = []
      let newSelected = []
      const deepClone = require('rfdc')()
      // get all descriptor state items
      let loadedDescriptorItems = []
      loadedDescriptorItems = this.quantiativeFilters
      if (!loadedDescriptorItems || !loadedDescriptorItems.length) {
        return identicalSelectedItemsList
      }
      function groupBy (descriptorObjectArray, userInputs) {
        return descriptorObjectArray.reduce(function (acc, obj) {
          let key = obj[userInputs]
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(obj)
          return acc
        }, {})
      }
      if (desclistItem && Array.isArray(desclistItem)) {
        // group multiple selection of numerical descriptor by user input,e.g. '=,12'
        let grouped = groupBy(desclistItem, 'descriptorStateUserInputs')
        const groupKeys = Object.keys(grouped)
        // search over all quantitativ states in simple search
        groupKeys.forEach((key, index) => {
          for (let desll of grouped[key]) {
            if (desll.descType === QUANTTYPE) {
              let tempArray = loadedDescriptorItems.filter(descStateItem => (descStateItem.CID === desll.CID))
              tempArray = deepClone(tempArray) // don't forget this one!!!
              selectedIs = tempArray
            }
            // cunjunction search (AND)
            if (operator === 'AND') {
              if (!selectedIs || selectedIs.length === 0) {
                return []
              }
              identicalSelectedItemsList = this.numericalRangeFilter(selectedIs, desll, identicalSelectedItemsList, operator)
              // disjunction search
            } else
            if (operator === 'OR') {
              if (!selectedIs || !selectedIs.length > 0) { // [0] || !selectedIs[0].ItemList.length > 0) {
                return identicalSelectedItemsList
              }
              identicalSelectedItemsList = this.numericalRangeFilter(selectedIs, desll, identicalSelectedItemsList, operator)
            }
            break
          }
        }
        )
      } else {
        let tempArray = loadedDescriptorItems.filter(descStateItem => (descStateItem.CID === desclistItem.CID))
        tempArray = deepClone(tempArray) // don't forget this one!!!
        selectedIs = tempArray
        // cunjunction search (AND)
        if (operator === 'AND') {
          if (!selectedIs || selectedIs.length === 0) {
            return []
          }
          identicalSelectedItemsList = this.numericalRangeFilter(selectedIs, desclistItem, identicalSelectedItemsList, operator)
          // disjunction search
        } else
        if (operator === 'OR') {
          if (!selectedIs || !selectedIs.length > 0) { // [0] || !selectedIs[0].ItemList.length > 0) {
            return identicalSelectedItemsList
          }
          identicalSelectedItemsList = this.numericalRangeFilter(selectedIs, desclistItem, identicalSelectedItemsList, operator)
        }
      }
      newSelected = identicalSelectedItemsList
      return newSelected
    },
    /**
     * Search items for given descriptor_state for descriptors of type 'Categorical' or 'Text'
     * @param {*} desclistItem
     * @param {*} loadedDescriptorItems
     * @param {*} logicalOperator
     */
    invertedIndexSearchDescriptorState (desclistItem, operator, currentSelectedItemsList) {
      let selectedIs = []
      let newSelected = []
      const deepClone = require('rfdc')()
      // get all descriptor state items
      let loadedDescriptorItems = []
      if (desclistItem.descType === TEXTTYPE) {
        loadedDescriptorItems = this.textFilters
      } else {
        loadedDescriptorItems = this.categoricalFilters
      }
      if (!loadedDescriptorItems || !loadedDescriptorItems.length) {
        return currentSelectedItemsList
      }
      if (desclistItem.descType === SELECTIONTYPE && desclistItem.descriptorStateUserInputs[0] === '!=') {
        // if this.fileNameMap and negative tolerance search are initialized, also IID which have not set descriptor will be returned
        if (this.isNegativeToleranceMode && this.fileNameMap) {
          let selectedIts = loadedDescriptorItems.filter(descStateItem => ((descStateItem.CID === desclistItem.CID && descStateItem.CS === desclistItem.CS)))
          if (!selectedIts || selectedIts.length === 0) {
            selectedIts = []
            selectedIts.push({ ItemList: [] })
          }
          let allItemsWithCID = new Map()
          // add IID to Map -> iid as key, eliminates duplicates by default -> caution! only last inserted value wins -> works only for categoricals where value is not important
          // otherwise use .has to check and add new value to old one
          for (const singleItem of selectedIts[0].ItemList) {
            allItemsWithCID.set(singleItem.IID, singleItem)
          }
          let notSetArray = []
          notSetArray.push({ ItemList: [] })
          this.fileNameMap.forEach(function (value, key) {
            if (!allItemsWithCID.get(key)) {
              notSetArray[0].ItemList.push(value)
            }
          })
          selectedIs = deepClone(notSetArray)
        } else {
          let selectedIts = loadedDescriptorItems.filter(descStateItem => ((descStateItem.CID === desclistItem.CID)))
          let allItemsWithCID = new Map()
          let mapItemsWithCS = new Map() // because of multi-state possiblity for items
          for (const preIis of selectedIts) {
            let mapWithCS = false
            if (preIis.CS === desclistItem.CS) {
              mapWithCS = true
            }
            for (const singleItem of preIis.ItemList) {
              if (mapWithCS) {
                mapItemsWithCS.set(singleItem.IID, singleItem)
              } else {
                allItemsWithCID.set(singleItem.IID, singleItem)
              }
            }
          }
          // remove IIDs because of multi-state selection
          mapItemsWithCS.forEach(function (value, key) {
            allItemsWithCID.delete(key)
          })
          let tempItemArray = []
          tempItemArray.push({ ItemList: [] })
          tempItemArray[0].ItemList = Array.from(allItemsWithCID.values())
          selectedIs = deepClone(tempItemArray)
        }
      } else {
        if (desclistItem.descType === SELECTIONTYPE && this.isPositiveToleranceMode && this.fileNameMap) { // && this.fileNameLists && this.fileNameLists.length > 0) {
          // get all with CID,CS
          let selectedtts = loadedDescriptorItems.filter(descStateItem => ((descStateItem.CID === desclistItem.CID && descStateItem.CS === desclistItem.CS))) // || (descStateItem.CID === descriptorStatePair.CID && descStateItem.CS === 'NoValue')))
          if (!selectedtts || selectedtts.length === 0) {
            selectedtts = []
            selectedtts.push({ ItemList: [] })
          }
          selectedtts = deepClone(selectedtts)
          // get all Items where CID is not set
          let unsetItems = loadedDescriptorItems.filter(items => (items.CID === desclistItem.CID))
          if (!unsetItems || unsetItems.length === 0) {
            unsetItems = []
            unsetItems.push({ ItemList: [] })
          }
          let allItemsWithCID = new Map()
          for (const preUnset of unsetItems) {
            // add IID to Map -> iid as key, eliminates duplicates by default -> caution! only last inserted value wins -> works only for categoricals where value is not important
            // otherwise use .has to check and add new value to old one
            for (const singleItem of preUnset.ItemList) {
              allItemsWithCID.set(singleItem.IID, singleItem)
            }
          }
          let notSetArray = []
          notSetArray.push({ ItemList: [] })
          this.fileNameMap.forEach(function (value, key) {
            if (!allItemsWithCID.get(key)) {
              notSetArray[0].ItemList.push(value)
            }
          })
          selectedtts[0].ItemList = selectedtts[0].ItemList.concat(notSetArray[0].ItemList)
          selectedIs = deepClone(selectedtts)
        } else {
          selectedIs = loadedDescriptorItems.filter(descStateItem => (descStateItem.CID === desclistItem.CID && (descStateItem.CS === desclistItem.CS || descStateItem.CS === 'NoValue')))
          selectedIs = deepClone(selectedIs)
        }
      }
      // cunjnction search (AND)
      if (operator === 'AND') {
        if (!selectedIs || !selectedIs[0] || !selectedIs[0].ItemList.length > 0) {
          return []
        }
        newSelected = this.logicalAndSearch(selectedIs, desclistItem, currentSelectedItemsList)
        // disjunction search
      } else if (operator === 'OR') {
        if (!selectedIs || !selectedIs[0] || !selectedIs[0].ItemList.length > 0) {
          return currentSelectedItemsList
        }
        newSelected = this.logicalOrSearch(selectedIs, desclistItem, currentSelectedItemsList)
      }
      return newSelected
    },
    /**
     * Filter all items which are in 'old''currentSelectedItemsList' list AND also in list 'selectedIs'
     * @param {*} selectedIs list of all items from selected descriptor (descListItem)
     * @param {*} desclistItem current item
     * @param {*} currentSelectedItemsList 'old' list of previous selected items or []
     * @returns
     */
    logicalAndSearch (selectedIs, desclistItem, currentSelectedItemsList) {
      let result = []
      let cunjSel = []
      let setCun = false
      let l = 0
      if (selectedIs[0]) {
        l = selectedIs[0].ItemList.length
      }
      let lc = 0
      if (currentSelectedItemsList) {
        lc = currentSelectedItemsList.length
      }
      if (l === 0 && lc === 0) {
        return cunjSel
      }
      if (l > 0 && lc > 0) {
        if (desclistItem.descType === SELECTIONTYPE) {
          setCun = true
          cunjSel = currentSelectedItemsList.filter(item => (selectedIs[0].ItemList.find(item2 => item2.IID === item.IID)))
        } else {
          setCun = true
          let itemsToTest = (selectedIs[0].ItemList.filter(item2 => this.compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
          // remove duplicates of search before
          cunjSel = currentSelectedItemsList.filter(item3 => (itemsToTest.find(itemC => itemC.IID === item3.IID)))
        }
      } else {
        if (l > 0 && lc === 0) {
          if (desclistItem.descType === SELECTIONTYPE) {
            result = selectedIs[0].ItemList
          } else {
            cunjSel = (selectedIs[0].ItemList.filter(item2 => this.compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
            if (cunjSel.length > 0) {
              result = cunjSel
            } else {
              result = []
            }
          }
        }
      }
      if (setCun && selectedIs[0]) {
        if (cunjSel.length > 0) {
          result = cunjSel
        } else {
          result = []
        }
      }
      return result
    },
    /**
     * Get all items which are in 'old''currentSelectedItemsList' list OR in list 'selectedIs'
     * @param {*} selectedIs list of all items from selected descriptor (descListItem)
     * @param {*} desclistItem current item
     * @param {*} currentSelectedItemsList 'old' list of previous selected items or []
     * @returns
     */
    logicalOrSearch (selectedIs, desclistItem, currentSelectedItemsList) {
      let disjSel = []
      let l = 0
      if (selectedIs[0]) {
        l = selectedIs[0].ItemList.length
      }
      let lc = 0
      if (currentSelectedItemsList) {
        lc = currentSelectedItemsList.length
      }
      if (l === 0 && lc === 0) {
        return disjSel
      }
      if (l > 0 && lc > 0) {
        if (desclistItem.descType === SELECTIONTYPE) {
          disjSel = selectedIs[0].ItemList.filter(item => !(currentSelectedItemsList.find(item2 => item2.IID === item.IID)))
        } else {
          let itemsToTest = (selectedIs[0].ItemList.filter(item2 => this.compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
          // remove already included
          disjSel = itemsToTest.filter(item3 => !(currentSelectedItemsList.find(itemC => itemC.IID === item3.IID)))
        }
      } else {
        if (l > 0 && lc === 0) {
          // check type of descriptor
          if (desclistItem.descType === SELECTIONTYPE) {
            currentSelectedItemsList = selectedIs[0].ItemList
          } else {
            disjSel = (selectedIs[0].ItemList.filter(item2 => this.compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
            if (disjSel.length > 0) {
              currentSelectedItemsList = disjSel
              disjSel = [] // reset
            } else {
              currentSelectedItemsList = []
            }
          }
        }
      }
      if (disjSel.length > 0) {
        currentSelectedItemsList = currentSelectedItemsList.concat(disjSel)
      }
      return currentSelectedItemsList
    },
    compareValues (item, desclistItem) {
      // distinguish descriptor type
      if (desclistItem.descType === TEXTTYPE) {
        return this.checkTextSearch(item, desclistItem)
      }
    },
    /**
     * Filter all items according to defined ranges, which are in 'old''alreadySelectedItemsList' list AND/OR also in list 'selectedIs'
     * @param {*} selectedIs list of all items from selected numerical descriptors (descListItem)
     * @param {*} desclistItem current item
     * @param {*} currentSelectedItemsList 'old' list of previous selected items or []
     * @returns
     */
    numericalRangeFilter (selectedIs, desclistItem, alreadySelectedItemsList, operator) {
      let disjSel = []
      let inclExtrem = this.numFilterIncludeExtremValues
      let itemMap = new Map()
      let lc = 0
      if (alreadySelectedItemsList) {
        lc = alreadySelectedItemsList.length
      }
      if (selectedIs.length === 0 && lc === 0) {
        return disjSel
      }
      // map all num descriptors + values (MIN, LOW, MEAN; UPP; MAX) to IID
      if (selectedIs.length > 0) {
        for (let desc of selectedIs) {
          if (desc.ItemList && desc.ItemList.length > 0) {
            for (let item of desc.ItemList) {
              if (itemMap.has(item.IID)) {
                let addToItem = itemMap.get(item.IID)
                addToItem.values.push({ CID: desc.CID, CS: desc.CS, Value: item.Value })
              } else {
                itemMap.set(item.IID, { values: [{ CID: desc.CID, CS: desc.CS, Value: item.Value }] })
              }
            }
          }
        }
        // filter with quantitative range logic
        var objDT = new QuantitativeRangeDescriptorDataType()
        let userValues = [desclistItem.descriptorStateUserInputs[1], desclistItem.descriptorStateUserInputs[2]]
        disjSel = objDT.getNumMatches(itemMap, desclistItem.descriptorStateUserInputs[0], userValues, inclExtrem)
        if (lc > 0) {
          // remove already included
          if (disjSel.length > 0) {
            if (operator === 'OR') {
              disjSel = disjSel.filter(item3 => !(alreadySelectedItemsList.find(itemC => itemC.IID === item3.IID)))
              alreadySelectedItemsList = alreadySelectedItemsList.concat(disjSel)
            } else {
              disjSel = disjSel.filter(item3 => (alreadySelectedItemsList.find(itemC => itemC.IID === item3.IID)))
              alreadySelectedItemsList = disjSel
            }
          } else {
            if (operator === 'OR') {
              return alreadySelectedItemsList
            } else {
              return []
            }
          }
        } else {
          if (disjSel.length > 0) {
            alreadySelectedItemsList = disjSel
            disjSel = [] // reset
          } else {
            alreadySelectedItemsList = []
          }
        }
      } else {
        return alreadySelectedItemsList
      }
      return alreadySelectedItemsList
    },
    // /**
    //  * DEPRECATED --- not in use!
    //  * Compares two Number values according to the selected operator
    //  * @param {} item item.Value convert to Number!
    //  * @param {*} desclistItem desclistItem.descriptorStateUserInputs[0] -> operator, [1] firstValue, [2] in case of operator'between' secondValue
    //  */
    // compareNumberValues (item, desclistItem) {
    //   let itemNumberValue = Number(item.Value) // CHANGE API X OR NUMBERVALUE OR VALUE HERE!!   item.NumberValue oder item.X
    //   let match = false
    //   if (itemNumberValue || itemNumberValue === 0) {
    //     // for number descriptors there are always 2 numbers in descriptorStateUserInput -> first argument should always be true
    //     // if first value eq second value -> one comparison is enough
    //     if (desclistItem.descriptorStateUserInputs.length >= 2) {
    //       // exact macth of number if option exact is set to true
    //       if (desclistItem.descriptorStateUserInputs[0] === '=') {
    //         if (itemNumberValue === Number(desclistItem.descriptorStateUserInputs[1])) {
    //           match = true
    //         }
    //       }
    //       // if (desclistItem.descriptorStateUserInputs[0] === '=') {
    //       //   // check UMethLower, UMethUpper range
    //       // }
    //       if (desclistItem.descriptorStateUserInputs[0] === '!=') {
    //         match = false
    //         if (itemNumberValue !== Number(desclistItem.descriptorStateUserInputs[1])) {
    //           match = true
    //         }
    //       }
    //       if (desclistItem.descriptorStateUserInputs[0] === '<=') {
    //         match = false
    //         if (itemNumberValue <= Number(desclistItem.descriptorStateUserInputs[1])) {
    //           match = true
    //         }
    //       }
    //       if (desclistItem.descriptorStateUserInputs[0] === '>=') {
    //         match = false
    //         if (itemNumberValue >= Number(desclistItem.descriptorStateUserInputs[1])) {
    //           match = true
    //         }
    //       }
    //       if (desclistItem.descriptorStateUserInputs[0] === 'between') {
    //         match = false
    //         if (itemNumberValue >= Number(desclistItem.descriptorStateUserInputs[1]) && itemNumberValue <= Number(desclistItem.descriptorStateUserInputs[2])) {
    //           match = true
    //         }
    //       }
    //     }
    //   }
    //   return match
    // },
    /**
     * Checks if given item contains seachstring
     * @param {} item
     * @param {*} desclistItem desclistItem.descriptorStateUserInputs[0] -> comparator, [1] searchstring
     */
    checkTextSearch (item, desclistItem) {
      let itemTextValue = item.Value // CHANGE API X OR TextVALUE OR VALUE HERE!!   item.TxtValue oder item.TXT
      let match = false
      if (itemTextValue) {
        // for text descriptors there are always 2 values in descriptorStateUserInput -> first argument should always be true contains comparator 'contains', 'exact'
        if (desclistItem.descriptorStateUserInputs.length === 2) {
          let searchText = String(desclistItem.descriptorStateUserInputs[1])
          // exact macth of text -> currently not in use -> not sure that this makes sense
          if (desclistItem.descriptorStateUserInputs[0] === 'exact') {
            if (itemTextValue.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              match = true
            }
          }
          if (desclistItem.descriptorStateUserInputs[0] === 'contains') {
            if (itemTextValue.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
              match = true
            }
          }
        }
      }
      return match
    },
    /**
     * Simple text comparison -> TODO
     * @param {string} stringPartToSearch
     * @returns
     */
    getFilteredNames (stringPartToSearch) {
      let allNames = this.fileNameLists
      let matchedNames = []
      let matchedMap = new Map()
      if (allNames && allNames.length > 0) {
        allNames.filter(nn => {
          if (nn.ItemName.toLowerCase().indexOf(stringPartToSearch.toLowerCase()) > -1) {
            matchedNames.push({ IID: nn.IID, ItemName: nn.ItemName })
            matchedMap.set(nn.IID, nn)
          }
        })
        // check scopes here
        allNames.filter(nn => {
          if (nn.scopeTaxonInfo && nn.scopeTaxonInfo.length > 0) {
            for (let name of nn.scopeTaxonInfo) {
              if (name.acceptedName) {
                if (name.acceptedName.toLowerCase().indexOf(stringPartToSearch.toLowerCase()) > -1) {
                  if (!matchedMap.has(nn.IID)) {
                    matchedNames.push({ IID: nn.IID, ItemName: nn.ItemName })
                    matchedMap.set(nn.IID, nn)
                  }
                }
              }
            }
          }
        })
      }
      allNames = null
      return matchedNames
    }
  }
}
