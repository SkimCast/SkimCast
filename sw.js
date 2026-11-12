// SkimCast app helper: lets phones install SkimCast to the home screen.
// It always loads fresh pages from the internet (no stale forecasts) and only shows
// a short message if the phone is offline.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>SkimCast</title>' +
    '<body style="margin:0;font-family:system-ui;background:#1D1C1A;color:#F2EFE8;display:grid;place-items:center;min-height:100vh;text-align:center">' +
    '<div><h1 style="font-size:1.4rem">You\'re offline</h1><p style="color:#A8A296">SkimCast needs internet to load the forecast.</p></div></body>',
    { headers: { "content-type": "text/html; charset=utf-8" } })));
});
