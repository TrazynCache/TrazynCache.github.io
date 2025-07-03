// Service Worker for automatic cache management and version control
const CACHE_VERSION = 'v1.0.4';
const CACHE_NAME = `iron-adamant-portfolio-${CACHE_VERSION}`;
const VERSION_CACHE = 'version-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/projects.html',
  '/contact.html',
  '/404.html',
  '/css/styles.css',
  '/css/accessibility.css',
  '/css/radical-solution.css',
  '/js/combined.js',
  '/js/resource-optimizer.js',
  '/js/page-preloader.js',
  '/js/performance-monitor.js',
  '/js/project-data.js',
  '/js/project-loader.js',
  '/js/sw-register.js',
  '/manifest.json'
];

// Check for version updates
async function checkForUpdates() {
  try {
    const response = await fetch('/manifest.json', { cache: 'no-cache' });
    const manifest = await response.json();
    const newVersion = manifest.version;
    const newTimestamp = manifest.build_timestamp;
    
    // Get stored version info
    const versionCache = await caches.open(VERSION_CACHE);
    const storedResponse = await versionCache.match('version-info');
    
    if (storedResponse) {
      const storedData = await storedResponse.json();
      
      // Check if version or timestamp has changed
      if (storedData.version !== newVersion || storedData.build_timestamp !== newTimestamp) {
        console.log('New version detected:', newVersion);
        await clearAllCaches();
        await storeVersionInfo(newVersion, newTimestamp);
        return true; // Update available
      }
    } else {
      // First time - store version info
      await storeVersionInfo(newVersion, newTimestamp);
    }
    
    return false; // No update
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
}

// Store version information
async function storeVersionInfo(version, timestamp) {
  const versionCache = await caches.open(VERSION_CACHE);
  const versionData = { version, build_timestamp: timestamp };
  const response = new Response(JSON.stringify(versionData));
  await versionCache.put('version-info', response);
}

// Clear all caches except version cache
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  const deletePromises = cacheNames
    .filter(name => name !== VERSION_CACHE)
    .map(name => {
      console.log('Deleting cache:', name);
      return caches.delete(name);
    });
  
  await Promise.all(deletePromises);
  
  // Notify all clients about the update
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'CACHE_UPDATED',
      message: 'New version available! The page will refresh automatically.'
    });
  });
}

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force immediate activation
  );
});


// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          // For HTML files, also update cache in background
          if (event.request.mode === 'navigate' || event.request.url.endsWith('.html')) {
            event.waitUntil(updateCache(event.request));
          }
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response
          caches.open(CACHE_NAME)
            .then(cache => {
              // Cache static assets with version query string
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Update cache in background
function updateCache(request) {
  return fetch(request).then(response => {
    return caches.open(CACHE_NAME).then(cache => {
      return cache.put(request, response);
    });
  });
}

// Listen for messages
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  } else if (event.data.action === 'checkForUpdates') {
    event.waitUntil(checkForUpdates().then(hasUpdate => {
      event.ports[0].postMessage({ hasUpdate });
    }));
  }
});

// Periodic update check when service worker becomes active
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== VERSION_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Check for updates
      checkForUpdates()
    ]).then(() => self.clients.claim())
  );
});

// Background sync for update checking
self.addEventListener('sync', event => {
  if (event.tag === 'update-check') {
    event.waitUntil(checkForUpdates());
  }
});
