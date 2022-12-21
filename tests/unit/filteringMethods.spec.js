import filteringMethods from '@/mixins/filteringMethods.js'

const categoricalFilters = [ { CID: 1, CS: '1', ItemList: [{ IID: 61, Value: '1'}, { IID: 62, Value: '1'}, { IID: 63, Value: '1'}, { IID: 64, Value: '1'}] },
{ CID: 1, CS: '2', ItemList: [{ IID: 62, Value: '2'}, { IID: 64, Value: '2'}] },
{ CID: 2, CS: '1', ItemList: [{ IID: 62, Value: '1'}, { IID: 66, Value: '1'}, { IID: 67, Value: '1'}, { IID: 68, Value: '1'}] },
{ CID: 2, CS: '2', ItemList: [{ IID: 69, Value: '2'}, { IID: 70, Value: '2'}] },
{ CID: 6, CS: '1', ItemList: [{ IID: 61, Value: '2'}, { IID: 70, Value: '2'}] },
{ CID: 6, CS: '2', ItemList: [{ IID: 66, Value: '2'}, { IID: 70, Value: '2'}] }]
const quantiativeFilters = [ { CID: 3, CS: 'Max', ItemList: [{ IID: 61, Value: '12'}, { IID: 62, Value: '20'}, { IID: 63, Value: '10'}, { IID: 64, Value: '11'}]},
{ CID: 3, CS: 'Min', ItemList: [{ IID: 61, Value: '2'}, { IID: 63, Value: '4'}, { IID: 67, Value: '1'}, { IID: 68, Value: '1'}]},
{ CID: 3, CS: 'UMethLower', ItemList: [{ IID: 61, Value: '4'}, { IID: 62, Value: '7'}, { IID: 63, Value: '6'}, { IID: 64, Value: '8'}]},
{ CID: 3, CS: 'UMethUpper', ItemList: [{ IID: 61, Value: '10'}, { IID: 63, Value: '8'}, { IID: 67, Value: '8'}, { IID: 68, Value: '10'}]},
{ CID: 4, CS: 'Max', ItemList: [{ IID: 66, Value: '12'}, { IID: 67, Value: '20'}, { IID: 69, Value: '10'}, { IID: 70, Value: '11'}]} ]
const textFilters = [{ CID: 5, CS: 'TE', ItemList: [{ IID: 61, Value: 'test'}, { IID: 62, Value: 'oder'}, { IID: 66, Value: 'te'}]}]
const fileNameLists = [{ IID: 61, ItemID: 332, ItemName: ' Flechte 1', Notes: null}, 
{ IID: 62, ItemID: 333, ItemName: ' Flechte 2', Notes: null},
{ IID: 63, ItemID: 334, ItemName: ' Flechte 3', Notes: null},
{ IID: 64, ItemID: 335, ItemName: ' Flechte 4', Notes: null},
{ IID: 65, ItemID: 336, ItemName: ' Flechte 5', Notes: null},
{ IID: 66, ItemID: 337, ItemName: ' Flechte 6', Notes: null},
{ IID: 67, ItemID: 338, ItemName: ' Flechte 7', Notes: null},
{ IID: 68, ItemID: 339, ItemName: ' Flechte 8', Notes: null},
{ IID: 69, ItemID: 340, ItemName: ' Flechte 9', Notes: null},
{ IID: 70, ItemID: 341, ItemName: ' Flechte 10', Notes: null}]
const itemNameMap = new Map()
itemNameMap.set(61, { IID: 61, ItemID: 332, ItemName: ' Flechte 1', Notes: null})
itemNameMap.set(62, { IID: 62, ItemID: 333, ItemName: ' Flechte 2', Notes: null})
itemNameMap.set(63, { IID: 63, ItemID: 332, ItemName: ' Flechte 3', Notes: null})
itemNameMap.set(64, { IID: 64, ItemID: 332, ItemName: ' Flechte 4', Notes: null})
itemNameMap.set(65, { IID: 65, ItemID: 332, ItemName: ' Flechte 5', Notes: null})
itemNameMap.set(66, { IID: 66, ItemID: 332, ItemName: ' Flechte 6', Notes: null})
itemNameMap.set(67, { IID: 67, ItemID: 332, ItemName: ' Flechte 7', Notes: null})
itemNameMap.set(68, { IID: 68, ItemID: 332, ItemName: ' Flechte 8', Notes: null})
itemNameMap.set(69, { IID: 69, ItemID: 332, ItemName: ' Flechte 9', Notes: null})
itemNameMap.set(70, { IID: 70, ItemID: 332, ItemName: ' Flechte 10', Notes: null})

