import { type PropsWithChildren } from "react";
import { ScrollViewStyleReset } from "expo-router/html";

/**
 * Custom <html> for the static web export. expo-router calls this for every
 * exported route. We use it to inject the iOS PWA meta tags, link to our
 * manifest, and register the service worker — none of which Expo does by
 * default but all of which are required to make the site behave like a real
 * native app on iPhone (full-screen, custom icon, status-bar styling).
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />

        <title>PlateIQ — On-device food intelligence</title>
        <meta name="description" content="Demystify any food label or plate on your phone. Free, private, no API keys." />
        <meta name="theme-color" content="#0B1220" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* iOS PWA — these make Add-to-Home-Screen look + behave like a real app */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PlateIQ" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Apple touch icons (used as the iOS home-screen icon) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        <ScrollViewStyleReset />

        {/* Static dark background so iOS Safari doesn't flash white during nav */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #root { background:#0B1220; }
          body { -webkit-tap-highlight-color: transparent; overscroll-behavior: none; }
        ` }} />

        {/* Service-worker registration — runs once the page loads */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
              navigator.serviceWorker.register('/sw.js').catch(function (e) {
                console.warn('SW registration failed:', e);
              });
            });
          }
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
