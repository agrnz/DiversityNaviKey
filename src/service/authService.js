import Api from '@/service/api'
import AuthHeader from './authHeader'

class AuthService {
  async login (loginUrl, user) {
    const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
    let responseData = []
    let apiUrl = loginUrl
    await Api.axiosInstance.post(apiUrl, { username: user.username, password: user.password })
      .then(async (response) => {
        // console.log('responseData', response)
        if (response.data.access_token) {
          localStorage.setItem(localStorageName + '/user', JSON.stringify(response.data))
          localStorage.setItem(localStorageName + '/username', user.username)
        }
        responseData = response.data
        return responseData
      })
      .catch(err => {
        console.log('error in AuthService.login(): ', err)
        throw err
      })
    return responseData
  }
  async logout (logoutURL) {
    let apiUrl = logoutURL
    await Api.axiosInstance.post(apiUrl, {}, { headers: AuthHeader(true) })
      .then((response) => {
        const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
        localStorage.removeItem(localStorageName + '/user')
        localStorage.removeItem(localStorageName + '/username')
        console.log('User removed from localStorage')
        return response
      })
      .catch(err => {
        console.log('error in AuthService.logout(): ', err)
        if (err.status_code === 401 || err.status_code === 403) {
          const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
          localStorage.removeItem(localStorageName + '/user')
          localStorage.removeItem(localStorageName + '/username')
          console.log('User removed from localStorage')
        }
        throw err
      })
  }
  async refresh (refreshUrl) {
    // console.log('refresh, ', refreshUrl)
    const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
    let responseData = []
    let apiUrl = refreshUrl
    await Api.axiosInstance.get(apiUrl, { headers: AuthHeader(true) })
      .then(async (response) => {
        console.log('refresh responseData', response)
        if (response.data.access_token) {
          localStorage.setItem(localStorageName + '/user', JSON.stringify(response.data))
        }
        responseData = response.data
        return responseData
      })
      .catch(err => {
        console.log('error in AuthService.refresh(): ', err)
        throw err
      })
    return responseData
  }
  async register (registerUrl, user) {
    let responseData = []
    let apiUrl = registerUrl
    await Api.axiosInstance.post(apiUrl, { username: user.username, password: user.password, email: user.email })
      .then(async (response) => {
        console.log('responseData', response)
        responseData = response.data
        return responseData
      })
      .catch(err => {
        console.log('error in AuthService.register(): ', err)
        throw err
      })
    return responseData
  }
}

export default new AuthService()