// describe("Compare quantitative values", () => {
//   test(' 22 >= 20 should return true', () => {
//     const itemInDB = { IID: '1', Value: 22 }
//     const userDescriptorSearchItem = { descType: 'quantitative', descriptorStateUserInputs: ['>=', 20] }
//     const value = filteringMethods.methods.compareNumberValues(itemInDB, userDescriptorSearchItem)
//     expect(value).toBe(true);
//   });
//  })

 describe("Filter: 1 categorical Descriptor-State", () => {
    test(' filter all items with CID: 1 - CS: 2 -> should return IID 62, 64', () => {
      const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }]
      // // const newPair = { CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }
      const searchString = ['AND', 'OR']
      filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
      const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
      expect(result.length === 2).toBe(true)
      expect(result[0].IID).toBe(62)
      expect(result[1].IID).toBe(64)
    })
 })

 describe("Filter: Categorical Descriptor-State and AND operator", () => {
  test(' filter all items with CID: 1 - CS: 2 AND 2. CID: 2 - CS: 1 should return IID 62', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 },
  { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 233 }]
    // // const newPair = { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 233 }
    // const pre = [{IID: 62, Value: '2'}, {IID: 64, Value: '2'}]
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: Two Categorical Descriptor-State with AND operator", () => {
  test(' filter all items with CID: 1 - CS: 2 AND CID: 2 - CS: 1 should return IID 62', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 },
  { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 233 }]
    // const newPair = null
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: Categorical Descriptor-State and OR operator", () => {
  test(' filter all items with CID: 1 - CS: 2 OR 2. CID: 2 - CS: 1 should return IID 62, 64, 66, 67, 68', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 },
  { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 233 }]
    // // const newPair = { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 233 }
    // const pre = [{IID: 62, Value: '2'}, {IID: 64, Value: '2'}]
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 5).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(66)
    expect(result[3].IID).toBe(67)
    expect(result[4].IID).toBe(68)
  })
})

describe("Filter: Categorical Descriptor-State with OR operator", () => {
  test(' filter all items with CID: 1 - CS: 2 OR CID: 2 - CS: 1 should return IID 62, 64, 66, 67, 68', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 },
  { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 233 }]
    // // const newPair = null
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 5).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(66)
    expect(result[3].IID).toBe(67)
    expect(result[4].IID).toBe(68)
  })
})
// start quantitative tests: CAUTION simple search always includes all states so the CS value has no meaning!!
describe("Filter: 1 quantitative Descriptor with all states! and >= comparison", () => {
  test(' filter all items with CID: 3 - CS: >= 11 excl. Extreme-> should return IID 61, 62, 64', () => {
    const selectedPairs = [{ CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }]
    // // const newPair = { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(false)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 0).toBe(true)
    // expect(result[0].IID).toBe(61)
    // expect(result[1].IID).toBe(62)
    // expect(result[2].IID).toBe(64)
  })
})

describe("Filter: 1 quantitative Descriptor with all states! and >= comparison", () => {
  test(' filter all items with CID: 3 - CS: >= 11 incl. Extreme-> should return IID 61, 62, 64', () => {
    const selectedPairs = [{ CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }]
    // // const newPair = { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 3).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
    expect(result[2].IID).toBe(64)
  })
})

describe("Filter: 1 quantitative Descriptor and all states and between comparison", () => {
  test(' filter all items with CID: 3 - CS: between 12 AND 20 excl. extreme values-> should return IID 61, 62', () => {
    const selectedPairs = [{ CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['between', 12, 20], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }]
    // // const newPair = { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['between', 12, 20], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(false)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 0).toBe(true)
    // expect(result[0].IID).toBe(61)
    // expect(result[1].IID).toBe(62)
  })
})

describe("Filter: 1 quantitative Descriptor and all states and between comparison", () => {
  test(' filter all items with CID: 3 - CS: between 12 AND 20 incl. extreme values-> should return IID 61, 62', () => {
    const selectedPairs = [{ CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['between', 12, 20], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }]
    // // const newPair = { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['between', 12, 20], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2242 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
  })
})

