/**
 * All methods for using the IndexDB of a browser to cache the json data locally.
 */
import { openDB, deleteDB } from 'idb'

const DB_NAME = process.env.VUE_APP_INDEXED_DB_NAME

export default {
  async removeDB () {
    await deleteDB(DB_NAME)
      .then(
        console.log('successfully deleted old indexedDB')
      )
      .catch(error => {
        console.log('Error in deleteDB()', error)
        throw error
      })
  },
  async getDatabaseVersion (name) {
    let tt
    let database
    await openDB(name)
      .then(response => {
        database = response
        tt = database.version
        database.close()
      })
      .catch(error => {
        console.log('Error in getDatabaseVersion()', error)
        throw error
      })
    return tt
  },
  async checkIndexedDBContainsStores (name, storenames) {
    let exists
    let database
    await openDB(name)
      .then(response => {
        database = response
        for (const storename of storenames) {
          exists = database.objectStoreNames.contains(storename)
          if (!exists) {
            break
          }
        }
        database.close()
      })
      .catch(error => {
        console.log('Error in checkIndexedDBContainsStores()', error)
        throw error
      })
    return exists
  },
  async openDatabase (name, version, upgradeneed) {
    let db
    await openDB(name, version, upgradeneed)
      .then(response => {
        db = response
      })
      .catch(error => {
        console.log('Error in openDatabase()', error)
        throw error
      })
    return db
  },
  async initialCreateDB () {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB')
      return
    }
    let versionData = []
    try {
      let responseData = await this.checkIndexedDBContainsStores(DB_NAME, [process.env.VUE_APP_VERSION_INFOS])
      if (!responseData) {
        let version = Number(await this.getDatabaseVersion(DB_NAME))
        // console.log('version in initialCreate', version)
        const database = await this.openDatabase(DB_NAME, version + 1, {
          upgrade (db) {
            console.log('create store for version infos')
            if (!db.objectStoreNames.contains(process.env.VUE_APP_VERSION_INFOS)) {
              db.createObjectStore(process.env.VUE_APP_VERSION_INFOS, {
                keyPath: 'id'
              })
            }
          }
        })
          .then(response => {
            return response
          })
          .catch(error => {
            console.log('Error in openDB() for version info', error)
            throw error
          })
        // console.log('database close')
        database.close()
      } else {
        responseData = await this.getDataLocally('', process.env.VUE_APP_VERSION_INFOS, '')
        versionData = responseData
      }
    } catch (err) {
      throw err
    }
    let test = await this.checkIndexedDBContainsStores(DB_NAME, [process.env.VUE_APP_LIST_DATASOURCES, process.env.VUE_APP_LIST_MASTERS_METADATA])
    if (!test) {
      let version = Number(await this.getDatabaseVersion(DB_NAME))
      const database = await this.openDatabase(DB_NAME, version + 1, {
        upgrade (db) {
          console.log('create store for list of datasources')
          if (!db.objectStoreNames.contains(process.env.VUE_APP_LIST_DATASOURCES)) {
            db.createObjectStore(process.env.VUE_APP_LIST_DATASOURCES, {
              keyPath: 'id'
            })
          }
          if (!db.objectStoreNames.contains(process.env.VUE_APP_LIST_MASTERS_METADATA)) {
            db.createObjectStore(process.env.VUE_APP_LIST_MASTERS_METADATA, {
              keyPath: 'id'
            })
          }
        }
      })
        .then(response => {
          return response
        })
        .catch(error => {
          console.log('Error in openDB()', error)
          throw error
        })
      database.close()
    }
    return versionData
  },
  async saveDataLocally (baseUrl, dbproject, table, storeData) {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB')
      return
    }
    let test = await this.checkIndexedDBContainsStores(DB_NAME, [dbproject + table])
    if (!test) {
      let version = Number(await this.getDatabaseVersion(DB_NAME))
      version = version + 1
      const database = await this.openDatabase(DB_NAME, version, {
        upgrade (db) {
          console.log('create new stores in idb for ', dbproject)
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_DESCRIPTORS_LIST)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_DESCRIPTORS_LIST, {
              keyPath: 'CID',
              autoIncrement: false
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_DESCRIPTORS_STATES_LIST)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_DESCRIPTORS_STATES_LIST, {
              keyPath: 'StateID',
              autoIncrement: false
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_MAPPED_DESCRIPTOR_STATE_ITEMIDS)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_MAPPED_DESCRIPTOR_STATE_ITEMIDS, {
              keyPath: ['CID', 'CS']
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_MAPPED_NUMERICAL_DESCRIPTOR_STATE_ITEMIDS)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_MAPPED_NUMERICAL_DESCRIPTOR_STATE_ITEMIDS, {
              keyPath: ['CID', 'CS']
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_MAPPED_TEXT_DESCRIPTOR_STATE_ITEMIDS)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_MAPPED_TEXT_DESCRIPTOR_STATE_ITEMIDS, {
              keyPath: 'CID'
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_ITEMIDLIST)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_ITEMIDLIST, {
              keyPath: 'IID',
              autoIncrement: false
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_ITEM_DESCRIPTION)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_ITEM_DESCRIPTION, {
              keyPath: 'IID'
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_DESCRIPTOR_TYPES)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_DESCRIPTOR_TYPES, {
              autoIncrement: true
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_TAXON_ITEMS)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_TAXON_ITEMS, {
              autoIncrement: true
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_TAXON_SCOPE)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_TAXON_SCOPE, {
              keyPath: 'ScopeID'
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_CITATION_ITEMS)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_CITATION_ITEMS, {
              autoIncrement: true
            })
          }
          if (!db.objectStoreNames.contains(dbproject + process.env.VUE_APP_CITATION_SCOPE)) {
            db.createObjectStore(dbproject + process.env.VUE_APP_CITATION_SCOPE, {
              keyPath: 'ScopeID'
            })
          }
        },
        blocked () {
          console.log('blocked in saveDataLocally')
        }
      })
        .then(response => {
          return response
        })
        .catch(error => {
          console.log('Error in saveDataDB()', error)
          throw error
        })
      database.close()
    }
    const db = await this.openDatabase(DB_NAME)
      .catch(error => {
        console.log('Error in saveDataLocally()', error)
        throw error
      })
    if (db) {
      const tx = db.transaction(dbproject + table, 'readwrite')
      await (storeData.map(stdata => tx.store.put(stdata)))
      await tx.done
      await tx.complete
      await db.close()
    }
  },
  async deleteStoreLocally (dbproject, table) {
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB')
      return
    }
    let test = await this.checkIndexedDBContainsStores(DB_NAME, [dbproject + table])
    if (test) {
      let version = Number(await this.getDatabaseVersion(DB_NAME))
      version = version + 1
      // console.log('version in saveDataLocally', version)
      const database = await this.openDatabase(DB_NAME, version, {
        upgrade (db) {
          console.log('delete old stores in idb for ', dbproject)
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_DESCRIPTORS_LIST)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_DESCRIPTORS_LIST)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_DESCRIPTORS_STATES_LIST)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_DESCRIPTORS_STATES_LIST)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_MAPPED_DESCRIPTOR_STATE_ITEMIDS)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_MAPPED_DESCRIPTOR_STATE_ITEMIDS)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_MAPPED_NUMERICAL_DESCRIPTOR_STATE_ITEMIDS)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_MAPPED_NUMERICAL_DESCRIPTOR_STATE_ITEMIDS)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_MAPPED_TEXT_DESCRIPTOR_STATE_ITEMIDS)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_MAPPED_TEXT_DESCRIPTOR_STATE_ITEMIDS)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_ITEMIDLIST)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_ITEMIDLIST)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_ITEM_DESCRIPTION)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_ITEM_DESCRIPTION)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_DESCRIPTOR_TYPES)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_DESCRIPTOR_TYPES)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_TAXON_ITEMS)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_TAXON_ITEMS)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_TAXON_SCOPE)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_TAXON_SCOPE)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_CITATION_ITEMS)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_CITATION_ITEMS)
          }
          if (db.objectStoreNames.contains(dbproject + process.env.VUE_APP_CITATION_SCOPE)) {
            db.deleteObjectStore(dbproject + process.env.VUE_APP_CITATION_SCOPE)
          }
        },
        blocked () {
          console.log('blocked in deleteDataLocally')
        }
      })
        .then(response => {
          return response
        })
        .catch(error => {
          console.log('Error in deleteDataDB()', error)
          throw error
        })
      database.close()
    }
  },
  async getDataLocally (dbproject, table, key) {
    // console.log('getDataLocally from ', storeName)
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB')
      return []
    }
    const db = await this.openDatabase(DB_NAME)
      .catch(error => {
        console.log('Error in getDataLocally()', error)
        throw error
      })
    if (db && db.objectStoreNames.contains(dbproject + table)) {
      const tx = db.transaction(dbproject + table, 'readonly')
      const store = tx.objectStore(dbproject + table)
      let dataValue = null
      if (key && key !== '') {
        dataValue = await store.get(key)
      } else {
        dataValue = await store.getAll()
      }
      await tx.done
      await db.close()
      // console.log('local data: close')
      return dataValue
    } else {
      if (db) {
        await db.close()
      }
      // console.log('else: close')
      return null
    }
  }
}
