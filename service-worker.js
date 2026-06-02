/* ==========================
   FOCUSFLOW V2
   SERVICE WORKER
========================== */

const CACHE_NAME = "focusflow-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

/* INSTALL */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(ASSETS);

      })

  );

  self.skipWaiting();

});

/* ACTIVATE */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys.map(key => {

            if(key !== CACHE_NAME){

              return caches.delete(key);

            }

          })

        );

      })

  );

  self.clients.claim();

});

/* FETCH */

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        if(response){

          return response;

        }

        return fetch(event.request)

          .then(networkResponse => {

            const responseClone =
            networkResponse.clone();

            caches.open(CACHE_NAME)

              .then(cache => {

                cache.put(
                  event.request,
                  responseClone
                );

              });

            return networkResponse;

          })

          .catch(() => {

            return caches.match(
              "./index.html"
            );

          });

      })

  );

});