describe("Filter: Categorical Descriptor AND Quantitative Descriptor", () => {
  test(' filter all items with CID: 1 - CS: 2 AND 2. CID: 3 - CS: >= 12 incl extreme - should return IID 62', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2262 },
    { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2272 }]
    // // const newPair = { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2272 }
    // const pre = [{IID: 62, Value: '2'}, {IID: 64, Value: '2'}]
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: Quantitative Descriptor AND Categorical Descriptor", () => {
  test(' filter all items with CID: 3 - CS: >= 11 incl extreme AND 2. CID: 1 - CS: 2  should return IID 62, 64', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2292 },
    { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 2252 }]
    // // const newPair = { CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2292 }
    // const pre = [{IID: 61, Value: '12'}, {IID: 62, Value: '20'}, {IID: 64, Value: '11'}]
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
  })
})

describe("Filter: Quantitative Descriptor AND Categorical Descriptor", () => {
  test(' filter all items with CID: 3 - CS: >= 11 excl extreme AND CID: 1 - CS: 2  should return null', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 },
    { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 765 }]
    // // const newPair = null
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(false)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 0).toBe(true)
    // expect(result[0].IID).toBe(62)
    // expect(result[1].IID).toBe(64)
  })
})

describe("Filter: 1 quantitative Descriptor and >= comparison", () => {
  test(' filter all items with CID: 3 - CS: >= 10 excl. extreme -> should return IID 61, 62, 63, 64, 67, 68', () => {
    // CAUTION the CS value 'Min' does not have influence in simple search (-> alway all states included)
    const selectedPairs = [{ CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 10], displayName: 'descriptor3:stateMin', selectionId: 1, stateID: 813 }]
    // // const newPair = { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 1, stateID: 813 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(false)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(68)
  })
})

describe("Filter: 1 quantitative Descriptor with ALL STATES and >= comparison", () => {
  test(' filter all items with CID: 3 - CS: >= 10 incl. extreme -> should return IID 61, 62, 63, 64, 67, 68', () => {
    // CAUTION the CS value 'Min' does not have influence in simple search (-> alway all states included)
    const selectedPairs = [{ CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 10], displayName: 'descriptor3:stateMin', selectionId: 1, stateID: 813 }]
    // // const newPair = { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 1, stateID: 813 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 5).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
    expect(result[2].IID).toBe(63)
    expect(result[3].IID).toBe(64)
    expect(result[4].IID).toBe(68)
  })
})

describe("Filter: Quantitative Descriptor OR Categorical Descriptor", () => {
  test(' filter all items with CID: 3 - CS: >= 1 OR CID: 1 - CS: 2  should return IID 61,62,63,64,67,68,69,70', () => {
    const selectedPairs = [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 232 },
    { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 1, stateID: 2542 }]
    // // const newPair = null // { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 8).toBe(true)
    expect(result[0].IID).toBe(69)
    expect(result[1].IID).toBe(70)
    expect(result[2].IID).toBe(61)
    expect(result[3].IID).toBe(62)
    expect(result[4].IID).toBe(63)
    expect(result[5].IID).toBe(64)
    expect(result[6].IID).toBe(67)
    expect(result[7].IID).toBe(68)
  })
})

describe("Filter: Quantitative Descriptor OR Categorical Descriptor", () => {
  test(' filter all items with CID: 2 - CS: 2 OR 2. CID: 3 - CS: >=7  should return IID 61,62,63,64,67,68,69,70', () => {
    const selectedPairs = [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 232 },
    { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 7], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }]
    // // const newPair = { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }
    // const pre = [{IID: 69, Value: '2'}, {IID: 70, Value: '2'}]
    const searchString = ['OR', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 8).toBe(true)
    expect(result[0].IID).toBe(69)
    expect(result[1].IID).toBe(70)
    expect(result[2].IID).toBe(61)
    expect(result[3].IID).toBe(62)
    expect(result[4].IID).toBe(63)
    expect(result[5].IID).toBe(64)
    expect(result[6].IID).toBe(67)
    expect(result[7].IID).toBe(68)
  })
})

describe("Filter: Quantitative Descriptor AND 2 Categorical Descriptor", () => {
  test(' filter all items with CID: 3 - CS: >= 11 AND CID: 1 - CS: 2  should return IID 62', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 },
    { CID: 3, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMax', selectionId: 0, stateID: 765 },
    { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 229 }]
    // // const newPair = null
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: 1 textual Descriptor", () => {
  test(' filter all items with CID: 5 - CS: TE="te" -> should return IID 61, 66', () => {
    const selectedPairs = [{ CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 }]
    // // const newPair = { CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 }
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(66)
  })
})

