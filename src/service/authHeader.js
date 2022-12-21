export default function authHeader (authRequired) {
  const localStorageName = process.env.VUE_APP_INDEXED_DB_NAME
  let user = JSON.parse(localStorage.getItem(localStorageName + '/user'))

  if (user && user.access_token && authRequired) {
    // console.log('authorized', user.access_token)
    return { Authorization: 'Bearer ' + user.access_token }
  } else {
    // console.log('non authorized')
    // return { 'Access-Control-Allow-Origin': '*' }
    return { }
  }
}
