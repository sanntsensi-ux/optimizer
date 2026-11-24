// Cache isolado por pasta, para não interferir em outros apps no mesmo domínio.
const PREFIX='optimizer-vip:'+self.registration.scope+':';
const CACHE=PREFIX+'v13.1';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/favicon-32.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const r=event.request;
 if(r.method!=='GET'||!r.url.startsWith(self.registration.scope))return;
 if(r.mode==='navigate'){
  event.respondWith(fetch(r).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(r,response.clone());}return response;}).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(r)||await cache.match('./index.html')||Response.error();}));
 }else{
  event.respondWith(caches.open(CACHE).then(async cache=>await cache.match(r)||fetch(r)));
 }
});