describe("Filter: quantitative descriptor >=12", () => {
  test(' filter all items with CID:4 CS>=12 -> should return IID 66, 67', () => {
    const selectedPairs = [{ CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }]
    // // const newPair = { CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(66)
    expect(result[1].IID).toBe(67)
  })
})
describe("Filter: 1 textual Descriptor and quantitative descriptor >=12", () => {
  test(' filter all items with CID: 5 - CS: TE="te" AND CID:4 CS>=12 -> should return IID 66', () => {
    const selectedPairs = [{ CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 },
    { CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor5:stateQuant', selectionId: 0, stateID: 898 }]
    // const newPair = { CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor5:stateQuant', selectionId: 0, stateID: 898 }
    // const pre = [{IID: 61, Value:'test'}, { IID: 66, Value: 'te'}]
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(66)
  })
})
describe("Filter: 1 textual Descriptor or quantitative descriptor >=12", () => {
  test(' filter all items with CID: 5 - CS: TE="te" OR CID:4 CS>=12 -> should return IID 61, 66, 67', () => {
    const selectedPairs = [{ CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 },
    { CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor5:stateQuant', selectionId: 0, stateID: 898 }]
    // const newPair = { CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 12], displayName: 'descriptor5:stateQuant', selectionId: 0, stateID: 898 }
    // const pre = [{IID: 61, Value:'test'}, { IID: 66, Value: 'te'}]
    const searchString = ['OR', 'OR']
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 3).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(66)
    expect(result[2].IID).toBe(67)
  })
})
// quantitative  - != mode
describe("Filter: Categorical Descriptor-State with !=  and include nulls", () => {
  test(' filter all items that have not CID: 1 - CS: 2 including nulls -> should not return IID 62, 64', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['!='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 239 }]
    // const newPair = { CID: 1, CS: '2', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['!='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 239 }
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    // to include nulls
    // to include nulls
    filteringMethods.methods.initToleranceModes(true, false)
    filteringMethods.methods.initNameMap(itemNameMap)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 8).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(63)
    expect(result[2].IID).toBe(65)
    expect(result[3].IID).toBe(66)
    expect(result[4].IID).toBe(67)
    expect(result[5].IID).toBe(68)
    expect(result[6].IID).toBe(69)
    expect(result[7].IID).toBe(70)
  })
})
describe("Filter: Categorical Descriptor-State with !=  not including nulls", () => {
  test(' filter all items that have not CID: 1 - CS: 2 without nulls -> should return IID 61, 63', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['!='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 239 }]
    // const newPair = { CID: 1, CS: '2', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['!='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 239 }
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    // to exclude nulls
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    // filteringMethods.methods.initInvertedNameFilters(null)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(63)
  })
})

