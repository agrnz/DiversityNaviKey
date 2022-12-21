# DiversityNaviKey

DiversityNaviKey (DNK) is a progressive web application (PWA) primarily designed for diagnosis and interactive identification of organisms or other items as well as item groups which are part of or related to biodiversity, geodiversity or environmental research, by means of a set of pre-defined characteristics. 
For current information see [DiversityNaviKey Wiki](https://diversityworkbench.net/Portal/DiversityNaviKey).

The Single Page Application is implemented with the [Vue.js framework (version 2.6.12)](https://vuejs.org/) and additionally uses the libraries:
- [Vue Router (version 3.5.1)](https://router.vuejs.org/) - The official navigation library for vue.js
- [Vuetify (version 2.5.6)](https://vuetifyjs.com/) - A UI library based on the Materal Design Specification
- [Vuex (version 3.6.2)](https://vuex.vuejs.org/) - A state management library

Further libraries the app uses are:
- axios - A promise based HTTP client
- core-js - A modular standard library for JavaScript
- rfdc - Really Fast Deep Clone
- idb - A wrapper for IndexedDB API
- register-service-worker - A script to simplify service worker registration with hooks
- semver - A semantic version parser
- typeface-roboto -  The roboto typeface
- vue-i18n - An internationalization plugin for Vue.js

## Project setup

After cloning the repository call

```
npm install
```
to install all needed node-modules as defined in the package.json file.

### Compiles and hot-reloads for development

Define the WebService REST endpoint via the VUE_APP_ROOT_API variable in the .env configuration file. Make sure the DNK Rest service is running and start the development environment by calling

```
npm run serve
```
You can also define the IndexeDB name within the .env configuration file via the VUE_APP_INDEXED_DB_NAME variable and the version of dnk via VUE_APP_VERSION. 

### Compiles and minifies for production
For a production build call 
```
npm run build
```
instead of npm run serve.

### Run Unit Tests with JEST

There are two unit test files for testing the filtering methods. 
```
npm run test:unit
```
Currently (07/2022) there are no test files for the components. TODO

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Architecture

![DNK Architecture](/src/assets/Readme/DNK_dataflow_online.png?raw=true "DNK Architecture")

## DNK - State management and data flow with vuex

![DNK State management](/src/assets/Readme/DNKImplementierungVUEXArchitektur.png?raw=true "DNK State management")
