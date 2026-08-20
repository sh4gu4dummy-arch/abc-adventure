import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { CreatedWithGrokBanner } from "@/components/created-with-grok-banner";
import { CelebrateOverlay } from "@/components/alphabet/CelebrateOverlay";
import { RequirePlayer } from "@/components/alphabet/ProfileGate";
import { initLayoutMode } from "@/lib/layout-mode";
import { initGfxMode } from "@/lib/gfx-pref";
import { initThemeMode } from "@/lib/theme-pref";
import {
  isEmbeddedPreview,
  isGrokSandboxHost,
  neutralizeServiceWorkerInPreview,
} from "@/lib/preview-safe";
import appCss from "../styles.css?url";

const APP_NAME = "ABC Adventure — Letter World";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host
  ? `https://og.grok.me/v1/card.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}`
  : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "A beautiful offline-friendly alphabet learning adventure for young learners — 26 letters, word posters, sounds, tracing, and games.",
      },
      { name: "theme-color", content: "#ff6b6b" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: RootShell,
});

function PlayerAwareOutlet() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/login" || pathname.startsWith("/auth")) {
    return <Outlet />;
  }
  return (
    <RequirePlayer>
      <Outlet />
      <CelebrateOverlay />
    </RequirePlayer>
  );
}

function RootShell() {
  useEffect(() => {
    initLayoutMode();
    initGfxMode();
    initThemeMode();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isEmbeddedPreview() || isGrokSandboxHost()) {
      void neutralizeServiceWorkerInPreview();
      return;
    }

    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline SW is best-effort */
    });
  }, []);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-layout="phone"
      data-layout-pref="auto"
      data-gfx="high"
      data-gfx-pref="auto"
      data-theme="light"
      data-theme-pref="auto"
      className="gfx-high theme-light"
    >
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='abc-layout-pref-v1';var p=localStorage.getItem(k)||'auto';if(p==='phone')p='portrait';if(p==='desktop')p='landscape';var w=window.innerWidth,h=window.innerHeight;var r=p==='portrait'?'phone':p==='landscape'?'desktop':(w>h?'desktop':'phone');var el=document.documentElement;el.dataset.layout=r;el.dataset.layoutPref=p;el.dataset.orientation=w>h?'landscape':'portrait';el.classList.add(r==='phone'?'layout-phone':'layout-desktop');}catch(e){}
try{var gk='abc-gfx-pref-v1';var gp=localStorage.getItem(gk)||'auto';var lite=false;try{var n=navigator;if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)lite=true;if(window.matchMedia&&window.matchMedia('(prefers-reduced-data: reduce)').matches)lite=true;if(n.connection&&n.connection.saveData)lite=true;var et=n.connection&&n.connection.effectiveType;if(et==='slow-2g'||et==='2g'||et==='3g')lite=true;if(typeof n.deviceMemory==='number'&&n.deviceMemory>0&&n.deviceMemory<=2)lite=true;if(typeof n.deviceMemory==='number'&&n.deviceMemory<=4&&typeof n.hardwareConcurrency==='number'&&n.hardwareConcurrency>0&&n.hardwareConcurrency<=4)lite=true;}catch(e2){}var gr=gp==='lite'?'lite':gp==='high'?'high':(lite?'lite':'high');var h2=document.documentElement;h2.dataset.gfx=gr;h2.dataset.gfxPref=gp;h2.classList.remove('gfx-high','gfx-lite');h2.classList.add(gr==='lite'?'gfx-lite':'gfx-high');}catch(e3){}})();
try{var tk='abc-theme-pref-v1';var tp=localStorage.getItem(tk)||'auto';var dark=false;try{if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)dark=true;}catch(e4){}var tr=tp==='dark'?'dark':tp==='light'?'light':(dark?'dark':'light');var h3=document.documentElement;h3.dataset.theme=tr;h3.dataset.themePref=tp;h3.classList.remove('theme-dark','theme-light');h3.classList.add(tr==='dark'?'theme-dark':'theme-light');h3.style.colorScheme=tr;}catch(e5){}
(function(){try{var emb=false;try{emb=window.top!==window.self;}catch(e){emb=true;}if(!emb&&!/\\.grok-sandbox\\.com$/.test(location.hostname))return;if(!('serviceWorker' in navigator))return;navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();});});if(window.caches)caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k);});});}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <PlayerAwareOutlet />
          <CreatedWithGrokBanner />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