describe("Filter: Categorical Descriptor-State with =  including nulls", () => {
  test(' filter all items that have CID: 1 - CS: 2 or nulls -> should NOT return IID 61, 63', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 239 }]
    // const newPair = { CID: 1, CS: '2', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 239 }
    const searchString = ['AND', 'OR']
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, true)
    filteringMethods.methods.initNameMap(itemNameMap)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    // to include nulls
    // filteringMethods.methods.initInvertedNameFilters(fileNameLists)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 8).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(65)
    expect(result[3].IID).toBe(66)
    expect(result[4].IID).toBe(67)
    expect(result[5].IID).toBe(68)
    expect(result[6].IID).toBe(69)
    expect(result[7].IID).toBe(70)
  })
})
describe("Filter: Quantitative Descriptor AND Categorical Descriptor (in tolerance)", () => {
  test(' filter all items with CID: 3 - CS: >= 0 AND (2. CID: 1 - CS: 2 OR null) should return IID 67, 68', () => {
    const selectedPairs = [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2292 },
    { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 0], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2252 }]
    // const newPair = { CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2292 }
    const searchString = ['AND', 'OR']
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, true)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    filteringMethods.methods.initNameMap(itemNameMap)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 4).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(67)
    expect(result[3].IID).toBe(68)
  })
})
describe("Filter: 1 textual Descriptor AND 2 identical categorical descriptor with different states (OR) no tolerance mode", () => {
  test(' filter all items with CID: 5 - CS: TE="te" AND CID:2 CS=1 OR CID:2 CS=2 -> should return IID 66', () => {
    const selectedPairs = [{ CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 },
    { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 239 },
    { CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 238 }]
    // const newPair = null
    // const pre = [{IID: 61, Value:'test'}, { IID: 66, Value: 'te'}]
    const searchString = ['AND', 'OR']
    // to exclude nulls
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(66)
  })
})
describe("Filter: 1 textual Descriptor AND 2 identical categorical descriptor with different states (OR) with tolerance mode", () => {
  test(' filter all items with CID: 5 - CS: TE="te" AND CID:2 CS=1 OR CID:2 CS=2 -> should return IID 66', () => {
    const selectedPairs = [{ CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 },
    { CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 239 },
    { CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 238 }]
    // const newPair = null
    // const pre = [{IID: 61, Value:'test'}, { IID: 66, Value: 'te'}]
    const searchString = ['AND', 'OR']
    // to include nulls
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, true)
    filteringMethods.methods.initNameMap(itemNameMap)
    // filteringMethods.methods.initInvertedNameFilters(fileNameLists)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(66)
  })
})
describe("Filter: 1 textual Descriptor AND 2 identical categorical descriptor with different states (OR) no tolerance mode", () => {
  test(' filter all items with CID: 5 - CS: TE="te" AND CID:6 CS=1 OR CID:6 CS=2 -> should return IID 61, 66', () => {
    const selectedPairs = [{ CID: 5, CS: 'TE', csName: 'TE', descName: 'descriptor5', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor5:stateTE', selectionId: 0, stateID: 992 },
    { CID: 6, CS: '1', csName: 'state1', descName: 'descriptor6', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor6:state1', selectionId: 0, stateID: 2398 },
    { CID: 6, CS: '2', csName: 'state2', descName: 'descriptor6', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor6:state1', selectionId: 0, stateID: 23987 }]
    // const newPair = null
    // const pre = [{IID: 61, Value:'test'}, { IID: 66, Value: 'te'}]
    const searchString = ['AND', 'OR']
    // to exclude nulls
    // filteringMethods.methods.initInvertedNameFilters(null)
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(66)
  })
})
describe("Filter: Two identical Quantitative Descriptor with OR ", () => {
  test(' filter all items with CID: 3 - CS: >= 11 OR CID: 3 - CS: <= 2  should return IID 61,62,64,67,68', () => {
    const selectedPairs = [{ CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 },
    { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['<=', 2], displayName: 'descriptor3:stateMin', selectionId: 2, stateID: 2542 }]
    // const newPair = null // { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }
    const searchString = ['AND', 'OR']
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 5).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
    expect(result[2].IID).toBe(64)
    expect(result[3].IID).toBe(67)
    expect(result[4].IID).toBe(68)
  })
})
describe("Filter: Two identical Quantitative Descriptor with AND ", () => {
  test(' filter all items with CID: 3 - CS: >= 11 AND CID: 3 - CS: <= 2  incl. extreme values - should return IID 61', () => {
    const selectedPairs = [{ CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 },
    { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['<=', 2], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }]
    // const newPair = null // { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }
    const searchString = ['AND', 'AND']
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(true)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(61)
  })
})
describe("Filter: Two identical Quantitative Descriptor with AND ", () => {
  test(' filter all items with CID: 3 - CS: >= 11 AND CID: 3 - CS: <= 2  excl. extreme values - should return []', () => {
    const selectedPairs = [{ CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 },
    { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['<=', 2], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }]
    // const newPair = null // { CID: 3, CS: 'Min', csName: 'Min', descName: 'descriptor3', descType: 'quantitative', descriptorStateUserInputs: ['>=', 1], displayName: 'descriptor3:stateMin', selectionId: 0, stateID: 2542 }
    const searchString = ['AND', 'AND']
    // to include nulls
    filteringMethods.methods.initToleranceModes(false, false)
    filteringMethods.methods.initNameMap(null)
    filteringMethods.methods.initNumFilterIncludeExtremeValues(false)
    filteringMethods.methods.initInvertedFilters(categoricalFilters, quantiativeFilters, textFilters)
    const result = filteringMethods.methods._getSelectedItems(searchString, selectedPairs)
    expect(result.length === 0).toBe(true)
  })
})
