export default {
  methods: {
    /**
     * Used in SelectDescriptorSearchView to sort descriptor arrays
     * @param {} key1, key2
     * @param {*} order asc, or desc
     */
    compareValuesForSorting (key1, key2, order1, order2) {
      return function innerSort (a, b) {
        if (!a.hasOwnProperty(key1) || !b.hasOwnProperty(key1)) {
          // property doesn't exist on either object
          return 0
        }
        let varA, varB
        varA = replaceStringKeys(a[key1])
        varB = replaceStringKeys(b[key1])
        function replaceStringKeys (rep) {
          if (typeof rep === 'string') {
            return rep.toLowerCase().replace(/[\u0020\u25CB\u2219\u25CF\u005B\u005D\u005F]/g, '')
            // console.log('test', varA)
          } else {
            return rep
          }
        }
        if (varA === varB) {
          if (!a.hasOwnProperty(key2) || !b.hasOwnProperty(key2)) {
            // property doesn't exist on either object
            return 0
          }
          let varAA, varBB
          varAA = replaceStringKeys(a[key2])
          varBB = replaceStringKeys(b[key2])
          return ((order2 === 'asc') ? ((varAA < varBB) ? -1 : (varAA > varBB) ? 1 : 0) : ((varAA < varBB) ? 1 : (varAA > varBB) ? -1 : 0))
        } else {
          return ((order1 === 'asc') ? ((varA < varB) ? -1 : (varA > varB) ? 1 : 0) : ((varA < varB) ? 1 : (varA > varB) ? -1 : 0))
        }
      }
    },
    groupObjectArrayBy (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    }
  }
}
