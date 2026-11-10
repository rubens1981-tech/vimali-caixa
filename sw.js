/* VIMALI Caixa — funciona sem internet (cache do próprio app; nenhum dado sai do aparelho por aqui) */
const CACHE='vimali-caixa-1.0.3';
const ARQ=['./','index.html','manifest.webmanifest','icones/icone-192.png','icones/icone-512.png','icones/icone-maskable-512.png','icones/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQ)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('vimali-caixa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // página: tenta a rede primeiro (para receber atualizações) e cai no cache sem internet
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return r;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
