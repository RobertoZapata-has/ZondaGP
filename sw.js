// Zonda GP: guarda el juego para jugar sin conexión
const CACHE='zonda-gp-v8';
const CORE=['./','./index.html','./autos.js','./portada.jpg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  // la página: primero red (para recibir actualizaciones), si no hay conexión, la guardada
  if(req.mode==='navigate'){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
  // el resto (three.js, fuentes, autos, imágenes): primero lo guardado
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')&&(url.origin===location.origin||/jsdelivr|unpkg|googleapis|gstatic/.test(url.host))){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})));
});
