/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "cd10619ed46ee45075e6110c354cfa6e"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7ac687bac3c93d563eca0edce29f385b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "53f8e3034d5d970400958f9d434fe6c3"
  }, {
    "url": "index.html",
    "revision": "adf65348eea2df17f77b073473d72fd2"
  }, {
    "url": "icon.svg",
    "revision": "ec04c3ff53bcfa854738580f8ce6b021"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "31f3a2e9439534857ff96bfe832f0e9c"
  }, {
    "url": "assets/index-Dwaj9DSM.js",
    "revision": null
  }, {
    "url": "assets/index-B4y9Cvz9.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "31f3a2e9439534857ff96bfe832f0e9c"
  }, {
    "url": "icon.svg",
    "revision": "ec04c3ff53bcfa854738580f8ce6b021"
  }, {
    "url": "pwa-192x192.png",
    "revision": "53f8e3034d5d970400958f9d434fe6c3"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7ac687bac3c93d563eca0edce29f385b"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "cd10619ed46ee45075e6110c354cfa6e"
  }, {
    "url": "manifest.webmanifest",
    "revision": "e6479bc5b7e85cac77897c07716314eb"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
