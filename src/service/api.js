import axios from 'axios'
import AuthService from './authService'
import AuthHeader from './authHeader'

const serviceurl = process.env.VUE_APP_ROOT_API + process.env.VUE_APP_API_SERVICE
const refreshurl = serviceurl + process.env.VUE_APP_API_USER_REFRESH

const axiosInstance = axios.create({
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
})
axiosInstance.CancelToken = axios.CancelToken
axiosInstance.isCancel = axios.isCancel
axiosInstance.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    const originalConfig = err.config
    if (err.response) {
      // reject if error is not 401
      if (err.response.status !== 401) {
        return Promise.reject(err)
      }
      if (err.response.status === 401 && originalConfig.url === refreshurl) {
        return Promise.reject(err)
      }
      return AuthService.refresh(refreshurl)
        .then(response => {
          originalConfig.headers = AuthHeader(true)
          return axiosInstance(originalConfig)
        }).catch(error => {
          if (error.response && error.response.data) {
            return Promise.reject(error.response.data)
          }
          return Promise.reject(error)
        })
    }
    return Promise.reject(err)
  }
)
export default {
  axiosInstance
}
