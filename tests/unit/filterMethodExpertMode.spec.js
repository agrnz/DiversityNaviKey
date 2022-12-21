import filterMethodExpertMode from '@/mixins/filterMethodExpertMode.js'

const categoricalFilters = [ { CID: 1, CS: '1', ItemList: [{ IID: 61, Value: '1'}, { IID: 62, Value: '1'}, { IID: 63, Value: '1'}, { IID: 64, Value: '1'}] },
{ CID: 1, CS: '2', ItemList: [{ IID: 62, Value: '2'}, { IID: 64, Value: '2'}] },
{ CID: 1, CS: '3', ItemList: [] },
{ CID: 2, CS: '1', ItemList: [{ IID: 62, Value: '1'}, { IID: 66, Value: '1'}, { IID: 67, Value: '1'}, { IID: 68, Value: '1'}] },
{ CID: 2, CS: '2', ItemList: [{ IID: 69, Value: '2'}, { IID: 70, Value: '2'}] },
{ CID: 3, CS: '1', ItemList: [{ IID: 62, Value: '3'}, { IID: 70, Value: '3'}] },
{ CID: 3, CS: '2', ItemList: [{ IID: 69, Value: '3'}, { IID: 70, Value: '3'}] }]
const quantiativeFilters = [ { CID: 4, CS: 'Max', ItemList: [{ IID: 61, Value: '12'}, { IID: 62, Value: '20'}, { IID: 63, Value: '10'}, { IID: 64, Value: '11'}]},
{ CID: 4, CS: 'Min', ItemList: [{ IID: 61, Value: '2'}, { IID: 63, Value: '4'}, { IID: 67, Value: '1'}, { IID: 68, Value: '1'}]},
{ CID: 4, CS: 'Mean', ItemList: [{ IID: 61, Value: '2'}, { IID: 63, Value: '5'}, { IID: 70, Value: '1'}]},
{ CID: 5, CS: 'Max', ItemList: [{ IID: 66, Value: '12'}, { IID: 67, Value: '20'}, { IID: 69, Value: '10'}, { IID: 70, Value: '11'}]} ]
const textFilters = [{ CID: 6, CS: 'TE', ItemList: [{ IID: 61, Value: 'test'}, { IID: 61, Value: 'te'}, { IID: 62, Value: 'oder'}, { IID: 66, Value: 'te'}]}]
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

 describe("Filter: 1 categorical Descriptor-State", () => {
    test(' filter all items with CID: 1 - CS: 2 -> should return IID 62, 64', () => {
      const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '=']]
      filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
      filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
      filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
      const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
      expect(result.length === 2).toBe(true)
      expect(result[0].IID).toBe(62)
      expect(result[1].IID).toBe(64)
    })
 })
 describe("Filter: 1 categorical Descriptor-State in tolerance mode", () => {
  test(' filter all items that have CID: 1 - CS: 2 or nulls -> should NOT return IID 61, 63', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    // for tolerance mode
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(itemNameMap)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
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

 describe("Filter: 1 text Descriptor-State", () => {
  test(' filter all items with CID: 6 - CS: TE -> should return IID 61, 66', () => {
    const searchString = [[{ CID: 6, CS: 'TE', csName: 'TE', descName: 'descriptor6', descType: 'text', descriptorStateUserInputs: ['contains', 'te'], displayName: 'descriptor6:stateTE', selectionId: 0, stateID: 222 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(66)
  })
})

 describe("Filter: 2 categorical Descriptor-State grouped with AND", () => {
  test(' filter all items with CID: 1 - CS: 2 AND CID: 2-CS: 1 -> should return IID 62', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    // filterMethodExpertMode.methods.initToleranceModes (false, false)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: 3 categorical Descriptor-State grouped with AND", () => {
  test(' filter all items with CID: 1 - CS: 2 AND CID: 2-CS: 1 AND CID: 3 - CS: 1-> should return IID 62', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'AND',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    // filterMethodExpertMode.methods.initToleranceModes (false, false)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: 1 categorical Descriptor-State grouped with AND, where CID 1 CS has no values", () => {
  test(' filter all items with CID: 1 - CS: 3 AND CID: 1-CS: 1 -> should return 0', () => {
    const searchString = [[{ CID: 1, CS: '3', csName: 'state3', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state3', selectionId: 0, stateID: 322 }, '='],
    'AND',
    [{ CID: 1, CS: '1', csName: 'state1', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state1', selectionId: 0, stateID: 212 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    // filterMethodExpertMode.methods.initToleranceModes (false, false)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    console.log('result should not beee', result)
    expect(result.length === 0).toBe(true)
  })
})

describe("Filter: 2 categorical Descriptor-State grouped with OR", () => {
  test(' filter all items with CID: 1 - CS: 2 OR CID: 2-CS: 1 -> should return IID 62, 64, 66, 67, 68', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'OR',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 5).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(66)
    expect(result[3].IID).toBe(67)
    expect(result[4].IID).toBe(68)
  })
})
describe("Filter: 3 categorical Descriptor-State grouped with OR", () => {
  test(' filter all items with CID: 1 - CS: 2 OR CID: 2-CS: 1 OR CID: 3 - CS: 1-> should return IID 62, 64, 66, 67, 68, 70', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'OR',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'OR',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 6).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(66)
    expect(result[3].IID).toBe(67)
    expect(result[4].IID).toBe(68)
    expect(result[5].IID).toBe(70)
  })
})
describe("Filter: 3 quantitative Descriptor-State grouped with OR", () => {
  test(' filter all items with CID: 4 - CS:  >= 2 -> should return IID 61, 62, 63, 64', () => {
    const searchString = [[{ CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor1', descType: 'quantitative', descriptorStateUserInputs: ['>=', 2], displayName: 'descriptor4:stateMax', selectionId: 0, stateID: 555 }, '='],
    'OR']
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNumFilterIncludeExtremeValues(true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 4).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
    expect(result[2].IID).toBe(63)
    expect(result[3].IID).toBe(64)
  })
})

describe("Filter: (1AND(2OR3))", () => {
  test(' should return IID 62', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [[{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'OR',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: ((1OR2)AND(3OR4))", () => {
  test(' should return IID 62', () => {
    const searchString = [[[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'OR',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '=']],
    'AND',
    [[{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'OR',
    [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 216 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: (((1AND2)OR(2AND3))OR(3AND4))", () => {
  test(' should return IID 62,70', () => {
    const searchString = [[[[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '=']],
    'OR',
    [[{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'AND',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']]],
    'OR',
    [[{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'AND',
    [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 216 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(70)
    expect(result[1].IID).toBe(62)
  })
})

describe("Filter: ((1OR2)AND3)", () => {
  test(' should return IID 62', () => {
    const searchString = [[[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'OR',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '=']],
    'AND',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: (1AND(2OR3)", () => {
  test(' should return IID 62', () => {
    const searchString = [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [[{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'OR',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: (5OR6)", () => {
  test(' should return IID 61,62,64,66,67,70', () => {
    const searchString = [[{ CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor4:stateMax', selectionId: 0, stateID: 555 }, '='],
    'OR',
    [{ CID: 5, CS: 'Max', csName: 'Max', descName: 'descriptor5', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor5:stateMax', selectionId: 0, stateID: 595 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNumFilterIncludeExtremeValues(true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 6).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
    expect(result[2].IID).toBe(64)
    expect(result[3].IID).toBe(66)
    expect(result[4].IID).toBe(67)
    expect(result[5].IID).toBe(70)
  })
})

describe("Filter: (1AND(2OR3OR4)AND(5OR6))", () => {
  test(' should return IID 62', () => {
    const searchString = [[{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'AND',
    [[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'OR',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'OR',
    [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 216 }, '=']],
    'AND',
    [[{ CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor4:stateMax', selectionId: 0, stateID: 555 }, '='],
    'OR',
    [{ CID: 5, CS: 'Max', csName: 'Max', descName: 'descriptor5', descType: 'quantitative', descriptorStateUserInputs: ['>=', 11], displayName: 'descriptor5:stateMax', selectionId: 0, stateID: 595 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNumFilterIncludeExtremeValues(true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(62)
  })
})

describe("Filter: ((1AND2)AND3)", () => {
  test(' should return IID 70', () => {
    const searchString = [[[{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'AND',
    [{ CID: 3, CS: '2', csName: 'state2', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state2', selectionId: 0, stateID: 218 }, '=']],
    'AND',
    [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 216 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 1).toBe(true)
    expect(result[0].IID).toBe(70)
  })
})

describe("Filter: ((1AND2)OR((2OR3)AND(3OR4)))", () => {
  test(' should return IID 62,70', () => {
    const searchString = [[[{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '=']],
    'OR',
    [[[{ CID: 2, CS: '1', csName: 'state1', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state1', selectionId: 0, stateID: 212 }, '='],
    'OR',
    [{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '=']],
    'AND',
    [[{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'OR',
    [{ CID: 2, CS: '2', csName: 'state2', descName: 'descriptor2', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor2:state2', selectionId: 0, stateID: 216 }, '=']]]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(70)
  })
})

describe("Filter: ((1AND2)OR(3AND4)", () => {
  test(' should return IID 62,64,70', () => {
    const searchString = [[[{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'AND',
    [{ CID: 3, CS: '2', csName: 'state2', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state2', selectionId: 0, stateID: 218 }, '=']],
    'OR',
    [[{ CID: 1, CS: '1', csName: 'state1', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state1', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2992 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 3).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(64)
    expect(result[2].IID).toBe(70)
  })
})

describe("Filter: ((1AND2)OR(3AND4) mit tolerance", () => {
  test(' should return IID 62,64,70', () => {
    const searchString = [[[{ CID: 3, CS: '1', csName: 'state1', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state1', selectionId: 0, stateID: 215 }, '='],
    'AND',
    [{ CID: 3, CS: '2', csName: 'state2', descName: 'descriptor3', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor3:state2', selectionId: 0, stateID: 218 }, '=']],
    'OR',
    [[{ CID: 1, CS: '1', csName: 'state1', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state1', selectionId: 0, stateID: 222 }, '='],
    'AND',
    [{ CID: 1, CS: '2', csName: 'state2', descName: 'descriptor1', descType: 'categorical', descriptorStateUserInputs: ['='], displayName: 'descriptor1:state2', selectionId: 0, stateID: 2992 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(itemNameMap)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 10).toBe(true)
  })
})

describe("Filter: 1 quantitative Descriptor-State", () => {
  test(' filter all items with CID: 4 - CS: Max >= 2 -> should return IID 61, 62, 63, 64', () => {
    const searchString = [[{ CID: 4, CS: 'Max', csName: 'Max', descName: 'descriptor1', descType: 'quantitative', descriptorStateUserInputs: ['>=', 2], displayName: 'descriptor4:stateMax', selectionId: 0, stateID: 555 }, '=']]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNumFilterIncludeExtremeValues(true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 4).toBe(true)
    expect(result[0].IID).toBe(61)
    expect(result[1].IID).toBe(62)
    expect(result[2].IID).toBe(63)
    expect(result[3].IID).toBe(64)
  })
})

describe("Filter: 2 quantitative Descriptor-State grouped with OR and excl. extreme values - no result (2or3)", () => {
  test(' filter all items with CID: 4-CS: OR CID: 5 - CS: >= 20 -> should return empty array', () => {
    const searchString = [
    [[{ CID: 4, CS: 'Min', csName: 'Min', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 20], displayName: 'descriptor4:stateMin', selectionId: 0, stateID: 551 }, '='],
    'OR',
    [{ CID: 5, CS: 'Mean', csName: 'Mean', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 20], displayName: 'descriptor$:stateMean', selectionId: 0, stateID: 552 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNumFilterIncludeExtremeValues(false)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 0).toBe(true)
  })
})

describe("Filter: 2 quantitative Descriptor-State grouped with OR and incl. extreme values - (2or3) - result", () => {
  test(' filter all items with CID: 4-CS: OR CID: 5 - CS: >= 20 -> should return empty array', () => {
    const searchString = [
    [[{ CID: 4, CS: 'Min', csName: 'Min', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 20], displayName: 'descriptor4:stateMin', selectionId: 0, stateID: 551 }, '='],
    'OR',
    [{ CID: 5, CS: 'Mean', csName: 'Mean', descName: 'descriptor4', descType: 'quantitative', descriptorStateUserInputs: ['>=', 20], displayName: 'descriptor$:stateMean', selectionId: 0, stateID: 552 }, '=']]]
    filterMethodExpertMode.methods.initInvertedFiltersAdvancedMode(categoricalFilters, quantiativeFilters, textFilters)
    filterMethodExpertMode.methods.initToleranceModesAdvancedMode(false, false)
    filterMethodExpertMode.methods.initNumFilterIncludeExtremeValues(true)
    filterMethodExpertMode.methods.initNameMapAdvancedMode(null)
    const result = filterMethodExpertMode.methods.getFilteredItemsAdvancedMode(searchString)
    expect(result.length === 2).toBe(true)
    expect(result[0].IID).toBe(62)
    expect(result[1].IID).toBe(67)
  })
})