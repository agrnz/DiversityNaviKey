importScripts('./my-env-vars.js')

self.__precacheManifest = [].concat(self.__precacheManifest || [])

workbox.setConfig({
  debug: false
})

workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

self.addEventListener('install', function () {
  console.log('ServiceWorker: install event in progress')
  // self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('ServiceWorker: activate event in progress')
  self.clients.claim()
  // event.waitUntil(
  //   createDB()
  // )
})

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})


// push notifications
// self.addEventListener("push", function(event) {
//     let push_message = event.data.text()
//     click_open_url = "https://vuemese.."
//     const options = {
//         body: push_message.body,
//         icon: "./img/logo....",
//         image: "./itWorks..",
//         vibrate: [200, 100, 200, 100, 200, 100, 200],
//         tag: "vibration-sample"
//     }
//     event.waitUntil(
//         self.registration.showNotification("my notification", options)
//     )
// })

// register - click on notification and come right into application
// self.addEventListener("notificationclick", function(event) {
//     const clickedNotification = event.notification
//     clickedNotification.close()
//     if (click_open_url) {
//         const promiseChain = clients.openWindow(click_open_url)
//         event.waitUntil(promiseChain)
//     }
// })
