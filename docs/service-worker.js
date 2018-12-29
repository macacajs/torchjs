/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "3c9438679cb428b0d6ad85ac74e6f9ca"
  },
  {
    "url": "assets/css/0.styles.705263ac.css",
    "revision": "69fac09aa630dcebaea4b1c6799f49d4"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.126dbf9d.js",
    "revision": "55e90988c268d61e89cf93b145e07b3b"
  },
  {
    "url": "assets/js/3.1c06348d.js",
    "revision": "bef3fc0a93220596c50a98d3c83d55d3"
  },
  {
    "url": "assets/js/4.af99eaf5.js",
    "revision": "38988011fefd8e4767d2762263d7cf0c"
  },
  {
    "url": "assets/js/5.13259ebd.js",
    "revision": "6a291abe7944505faa22787eeba100ff"
  },
  {
    "url": "assets/js/6.7db7f4d1.js",
    "revision": "6e34888a89768ba4ab4d31b2a66af97c"
  },
  {
    "url": "assets/js/7.e6f794bc.js",
    "revision": "17bff5c1446870d28fab00a7a92c4624"
  },
  {
    "url": "assets/js/app.32413105.js",
    "revision": "e4148059ec9735ad8c210d0cbda63b2d"
  },
  {
    "url": "guide/install.html",
    "revision": "da12a1bf9424631d31304b8e1db7f39a"
  },
  {
    "url": "index.html",
    "revision": "29951e16d13b09c04dc295c86b7dbd4c"
  },
  {
    "url": "zh/guide/install.html",
    "revision": "d6742aecda35c8a26aafc864da3d448e"
  },
  {
    "url": "zh/index.html",
    "revision": "58dd33f449decbfdd49697cc357f646e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
