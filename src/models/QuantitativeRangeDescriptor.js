const NUM_UMETHLOW = 'UMethLower'
const NUM_UMETHUPP = 'UMethUpper'
const NUM_MIN = 'Min'
const NUM_MEAN = 'Mean'
const NUM_MAX = 'Max'

// Type class for QuantitativeRangeDescriptor
function QuantitativeRangeDescriptorDataType () {
  // this.a = a;
  // this.b = 2;
}
QuantitativeRangeDescriptorDataType.prototype = {
  // Object itemMap maps all values for the five different states (UMETHUPP, ..) to each IID
  // itemMap = {key: item.IID, {values: [{ CID: .., CS:.., Value: item.Value }]}}
  getNumMatches: function (itemMap, userOperator, userValues, inclExtrem) {
    let dSel = []
    itemMap.forEach(function (value, key) {
      if (value.values && value.values.length > 0) {
        if (inclExtrem) {
          dSel = getNumMatchesInclExtremValues(key, value, userOperator, userValues, dSel)
        } else {
          dSel = getNumMatchexExclExtremValues(key, value, userOperator, userValues, dSel)
        }
      }
    })
    function getNumMatchexExclExtremValues (key, value, userOperator, userValues, resultValues) {
      let testOtherStates = value.values.find(state => (state.CS !== NUM_MAX && state.CS !== NUM_MEAN && state.CS !== NUM_MIN && state.CS !== NUM_UMETHLOW && state.CS !== NUM_UMETHUPP))
      // console.log('test', testOtherStates)
      if (userOperator === '=') {
        let matchL = false
        let matchU = false
        if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
          if (Number(totest.Value) <= Number(userValues[0])) {
            matchL = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_MEAN)) {
            let totest = value.values.find(state => state.CS === NUM_MEAN)
            if (Number(totest.Value) <= Number(userValues[0])) {
              matchL = true
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
          if (Number(totest.Value) >= Number(userValues[0])) {
            matchU = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_MEAN)) {
            let totest = value.values.find(state => state.CS === NUM_MEAN)
            if (Number(totest.Value) >= Number(userValues[0])) {
              matchU = true
            }
          }
        }
        // check exact match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) === Number(userValues[0])) {
                matchL = true
                matchU = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) === Number(userValues[0])) {
              matchL = true
              matchU = true
            }
          }
        }
        if (matchL && matchU) {
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === '<=') {
        let match = false
        if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
          if (Number(totest.Value) <= Number(userValues[0])) {
            match = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_MEAN)) {
            let totest = value.values.find(state => state.CS === NUM_MEAN)
            if (Number(totest.Value) <= Number(userValues[0])) {
              match = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest.Value) <= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        // check match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) <= Number(userValues[0])) {
                match = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) <= Number(userValues[0])) {
              match = true
            }
          }
        }
        if (match) {
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === '>=') {
        let match = false
        if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
          if (Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_MEAN)) {
            let totest = value.values.find(state => state.CS === NUM_MEAN)
            if (Number(totest.Value) >= Number(userValues[0])) {
              match = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        // check match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) >= Number(userValues[0])) {
              match = true
            }
          }
        }
        if (match) {
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === 'between') {
        let match = false
        if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_MEAN)) {
          let totest = value.values.find(state => state.CS === NUM_MEAN)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        // check match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) <= Number(userValues[1]) && Number(otSt.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) <= Number(userValues[1]) && Number(testOtherStates.Value) >= Number(userValues[0])) {
              match = true
            }
          }
        }
        if (match) {
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === '!=') {
        let matchU = false
        let matchL = false
        if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
          if (Number(totest.Value) < Number(userValues[0])) {
            matchU = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_MEAN)) {
            let totest = value.values.find(state => state.CS === NUM_MEAN)
            if (Number(totest.Value) < Number(userValues[0])) {
              matchU = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest.Value) < Number(userValues[0])) {
                matchU = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
          if (Number(totest.Value) > Number(userValues[0])) {
            matchL = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_MEAN)) {
            let totest = value.values.find(state => state.CS === NUM_MEAN)
            if (Number(totest.Value) > Number(userValues[0])) {
              matchL = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest.Value) > Number(userValues[0])) {
                matchL = true
              }
            }
          }
        }
        // check exact match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) !== Number(userValues[0])) {
                matchL = true
                matchU = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) !== Number(userValues[0])) {
              matchL = true
              matchU = true
            }
          }
        }
        if (matchU || matchL) {
          resultValues.push({ IID: key })
        }
      }
      // console.log('resultValue', resultValues)
      return resultValues
    }
    function getNumMatchesInclExtremValues (key, value, userOperator, userValues, resultValues) {
      let testOtherStates = value.values.find(state => (state.CS !== NUM_MAX && state.CS !== NUM_MEAN && state.CS !== NUM_MIN && state.CS !== NUM_UMETHLOW && state.CS !== NUM_UMETHUPP))
      if (userOperator === '=') {
        let matchL = false
        let matchU = false
        if (value.values.find(state => state.CS === NUM_MIN)) {
          let totest = value.values.find(state => state.CS === NUM_MIN)
          if (Number(totest.Value) <= Number(userValues[0])) {
            matchL = true
            // console.log('totest', totest)
          }
        } else {
          if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
            let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
            if (Number(totest.Value) <= Number(userValues[0])) {
              matchL = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest.Value) <= Number(userValues[0])) {
                matchL = true
                // console.log('totest', totest)
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_MAX)) {
          let totest = value.values.find(state => state.CS === NUM_MAX)
          if (Number(totest.Value) >= Number(userValues[0])) {
            matchU = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
            let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
            if (Number(totest.Value) >= Number(userValues[0])) {
              matchU = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest.Value) >= Number(userValues[0])) {
                matchU = true
              }
            }
          }
        }
        // check exact match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) === Number(userValues[0])) {
                matchL = true
                matchU = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) === Number(userValues[0])) {
              matchL = true
              matchU = true
            }
          }
        }
        if (matchL && matchU) {
          // console.log('both', key)
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === '<=') {
        let match = false
        if (value.values.find(state => state.CS === NUM_MIN)) {
          let totest = value.values.find(state => state.CS === NUM_MIN)
          if (Number(totest.Value) <= Number(userValues[0])) {
            match = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
            let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
            if (Number(totest.Value) <= Number(userValues[0])) {
              match = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest.Value) <= Number(userValues[0])) {
                match = true
              }
            } else {
              if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
                let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
                if (Number(totest.Value) <= Number(userValues[0])) {
                  match = true
                }
              } else {
                if (value.values.find(state => state.CS === NUM_MAX)) {
                  let totest = value.values.find(state => state.CS === NUM_MAX)
                  if (Number(totest.Value) <= Number(userValues[0])) {
                    match = true
                  }
                }
              }
            }
          }
        }
        // check match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) <= Number(userValues[0])) {
                match = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) <= Number(userValues[0])) {
              match = true
            }
          }
        }
        if (match) {
          // console.log('both', key)
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === '>=') {
        let match = false
        if (value.values.find(state => state.CS === NUM_MAX)) {
          let totest = value.values.find(state => state.CS === NUM_MAX)
          if (Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
            let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
            if (Number(totest.Value) >= Number(userValues[0])) {
              match = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            } else {
              if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
                let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
                if (Number(totest.Value) >= Number(userValues[0])) {
                  match = true
                }
              } else {
                if (value.values.find(state => state.CS === NUM_MIN)) {
                  let totest = value.values.find(state => state.CS === NUM_MIN)
                  if (Number(totest.Value) >= Number(userValues[0])) {
                    match = true
                  }
                }
              }
            }
          }
        }
        // check match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) >= Number(userValues[0])) {
              match = true
            }
          }
        }
        if (match) {
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === 'between') {
        let match = false
        if (value.values.find(state => state.CS === NUM_MAX)) {
          let totest = value.values.find(state => state.CS === NUM_MAX)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_MIN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MIN)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_MIN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MIN)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_MEAN)) {
          let totest = value.values.find(state => state.CS === NUM_MEAN)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_MIN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MIN)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest2.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MAX)) {
              let totest2 = value.values.find(state => state.CS === NUM_MAX)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
          let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_MAX)) {
              let totest2 = value.values.find(state => state.CS === NUM_MAX)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_MIN)) {
          let totest = value.values.find(state => state.CS === NUM_MIN)
          if (Number(totest.Value) <= Number(userValues[0]) && Number(totest.Value) >= Number(userValues[1])) {
            match = true
          }
          if (Number(totest.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
            match = true
          }
          if (!match) {
            if (value.values.find(state => state.CS === NUM_MAX)) {
              let totest2 = value.values.find(state => state.CS === NUM_MAX)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHUPP)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest2 = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
            if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
              let totest2 = value.values.find(state => state.CS === NUM_UMETHLOW)
              if (Number(totest2.Value) <= Number(userValues[1]) && Number(totest.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          }
        }
        // check match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) <= Number(userValues[1]) && Number(otSt.Value) >= Number(userValues[0])) {
                match = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) <= Number(userValues[1]) && Number(testOtherStates.Value) >= Number(userValues[0])) {
              match = true
            }
          }
        }
        if (match) {
          // console.log('both', key)
          resultValues.push({ IID: key })
        }
      }
      if (userOperator === '!=') {
        let matchU = false
        let matchL = false
        if (value.values.find(state => state.CS === NUM_MAX)) {
          let totest = value.values.find(state => state.CS === NUM_MAX)
          if (Number(totest.Value) < Number(userValues[0])) {
            matchU = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
            let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
            if (Number(totest.Value) < Number(userValues[0])) {
              matchU = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest.Value) < Number(userValues[0])) {
                matchU = true
              }
            } else {
              if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
                let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
                if (Number(totest.Value) < Number(userValues[0])) {
                  matchU = true
                }
              } else {
                if (value.values.find(state => state.CS === NUM_MIN)) {
                  let totest = value.values.find(state => state.CS === NUM_MIN)
                  if (Number(totest.Value) < Number(userValues[0])) {
                    matchU = true
                  }
                }
              }
            }
          }
        }
        if (value.values.find(state => state.CS === NUM_MIN)) {
          let totest = value.values.find(state => state.CS === NUM_MIN)
          if (Number(totest.Value) > Number(userValues[0])) {
            matchL = true
          }
        } else {
          if (value.values.find(state => state.CS === NUM_UMETHLOW)) {
            let totest = value.values.find(state => state.CS === NUM_UMETHLOW)
            if (Number(totest.Value) > Number(userValues[0])) {
              matchL = true
            }
          } else {
            if (value.values.find(state => state.CS === NUM_MEAN)) {
              let totest = value.values.find(state => state.CS === NUM_MEAN)
              if (Number(totest.Value) > Number(userValues[0])) {
                matchL = true
              }
            } else {
              if (value.values.find(state => state.CS === NUM_UMETHUPP)) {
                let totest = value.values.find(state => state.CS === NUM_UMETHUPP)
                if (Number(totest.Value) > Number(userValues[0])) {
                  matchL = true
                }
              } else {
                if (value.values.find(state => state.CS === NUM_MAX)) {
                  let totest = value.values.find(state => state.CS === NUM_MAX)
                  if (Number(totest.Value) > Number(userValues[0])) {
                    matchL = true
                  }
                }
              }
            }
          }
        }
        // check exact match for other quantitative states
        if (testOtherStates) {
          if (Array.isArray(testOtherStates)) {
            for (let otSt of testOtherStates) {
              if (Number(otSt.Value) !== Number(userValues[0])) {
                matchL = true
                matchU = true
              }
            }
          } else {
            if (Number(testOtherStates.Value) !== Number(userValues[0])) {
              matchL = true
              matchU = true
            }
          }
        }
        if (matchU || matchL) {
          resultValues.push({ IID: key })
        }
      }
      return resultValues
    }
    return dSel
  }
}
export default QuantitativeRangeDescriptorDataType
