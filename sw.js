// ========================================
// TaskPro Service Worker
// ========================================

const CACHE_NAME = "taskpro-v1.1.1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/icon.svg"
];


// ========================================
// INSTALL
// ========================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );


        self.skipWaiting();

    }
);


// ========================================
// ACTIVATE
// ========================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames
                            .filter(
                                name =>
                                    name !==
                                    CACHE_NAME
                            )
                            .map(
                                name =>
                                    caches.delete(
                                        name
                                    )
                            )

                    );

                })

        );


        self.clients.claim();

    }
);


// ========================================
// FETCH
// ========================================

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(
                    event.request
                );

            })

        );

    }
);