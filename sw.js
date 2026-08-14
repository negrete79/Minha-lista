// Usa a data atual para gerar um nome de cache único. 
// Isso garante que toda vez que você atualizar os arquivos, o cache antigo seja ignorado.
const CACHE_NAME = 'chef-ia-v-' + new Date().getDate() + '-' + new Date().getHours();
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Força o novo SW a ativar imediatamente
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Tenta buscar no cache, se não achar, busca na rede
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Apaga qualquer cache que não seja o da versão atual
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assume o controle da página imediatamente
});
