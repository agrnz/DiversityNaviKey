/**
 * Contains all methods for receiving data either from the web service backend, or from the IndexedDB.
 */
import Api from '@/service/api'
import Navikeyidb from '@/service/navikeyidb'
import AuthHeader from './authHeader'

let indexedDBError = false
let source

export default {
  // Initialize and create a new IndexDB for the DNK App
  async initIndexDB () {
    let versionInfo = []
    await Navikeyidb.initialCreateDB()
      .then((response) => {
        console.log('IndexedDB created')
        indexedDBError = false
        versionInfo = response
      })
      .catch(error => {
        console.log('Failed to create indexedDB', error)
        indexedDBError = true
        versionInfo = []
      })
    return versionInfo
  },
  // Delete the DNK IndexedDB from the browser storage
  async removeIndexDB () {
    await Navikeyidb.removeDB()
      .then(() => {
        console.log('IndexedDB removed')
      })
      .catch(error => {
        console.log('Failed to remove indexedDB', error)
      })
  },
  async cancelLoading () {
    if (source) {
      source.cancel('Canceled by User')
    }
  },
  // Checks for new versions. Reset DNK indexedDB and LocalStorage if necessary.
  async checkVersionChanges (cacheVersionInfos, serviceURL, apiVersionEndpoint, currentAppVersion, versionInfoTable) {
    // get new Version infos from API
    let newAPIVersion = ''
    let newRESTVersion = false
    let newAPPVersion = false
    try {
      const newAPIVersionData = await this.getData(false, 'onlineNoCache', serviceURL, apiVersionEndpoint, '', '')
      if (newAPIVersionData) {
        newAPIVersion = newAPIVersionData[0].API_VERSION
      }
    } catch (err) {
      console.log('Error when trying to get rest version info', err)
      // throw err
    }
    const semver = require('semver')
    let newVersionInfos = [{ 'id': 1, 'dnk_app_version': currentAppVersion, 'dnk_rest_version': newAPIVersion }]
    // compare new with cached
    if (cacheVersionInfos && cacheVersionInfos.length > 0) {
      const appversionOld = semver.clean(cacheVersionInfos[0].dnk_app_version)
      const appversionNew = semver.clean(newVersionInfos[0].dnk_app_version)
      try {
        if (cacheVersionInfos[0].dnk_app_version !== '' && newVersionInfos[0].dnk_app_version !== '') {
          if (semver.major(appversionOld) < semver.major(appversionNew)) {
            // console.log('new major app version')
            // here code if something has to change
            newAPPVersion = true
          }
          if (semver.patch(appversionOld) < semver.patch(appversionNew)) {
            // console.log('new patch app version')
            // if (semver.minor(appversionOld) < semver.minor(appversionNew)) {
            //   console.log('new minor app version')
            // here code if something has to change
            // newAPPVersion = true
          }
        }
        if (cacheVersionInfos[0].dnk_rest_version !== '' && newVersionInfos[0].dnk_rest_version !== '') {
          if (semver.major(cacheVersionInfos[0].dnk_rest_version) < semver.major(newVersionInfos[0].dnk_rest_version)) {
            // console.log('new major rest version -> update cache indexeddb')
            // here code if something has to change
            await this.removeIndexDB()
            await this.initIndexDB()
            newRESTVersion = true
          } else {
            if (semver.major(cacheVersionInfos[0].dnk_rest_version) === semver.major(newVersionInfos[0].dnk_rest_version) && semver.minor(cacheVersionInfos[0].dnk_rest_version) < semver.minor(newVersionInfos[0].dnk_rest_version)) {
              // console.log('new minor rest version -> update cache indexeddb')
              // here code if something has to change
              await this.removeIndexDB()
              await this.initIndexDB()
              newRESTVersion = true
            }
          }
        }
      } catch (error) {
        console.log('version info not correct', error)
      }
    }
    if (newVersionInfos && newVersionInfos.length > 0) {
      // save new version infos to cachee
      if (newVersionInfos[0].dnk_rest_version !== '') {
        try {
          await this.saveDataToCache('offline', '', '', versionInfoTable, newVersionInfos)
        } catch (error) {
          console.log('Cant save verions infos to cache -> cache not accessible? ', error)
        }
      }
    }
    return { 'isNewAppVersion': newAPPVersion, 'isNewRestVersion': newRESTVersion }
  },
  async checkDBChanges (listIndexedDBURL, tempDatasources, testTable) {
    // get list of all datasources from cache
    try {
      let cachedListOfDatasources = await this.getData(false, 'offline', '', '', listIndexedDBURL, '', '')
      let listForUpdates = []
      // check if updates are available
      if (cachedListOfDatasources && tempDatasources && tempDatasources.length > 0) {
        for (const cachedDBInfos of cachedListOfDatasources) {
          if (cachedDBInfos.ds_lastTransfer && cachedDBInfos.ds_lastTransfer !== '') {
            let listOfNew = tempDatasources.filter(newTemp => newTemp.id === cachedDBInfos.id)
            for (const newDBInfo of listOfNew) {
              if (newDBInfo.ds_lastTransfer && newDBInfo.ds_lastTransfer !== '') {
                // compare
                const newDate = new Date(newDBInfo.ds_lastTransfer)
                const oldDate = new Date(cachedDBInfos.ds_lastTransfer)
                if (isNaN(newDate)) {
                  // do not add to update list
                  continue
                } else {
                  if (isNaN(oldDate)) {
                    listForUpdates.push(newDBInfo)
                  } else {
                    if (newDate.getTime() > oldDate.getTime()) {
                      listForUpdates.push(newDBInfo)
                    }
                  }
                }
              }
            }
          }
        }
      }
      // delete cache for datasources included in listForUpdates
      if (listForUpdates && listForUpdates.length > 0) {
        for (let idbToDelete of listForUpdates) {
          console.log('idbtodelete', idbToDelete.ds_rest_endpoint)
          await this.deleteStoreFromCache(idbToDelete.ds_rest_endpoint, testTable)
        }
      }
    } catch (error) {
      // only catch error, do not throw, otherwise no datasources are available if caching is not allowed by browser
      console.log('checkDB changes failed, due to cache errors?? -> maybe browser does not allow caching', error)
    }
  },
  // Get datasources. Try online, only if offline than get list from cache.
  async getAvailableDatasourcesFromREST (hosturl, apiProjectsURL, tempBindings, apiListIndexedDBURL) {
    let availableDbs = []
    let onlineError = false
    // get all DB's
    try {
      availableDbs = await this.getData(false, 'onlineFirst', hosturl, '', '', '', '')
      Object.freeze(availableDbs) // set not reactive!
    } catch (error) {
      console.log('no available DBs online and offline? - or authenification error')
      throw error
    }
    let tempDatasources = []
    let availableError = null
    if (availableDbs && availableDbs.length > 0) {
      // console.log('get list of dbs ')
      let allAvailable = []
      // get all schemas from all dbs
      for (const dbName of availableDbs) {
        const table = '/' + apiProjectsURL
        let availableSchemes = []
        try {
          availableSchemes = await this.getData(false, 'onlineFirst', hosturl, dbName, table, '', '')
          Object.freeze(availableSchemes) // set not reactive!
        } catch (error) {
          // console.log('no available Schemes for ', dbName + table)
          availableError = error
          // throw error
        }
        if (availableSchemes && availableSchemes.length > 0 && !availableError) {
          allAvailable.push({ dbName: dbName, availableSchemas: availableSchemes[0] })
        } else {
          onlineError = true
        }
      }
      // set datasource infos for all available db's and schemas
      let count = 0
      for (const dbs of allAvailable) {
        count++
        tempBindings.push({ bindingname: dbs.dbName, changeTo: 'DB' + count })
        let values = Object.values(dbs.availableSchemas)
        for (const scheme of values) {
          let restEndpoint = dbs.dbName + '/' + scheme.name + '/'
          let newDatasource = { 'id': dbs.dbName + '_' + scheme.name, 'ds_name': dbs.dbName, 'displayName': scheme.name, 'projectTitle': scheme.master, 'ds_version': 0.3, 'ds_lastTransfer': '', 'scheme_lang': scheme.language, 'scheme_description': scheme.description, 'scheme_master': scheme.master, 'scheme_name': scheme.name, 'ds_rest_endpoint': restEndpoint }
          tempDatasources.push(newDatasource)
        }
      }
      return tempDatasources
    }
    if (!availableDbs || availableDbs.length === 0 || (onlineError && !availableError)) {
      // try to get data offline
      console.log('error in online mode try to get list from cache ')
      try {
        tempDatasources = await this.getData(false, 'offline', '', '', apiListIndexedDBURL, '', '')
        Object.freeze(tempDatasources) // set not reactive!
      } catch (error) {
        console.log('no available data online and offline')
        throw error
      }
      return tempDatasources
    }
  },
  async getMasterMetaData (tempDatasources, tempMasterDatasources, hosturl, metadataURL, tempBindings, mastersMetadataURL) {
    let mastersMetadata = []
    let onlineError
    // get metadata from master
    if (!tempDatasources || tempDatasources.length === 0) {
      // should not happen!
      return null
    }
    if (tempMasterDatasources && tempMasterDatasources.length > 0) {
      for (const m of tempMasterDatasources) {
        let metadata = null
        try {
          metadata = await this.getData(false, 'onlineFirst', hosturl, m.ds_rest_endpoint, metadataURL, '', '')
          Object.freeze(metadata) // set not reactive!
        } catch (error) {
          console.log('no available metadata', error)
          throw error
        }
        if (metadata && metadata.length > 0) {
          mastersMetadata.push({ 'scheme_master': m.scheme_master, 'id': m.id, 'metadata': metadata })
          if (tempBindings) {
            let tempName = tempBindings.filter(bind => bind.bindingname === m.ds_name)
            m.displayName = metadata[0].ProjectTitleCode + ' – (' + tempName[0].changeTo + ')'
          } else {
            m.displayName = metadata[0].ProjectTitleCode
          }
          m.projectTitle = metadata[0].ProjectTitleCode
          // set last transfer date (only in master info available) to all tempDatasources of this master
          let tempTemp = tempDatasources.filter(tempDS => tempDS.scheme_master === m.scheme_master && tempDS.ds_name === m.ds_name)
          // console.log('tempTemp', tempTemp)
          if (tempTemp) {
            for (let setLog of tempTemp) {
              if (metadata[0].LogLastTransfer && metadata[0].LogLastTransfer !== '') {
                setLog.ds_lastTransfer = metadata[0].LogLastTransfer
              } else {
                // default
                setLog.ds_lastTransfer = ''
              }
            }
          }
        } else {
          onlineError = true
        }
      }
      if (onlineError) {
        console.log('error in online mode try to get list from cache ')
        try {
          mastersMetadata = await this.getData(false, 'offline', '', '', mastersMetadataURL, '', '')
          Object.freeze(mastersMetadata) // set not reactive!
        } catch (error) {
          console.log('no available data online and offline')
          throw error
        }
      }
      return mastersMetadata
    } else {
      return null
    }
  },
  async getData (optional, loadingMode, hosturl, dbproject, table, pageParameter, key) {
    // console.log('GETDATA REFRESHURL', refreshurl)
    let responseData = []
    if (typeof hosturl === 'undefined') {
      hosturl = ''
    }
    if (typeof dbproject === 'undefined') {
      dbproject = ''
    }
    if (typeof table === 'undefined') {
      table = ''
    }
    if (typeof key === 'undefined') {
      key = ''
    }
    if (typeof pageParameter === 'undefined') {
      pageParameter = null
    }
    source = Api.axiosInstance.CancelToken.source()
    switch (loadingMode) {
      case 'onlineNoCache':
        try {
          responseData = await this.getDataOnline(hosturl, dbproject, table, key, pageParameter)
        } catch (err) {
          if (err && err.message) {
            if (err.response.status && err.response.status === 401) {
              throw err
            }
            if (err.message === 'Canceled by User') {
              throw err
            }
          }
          if (!optional) {
            throw err
          } else {
            console.log('Error in onlinenocache !!optional table', err)
          }
        }
        return responseData
      case 'onlineFirst':
        try {
          responseData = await this.getDataOnline(hosturl, dbproject, table, key, pageParameter)
          if (!responseData) {
            // try to get data online
            console.log('error in online mode try to get data from cache ')
            try {
              responseData = await this.getDataFromCache(dbproject, table, key)
            } catch (error) {
              throw error
            }
          }
        } catch (error) {
          if (error.status_code === 401) {
            throw error
          }
          if (error && error.message) {
            if (error.response.status && error.response.status === 401) {
              throw error
            }
            if (error.message === 'Canceled by User') {
              throw error
            }
          }
          try {
            responseData = await this.getDataFromCache(dbproject, table, key)
            // console.log('response data in error mode?', responseData)
          } catch (error) {
            if (!optional) {
              throw error
            } else {
              console.log('Error in onlineFirst !!optional table!!', error)
            }
          }
        }
        return responseData
      case 'offline':
        try {
          responseData = await this.getDataFromCache(dbproject, table, key)
        } catch (error) {
          if (error && error.message) {
            if (error.message === 'Canceled by User') {
              throw error
            }
          }
          if (!optional) {
            throw error
          } else {
            console.log('Error in offline !!optional table!!', error)
          }
        }
        return responseData
      default:
        // cacheFirst
        let triedonline = false
        try {
          responseData = await this.getDataFromCache(dbproject, table, key)
          if (!responseData || responseData.length === 0) {
            // console.log('no cached data, try to get online 1')
            responseData = []
            try {
              responseData = await this.getDataOnline(hosturl, dbproject, table, key, pageParameter)
            } catch (error) {
              // console.log('in throw')
              triedonline = true
              throw error
            }
            if (responseData && !indexedDBError) {
              // save data to indexedbdb
              await this.saveDataToCache('offline', '', dbproject, table, responseData)
            }
          }
        } catch (error) {
          // console.log('no cached data, try to get online 2')
          responseData = []
          if (!triedonline) {
            try {
              responseData = await this.getDataOnline(hosturl, dbproject, table, key, pageParameter)
            } catch (error) {
              if (error && error.message) {
                if (error.response.status && error.response.status === 401) {
                  // console.log('error 401 in default getData', error)
                  throw error
                }
                if (error.message === 'Canceled by User') {
                  throw error
                }
              }
              if (!optional) {
                throw error
              } else {
                console.log('Error in cacheFirst !!optional table!!', error)
              }
            }
          } else {
            if (error && error.message) {
              if (error.message === 'Canceled by User') {
                throw error
              }
            }
            if (!optional) {
              throw error
            }
          }
        }
        return responseData
    }
  },
  async getDataOnline (hosturl, dbproject, table, key, pageParameter) {
    let responseData = []
    let tempData = []
    let getNext = true
    let next = 'None'
    let apiUrl = ''
    source = Api.axiosInstance.CancelToken.source()
    while (getNext) {
      if (next !== 'None') {
        let testUrl = new URL(hosturl)
        testUrl = new URL(testUrl.origin + next)
        pageParameter = null
        apiUrl = testUrl.origin + testUrl.pathname + testUrl.search
      } else {
        apiUrl = hosturl + dbproject + table + key
      }
      await Api.axiosInstance.get(apiUrl, { params: pageParameter, cancelToken: source.token, headers: AuthHeader(true) })
        .then(async (response) => {
          tempData = response.data.data
          // Object.freeze(tempData) // set not reactive!
          const links = response.data.links
          getNext = false
          if (links) {
            next = response.data.links.next
            if (next !== 'None') {
              getNext = true
            }
          }
        })
        .catch(async err => {
          if (Api.axiosInstance.isCancel(err)) {
            console.log('Request canceled', err.message)
            getNext = false
            tempData = []
            // if request is canceled by user, cancel all request -> throw
            throw err
          } else {
            getNext = false
            tempData = []
            console.log('error in getDataOnline(): ', err)
            throw err
          }
        })
      responseData = responseData.concat(tempData)
    }
    return responseData
  },
  async getDataFromCache (dbproject, table, key) {
    let responseData = []
    try {
      responseData = await Navikeyidb.getDataLocally(dbproject, table, key)
    } catch (err) {
      throw err
    }
    return responseData
  },
  async saveDataToCache (loadingMode, root, dbproject, table, data) {
    switch (loadingMode) {
      case 'offline':
        try {
          await Navikeyidb.saveDataLocally(root, dbproject, table, data)
          break
        } catch (error) {
          console.log('error in saving to cache', error)
          throw error
        }
      default:
        break
    }
  },
  async loadAndSaveTableDataToCache (hosturl, dbproject, table) {
    let responseData = []
    try {
      responseData = await this.getDataOnline(hosturl, dbproject, table, '', { page: 1, pagesize: 5000 })
    } catch (error) {
      throw error
    }
    if (responseData && !indexedDBError) {
      // save data to indexedbdb
      // console.log('save all data', responseData)
      await this.saveDataToCache('offline', '', dbproject, table, responseData)
    }
  },
  async deleteStoreFromCache (dbproject, table) {
    try {
      await Navikeyidb.deleteStoreLocally(dbproject, table)
    } catch (error) {
      console.log('error in deleting store from cache', error)
      throw error
    }
  }
}
