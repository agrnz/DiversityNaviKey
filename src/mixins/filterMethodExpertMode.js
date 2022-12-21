
import QuantitativeRangeDescriptorDataType from '../models/QuantitativeRangeDescriptor.js'
const SELECTIONTYPE = process.env.VUE_APP_ENUMERATION_DESCRIPTOR
const QUANTTYPE = process.env.VUE_APP_NUMBER_DESCRIPTOR
const TEXTTYPE = process.env.VUE_APP_TEXT_DESCRIPTOR

export default {
  data: () => ({
    loadedCategoricalDescriptorItems: [],
    loadedNumericalDescriptorItems: [],
    loadedTextDescriptorItems: [],
    itemNamesMap: null,
    isPositiveToleranceMode: false,
    isNegativeToleranceMode: false,
    numFilterIncludeExtremValues: false
  }),
  methods: {
    // Initialize map with names
    initNameMapAdvancedMode (nameMap) {
      this.itemNamesMap = nameMap
    },
    // Set inverted lists for categorical, quantitative and text descriptors
    initInvertedFiltersAdvancedMode (categoricals, quantiative, text) {
      this.loadedCategoricalDescriptorItems = categoricals
      this.loadedNumericalDescriptorItems = quantiative
      this.loadedTextDescriptorItems = text
    },
    // Initialize tolerance mode
    initToleranceModesAdvancedMode (catNeg, catPos) {
      this.isPositiveToleranceMode = catPos
      this.isNegativeToleranceMode = catNeg
    },
    // Initialize the use of extreme values for the quantitative descriptors
    initNumFilterIncludeExtremeValues (includeExtremValues) {
      this.numFilterIncludeExtremValues = includeExtremValues
    },
    /**
     * Method returns all items matching the given searchstring
     * recursive method
     * @param {string} searchString
     */
    getFilteredItemsAdvancedMode (searchString) {
      if (searchString && searchString.length === 0) {
        return []
      }
      let selectedItems = [] // triple of callStepNumber, andOrOperator, selectedItems
      let callStep = 0
      let numberType = QUANTTYPE
      let selectionType = SELECTIONTYPE
      let textType = TEXTTYPE
      // all items in descriptor-state lists sorted by their descriptor type
      let loadedCategoricalDescriptorItems = this.loadedCategoricalDescriptorItems
      let loadedNumericalDescriptorItems = this.loadedNumericalDescriptorItems
      let loadedTextDescriptorItems = this.loadedTextDescriptorItems
      let loadedNumFilterIncludeExtremValues = this.numFilterIncludeExtremValues
      // all itemnames in a map
      let itemNameMap = this.itemNamesMap
      let isPositiveToleranceMode = this.isPositiveToleranceMode
      let isNegativeToleranceMode = this.isNegativeToleranceMode
      const deepClone = require('rfdc')()
      // call recursive function with whole searchString
      decrumbleSearchString(searchString)
      // if there is only one element left, this is the result
      if (selectedItems.length === 1) {
        let allSelected = []
        for (const it of selectedItems) {
          if (it.preSelectedItems.length > 0) {
            for (const hm of it.preSelectedItems) {
              allSelected = allSelected.concat(hm.ItemList)
            }
          }
        }
        return allSelected
      } else {
        console.log('SHOULD NOT HAPPEN!!!! selectedItems length still greater than 1 ??: ', selectedItems)
      }
      // defining inner functions to compare different value type
      // Compare text items
      function compareValues (item, desclistItem) {
        if (desclistItem.descType === textType) {
          return checkTextSearch(item, desclistItem)
        }
      }
      // deprecated
      // // compare number values of quantitative descriptors
      // function compareNumberValues (item, desclistItem) {
      //   // should not happen
      //   if (!item || !item.Value) {
      //     console.log('compareNumberValues item has no property for Value -> should not happen (only in ToleranceMode??)', item)
      //     return false
      //   }
      //   let itemNumberValue = Number(item.Value) // CHANGE API X OR NUMBERVALUE HERE!!   item.NumberValue oder item.X
      //   let match = false
      //   if (itemNumberValue || itemNumberValue === 0) {
      //     // for number descriptors there are always 2 numbers in descriptorStateUserInput -> first argument should always be true
      //     // if first value eq second value -> one comparison is enough
      //     if (desclistItem.descriptorStateUserInputs.length >= 2) {
      //       // exact macth of number
      //       if (desclistItem.descriptorStateUserInputs[0] === '=') {
      //         if (itemNumberValue === Number(desclistItem.descriptorStateUserInputs[1])) {
      //           match = true
      //         }
      //       }
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
      // }
      // compare string values of text descriptors - TODO fuzzy text search
      function checkTextSearch (item, desclistItem) {
        // should not happen
        if (!item || !item.Value) {
          return false
        }
        let itemTextValue = item.Value // CHANGE API X OR TextVALUE OR VALUE HERE!!   item.TxtValue oder item.TXT
        let match = false
        if (itemTextValue) {
          // for text descriptors there are always 2 values in descriptorStateUserInput -> first argument should always be true contains comparator 'contains', 'exact'
          if (desclistItem.descriptorStateUserInputs.length === 2) {
            let searchText = String(desclistItem.descriptorStateUserInputs[1])
            // exact macth of text -> currently not in use -> sense?
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
      }
      // defining inner functions for AND or OR search groups
      function logicalAndSearch (selectedIs, desclistItem, currentSelectedItemsList) {
        let cunjSel = []
        let l = 0
        if (selectedIs[0]) {
          l = selectedIs[0].ItemList.length
        }
        let lc = 0
        if (currentSelectedItemsList.length > 0 && currentSelectedItemsList[0]) {
          lc = currentSelectedItemsList[0].ItemList.length
        }
        if (l === 0 && lc === 0) {
          return cunjSel
        }
        if (l > 0 && lc > 0) {
          if (desclistItem.descType === selectionType || desclistItem.descType === numberType) {
            cunjSel = currentSelectedItemsList[0].ItemList.filter(item => (selectedIs[0].ItemList.find(item2 => item2.IID === item.IID)))
          } else {
            let itemsToTest = (selectedIs[0].ItemList.filter(item2 => compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
            // remove duplicates of search before
            cunjSel = currentSelectedItemsList[0].ItemList.filter(item3 => (itemsToTest.find(itemC => itemC.IID === item3.IID)))
          }
        } else {
          if (l > 0 && lc === 0) {
            if (desclistItem.descType === selectionType || desclistItem.descType === numberType) {
              cunjSel = selectedIs[0].ItemList
            } else {
              cunjSel = (selectedIs[0].ItemList.filter(item2 => compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
            }
          }
          // no possible results if l === 0 and lc > 0
        }
        return cunjSel
      }
      function numericalRangeFilter (selectedIs, desclistItem, alreadySelectedItemsList, operator) {
        let disjSel = []
        let inclExtrem = loadedNumFilterIncludeExtremValues
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
          // if (disjSel.length > 0) {
          //   if (operator === 'OR') {
          //     alreadySelectedItemsList = alreadySelectedItemsList.concat(disjSel)
          //   } else {
          //     alreadySelectedItemsList = disjSel
          //   }
          // }
        } else {
          return alreadySelectedItemsList
        }
        // console.log('alreadySelectedItemsList', alreadySelectedItemsList)
        return alreadySelectedItemsList
      }
      function logicalOrSearch (selectedIs, desclistItem, currentSelectedItemsList) {
        let disjSel = []
        let resultArray = []
        let l = 0
        if (selectedIs[0]) {
          l = selectedIs[0].ItemList.length
        }
        let lc = 0
        if (currentSelectedItemsList.length > 0 && currentSelectedItemsList[0]) {
          lc = currentSelectedItemsList[0].ItemList.length
        }
        if (l === 0 && lc === 0) {
          return disjSel
        }
        // let included = false
        if (l > 0 && lc > 0) {
          if (desclistItem.descType === selectionType || desclistItem.descType === numberType) {
            disjSel = selectedIs[0].ItemList.filter(item => !(currentSelectedItemsList[0].ItemList.find(item2 => item2.IID === item.IID)))
          } else {
            let itemsToTest = (selectedIs[0].ItemList.filter(item2 => compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
            // remove already included
            disjSel = itemsToTest.filter(item3 => !(currentSelectedItemsList[0].ItemList.find(itemC => itemC.IID === item3.IID)))
          }
          // if search before and current search have results
          if (disjSel.length > 0) {
            resultArray = currentSelectedItemsList[0].ItemList.concat(disjSel)
          } else {
            resultArray = currentSelectedItemsList[0].ItemList
          }
        } else {
          if (l > 0 && lc === 0) {
            // check type of descriptor
            if (desclistItem.descType === selectionType || desclistItem.descType === numberType) {
              resultArray = selectedIs[0].ItemList
            } else {
              disjSel = (selectedIs[0].ItemList.filter(item2 => compareValues(item2, desclistItem))).filter((item2, index, self) => self.findIndex(t => t.IID === item2.IID) === index)
              if (disjSel.length > 0) {
                resultArray = disjSel
                disjSel = [] // reset
              } else {
                resultArray = []
              }
            }
          } else {
            if (l === 0 && lc > 0) {
              console.log('we should not get here? --or?? called when current selected is none and preSelected > 0 ')
              // check type of descriptor
              if (desclistItem.descType === selectionType) {
                resultArray = currentSelectedItemsList[0].ItemList // selectedIs[0].ItemList
                // currentSelectedItemsList = selectedIs[0].ItemList
              } else {
                resultArray = currentSelectedItemsList[0].ItemList
              }
            }
          }
        }
        return resultArray // currentSelectedItemsList
      }
      // inner main function
      // called recursively for each searchStringPart
      function decrumbleSearchString (searchStringPart) {
        callStep = callStep + 1
        for (let i = 0; i < searchStringPart.length; i++) {
          if (Array.isArray(searchStringPart[i]) && (searchStringPart[i].length === 1 || searchStringPart[i].length >= 3)) {
            decrumbleSearchString(searchStringPart[i])
          }
          // if searchStringpart at current position is of length 2 -> filter
          if (Array.isArray(searchStringPart[i]) && searchStringPart[i].length === 2) {
            let descriptorStatePair = searchStringPart[i][0]
            const descriptorStateOperator = searchStringPart[i][1] // categorical -> = or != , numerical one of =, !=. <=, >=, between
            if (descriptorStatePair) {
              let loadedDescriptorItems = []
              if (descriptorStatePair.descType === numberType) {
                loadedDescriptorItems = loadedNumericalDescriptorItems
              } else if (descriptorStatePair.descType === textType) {
                loadedDescriptorItems = loadedTextDescriptorItems
              } else {
                loadedDescriptorItems = loadedCategoricalDescriptorItems
              }
              if (!loadedDescriptorItems || loadedDescriptorItems.length === 0) {
                return
              }
              let selectedIts = []
              let cloneSelected = []
              if (descriptorStatePair.descType === selectionType && descriptorStateOperator === '!=') {
                // if itemNameList is initialized, also IID which have not set descriptor will be returned
                if (isNegativeToleranceMode && itemNameMap) { // && itemNameList && itemNameList.length > 0) {
                  console.log('in negative tolerance mode for categoricals')
                  selectedIts = loadedDescriptorItems.filter(descStateItem => ((descStateItem.CID === descriptorStatePair.CID && descStateItem.CS === descriptorStatePair.CS)))
                  if (!selectedIts || selectedIts.length === 0) {
                    selectedIts = []
                    selectedIts.push({ ItemList: [] })
                  }
                  selectedIts = deepClone(selectedIts)
                  let allItemsWithCID = new Map()
                  // add IID to Map -> iid as key, eliminates duplicates by default -> caution! only last inserted value wins -> works only for categoricals where value is not important
                  // otherwise we have to use .has to check and add new value to old one
                  for (const singleItem of selectedIts[0].ItemList) {
                    allItemsWithCID.set(singleItem.IID, singleItem)
                  }
                  // get all Items which are not in selectedIus
                  let notSetArray = []
                  notSetArray.push({ ItemList: [] })
                  itemNameMap.forEach(function (value, key) {
                    if (!allItemsWithCID.get(key)) {
                      notSetArray[0].ItemList.push(value)
                    }
                  })
                  cloneSelected = deepClone(notSetArray)
                } else {
                  console.log('in negative search NO Tolerance for categoricals')
                  selectedIts = loadedDescriptorItems.filter(descStateItem => ((descStateItem.CID === descriptorStatePair.CID)))
                  selectedIts = deepClone(selectedIts)
                  let allItemsWithCID = new Map()
                  let mapItemsWithCS = new Map() // because of multi-state possiblity for items
                  for (const preIis of selectedIts) {
                    let mapWithCS = false
                    if (preIis.CS === descriptorStatePair.CS) {
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
                  cloneSelected = deepClone(tempItemArray)
                }
              } else {
                if (descriptorStatePair.descType === selectionType && isPositiveToleranceMode && itemNameMap) {
                  console.log('in positive tolerance mode for categoricals')
                  // get all with CID,CS
                  let selectedtts = loadedDescriptorItems.filter(descStateItem => ((descStateItem.CID === descriptorStatePair.CID && descStateItem.CS === descriptorStatePair.CS)))
                  if (!selectedtts || selectedtts.length === 0) {
                    selectedtts = []
                    selectedtts.push({ ItemList: [] })
                  }
                  selectedtts = deepClone(selectedtts)
                  // console.log('selected', selectedtts[0].ItemList)
                  // get all Items where CID is not set
                  let unsetItems = loadedDescriptorItems.filter(items => (items.CID === descriptorStatePair.CID))
                  if (!unsetItems || unsetItems.length === 0) {
                    unsetItems = []
                    unsetItems.push({ ItemList: [] })
                  }
                  unsetItems = deepClone(unsetItems)
                  let allItemsWithCID = new Map()
                  for (const preUnset of unsetItems) {
                    // add IID to Map -> iid as key, eliminates duplicates by default -> caution! only last inserted value wins -> works only for categoricals where value is not important
                    // otherwise we have to use .has to check and add new value to old one
                    for (const singleItem of preUnset.ItemList) {
                      allItemsWithCID.set(singleItem.IID, singleItem)
                    }
                  }
                  let notSetArray = []
                  notSetArray.push({ ItemList: [] })
                  itemNameMap.forEach(function (value, key) {
                    if (!allItemsWithCID.get(key)) {
                      notSetArray[0].ItemList.push(value)
                    }
                  })
                  selectedtts[0].ItemList = selectedtts[0].ItemList.concat(notSetArray[0].ItemList)
                  cloneSelected = deepClone(selectedtts)
                } else {
                  console.log('no tolerance mode for all descriptors')
                  if (descriptorStatePair.descType === QUANTTYPE) {
                    let selectedIs = []
                    let toCloneIts = []
                    toCloneIts.push({ ItemList: [] })
                    toCloneIts = deepClone(toCloneIts)
                    let identicalSelectedItemsList = []
                    let tempArray = loadedDescriptorItems.filter(descStateItem => (descStateItem.CID === descriptorStatePair.CID))
                    tempArray = deepClone(tempArray) // don't forget this one!!!
                    selectedIs = tempArray
                    if (!selectedIs || !selectedIs.length > 0) { // [0] || !selectedIs[0].ItemList.length > 0) {
                      identicalSelectedItemsList = [] // return identicalSelectedItemsList
                    } else {
                      identicalSelectedItemsList = numericalRangeFilter(selectedIs, descriptorStatePair, identicalSelectedItemsList, 'OR')
                    }
                    toCloneIts[0].ItemList = identicalSelectedItemsList
                    cloneSelected = toCloneIts
                  } else {
                    selectedIts = loadedDescriptorItems.filter(descStateItem => (descStateItem.CID === descriptorStatePair.CID && descStateItem.CS === descriptorStatePair.CS))
                    cloneSelected = deepClone(selectedIts)
                  }
                }
              }
              // if there are already selected items
              if (selectedItems.length > 0) {
                let addNew = false
                for (const selI of selectedItems) {
                  if (selI.callStep !== callStep) {
                    addNew = true
                    continue
                  }
                  // and search with selectedItems
                  if (selI.callStep === callStep) {
                    addNew = false
                    if (selI.logicalOperator === 'AND') {
                      if (selI.preSelectedItems) {
                        // if we already had a search before within same () with no result than adding another AND search can't lead to any result
                        if (searchStringPart.length >= 3 && ((selI.preSelectedItems.length === 0) || (selI.preSelectedItems[0] && selI.preSelectedItems[0].ItemList.length === 0))) {
                          // end of this search part
                          if ((i === searchStringPart.length - 1)) {
                            selI.callStep = selI.callStep - 1
                          }
                          selI.logicalOperator = null
                          break
                        }
                        if (!cloneSelected || !cloneSelected[0] || !cloneSelected[0].ItemList.length > 0) {
                          selI.preSelectedItems = []
                          // no new items
                        } else {
                          let pres = selI.preSelectedItems ? selI.preSelectedItems : []
                          let preSelectedIs = logicalAndSearch(cloneSelected, descriptorStatePair, pres)
                          if (selI.preSelectedItems.length > 0) {
                            selI.preSelectedItems[0].ItemList = preSelectedIs
                          } else {
                            selI.preSelectedItems.push({ ItemList: preSelectedIs })
                          }
                        }
                        if (i === searchStringPart.length - 1) {
                          selI.callStep = selI.callStep - 1
                        }
                        selI.logicalOperator = null
                        // }
                        break
                      }
                    } else {
                      if (selI.logicalOperator === 'OR') {
                        if (!cloneSelected || !cloneSelected[0] || !cloneSelected[0].ItemList.length > 0) {
                          console.log('no new matichng items', cloneSelected)
                        } else {
                          let pres = []
                          if (selI.preSelectedItems) {
                            pres = selI.preSelectedItems
                          }
                          let preSelectedIs = logicalOrSearch(cloneSelected, descriptorStatePair, pres)
                          if (selI.preSelectedItems.length > 0) {
                            selI.preSelectedItems[0].ItemList = preSelectedIs
                          } else {
                            selI.preSelectedItems.push({ ItemList: preSelectedIs })
                          }
                          selI.preSelectedItems[0].ItemList = preSelectedIs
                        }
                        if (i === searchStringPart.length - 1) {
                          selI.callStep = selI.callStep - 1
                        }
                        selI.logicalOperator = null
                      }
                    }
                  }
                }
                if (addNew) {
                  // ao callstep is not current callstep -> we load all items and filter and push to selectedItems[callSTep]
                  let localCallStep = callStep
                  // // only one item added
                  if (!cloneSelected || !cloneSelected[0] || !cloneSelected[0].ItemList.length > 0) {
                    selectedItems.push({ 'callStep': localCallStep, 'preSelectedItems': [], 'logicalOperator': null })
                  } else {
                    // compare number values if descriptor type === numberType
                    // if (descriptorStatePair.descType === numberType || descriptorStatePair.descType === textType) {
                    if (descriptorStatePair.descType === textType) {
                      let selecc = []
                      for (let numin = 0; numin < cloneSelected[0].ItemList.length; numin++) {
                        let match = compareValues(cloneSelected[0].ItemList[numin], descriptorStatePair)
                        if (match) {
                          selecc.push(cloneSelected[0].ItemList[numin]) // CHANGE
                        }
                      }
                      // remove duplicates
                      selecc = selecc.filter((item, index, self) => self.findIndex(t => t.IID === item.IID) === index)
                      // let test = getNotSetQuantitativeValues(descriptorStatePair)
                      cloneSelected[0].ItemList = selecc
                    }
                    selectedItems.push({ 'callStep': localCallStep, 'preSelectedItems': cloneSelected, 'logicalOperator': null })
                  }
                }
              } else {
                // load all items and filter and push to selectedItems[callSTep]
                let localCallStep = callStep
                if (!cloneSelected || !cloneSelected[0] || !cloneSelected[0].ItemList.length > 0) {
                  selectedItems.push({ 'callStep': localCallStep, 'preSelectedItems': [], 'logicalOperator': null })
                } else {
                  // compare number values if descriptor type === numberType
                  // if (descriptorStatePair.descType === numberType || descriptorStatePair.descType === textType) {
                  if (descriptorStatePair.descType === textType) {
                    let selec = []
                    for (let numind = 0; numind < cloneSelected[0].ItemList.length; numind++) {
                      let match = compareValues(cloneSelected[0].ItemList[numind], descriptorStatePair)
                      if (match) {
                        selec.push(cloneSelected[0].ItemList[numind]) // CHANGE
                      }
                    }
                    // remove duplicates
                    selec = selec.filter((item, index, self) => self.findIndex(t => t.IID === item.IID) === index)
                    cloneSelected[0].ItemList = selec
                  }
                  selectedItems.push({ 'callStep': localCallStep, 'preSelectedItems': cloneSelected, 'logicalOperator': null })
                }
              }
            } else {
              console.log('Error: upps here??')
              break
            }
          } else { // searchStringpart at current position is no array -> must be operator
            if (typeof searchStringPart[i] === 'string' && selectedItems) {
              // console.log('here we are')
              for (const selIs of selectedItems) {
                if (selIs.callStep === callStep && selIs.preSelectedItems) {
                  const opAndOr = searchStringPart[i]
                  selIs.logicalOperator = opAndOr
                  break
                }
              }
            }
          }
        }
        callStep--
        // if selectedItems still greater than 2 continue comparison of results
        if (selectedItems.length >= 2) {
          // get correct index position for next calculation
          let nextCalcIndex = 0
          for (let iS = 1; iS < selectedItems.length; iS++) {
            if ((selectedItems[iS].callStep === selectedItems[iS - 1].callStep)) {
              nextCalcIndex = iS
              break
            } else {
              continue
            }
          }
          if (nextCalcIndex > 0 && selectedItems[nextCalcIndex - 1].logicalOperator !== null) {
            let resultItems = []
            const logicalOp = selectedItems[nextCalcIndex - 1].logicalOperator
            if (!(selectedItems[nextCalcIndex].preSelectedItems.length === 0 || selectedItems[nextCalcIndex - 1].preSelectedItems.length === 0)) {
              if (logicalOp === 'AND') {
                let presentinboth = selectedItems[nextCalcIndex].preSelectedItems[0].ItemList.filter(firstItem => selectedItems[nextCalcIndex - 1].preSelectedItems[0].ItemList.find(secondItem => secondItem.IID === firstItem.IID))
                presentinboth = deepClone(presentinboth)
                resultItems = resultItems.concat(presentinboth)
              } else {
                resultItems = deepClone(selectedItems[nextCalcIndex].preSelectedItems[0].ItemList)
                let presentonlyinsecond = selectedItems[nextCalcIndex - 1].preSelectedItems[0].ItemList.filter(second => !selectedItems[nextCalcIndex].preSelectedItems[0].ItemList.find(first => first.IID === second.IID))
                presentonlyinsecond = deepClone(presentonlyinsecond)
                resultItems = resultItems.concat(presentonlyinsecond)
              }
            }
            if (resultItems.length >= 0) {
              selectedItems[nextCalcIndex - 1].callStep = callStep // selectedItems[nextCalcIndex].callStep - 1
              selectedItems[nextCalcIndex - 1].logicalOperator = selectedItems[nextCalcIndex].logicalOperator
              if (selectedItems[nextCalcIndex - 1].preSelectedItems.length === 0) {
                selectedItems[nextCalcIndex - 1].preSelectedItems.push({ ItemList: resultItems })
              } else {
                selectedItems[nextCalcIndex - 1].preSelectedItems[0].ItemList = resultItems
              }
              // delete second element
              selectedItems.pop()
            }
          }
        }
        // check if callStep of selectedItem is greater than current callstep -> than set selectedItem callStep to currentCallstep
        for (const selI of selectedItems) {
          if (selI.callStep > callStep) {
            selI.callStep = callStep
          }
        }
      }
    }
  }
}
