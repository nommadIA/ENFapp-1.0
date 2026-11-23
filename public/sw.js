const V='enfapp-v5',SH=['/','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SH)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.startsWith('/@vite')||u.pathname.startsWith('/@fs')||u.pathname.startsWith('/node_modules')||u.pathname.startsWith('/src/')||u.pathname.startsWith('/api/')||u.pathname.startsWith('/auth/callback'))return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put('/',c))}return x}).catch(()=>caches.match('/')));
    return;
  }
  e.respondWith(caches.match(r).then(h=>{
    const net=fetch(r).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h2=>h2.put(r,c))}return x}).catch(()=>h);
    return h||net;
  }));
});
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'ENFapp',{body:d.body||'',icon:'/icon-192.png',badge:'/icon-192.png',tag:d.tag||'enfapp',renotify:true,requireInteraction:!!d.requireInteraction,vibrate:d.vibrate||[200,100,200],data:{url:d.url||'/'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const u=(e.notification.data&&e.notification.data.url)||'/';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus' in c){c.postMessage({t:u.includes('med=1')?'med':'open',url:u});return c.focus()}}
    return self.clients.openWindow(u);
  }));
});
