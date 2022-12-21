// Class User is needed for the authentification within the test environment.
// The test environment can be activated by setting the constant in the config file.
export default class User {
  constructor (username, password, email) {
    this.username = username
    this.password = password
    this.email = email
  }
}
