import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import prerender from '@prerenderer/rollup-plugin'
import { execSync } from 'child_process'

// Find chromium/chrome executable for pre-rendering
function findChromium(): string | undefined {
  // First try environment variable
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // Try to find via which (works on both local and CI)
  try {
    const result = execSync('which chromium chromium-browser google-chrome 2>/dev/null | head -1', { encoding: 'utf-8' }).trim();
    if (result) {
      console.log(`[prerender] Found browser at: ${result}`);
      return result;
    }
  } catch {
    // Not found via which
  }

  // Check common locations as fallback
  const paths = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];

  for (const p of paths) {
    try {
      execSync(`test -x "${p}"`, { stdio: 'ignore' });
      console.log(`[prerender] Found browser at: ${p}`);
      return p;
    } catch {
      // Path doesn't exist or isn't executable
    }
  }

  console.log('[prerender] No browser found, skipping pre-rendering');
  return undefined;
}

const chromiumPath = findChromium();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Basketball Scoreboard Online',
        short_name: 'Scoreboard',
        description: 'Professional free basketball scoreboard - offline-first, Chinese-friendly',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    // Pre-render static content pages for SEO (only if chromium is available)
    ...(chromiumPath ? [prerender({
      routes: ['/', '/rules', '/faq', '/tutorial'],
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'render-event',
        headless: true,
        executablePath: chromiumPath,
        // Args needed for running in CI/container environments
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      },
      postProcess(renderedRoute) {
        // Update meta tags per route for better SEO
        const routeMeta: Record<string, { title: string; description: string }> = {
          '/': {
            title: 'Free Basketball Scoreboard Online - FIBA, NBA, NCAA Timer & Stats',
            description: 'Free online basketball scoreboard with game timer, shot clock, player stats, and OBS streaming. Works offline. Supports FIBA, NBA, NCAA, and 3x3 rules.',
          },
          '/rules': {
            title: 'Basketball Rules Guide - FIBA, NBA, NCAA Rules Explained | Basketball Scoreboard',
            description: 'Complete basketball rules guide covering FIBA, NBA, NCAA and 3x3 rules. Learn scoring, fouls, violations, shot clock, and game procedures for all major basketball leagues.',
          },
          '/faq': {
            title: 'FAQ - Basketball Scoreboard Help & Support | Basketball Scoreboard',
            description: 'Frequently asked questions about Basketball Scoreboard. Learn about features, keyboard shortcuts, OBS streaming, offline mode, and more.',
          },
          '/tutorial': {
            title: 'How to Use Basketball Scoreboard - Complete Tutorial | Basketball Scoreboard',
            description: 'Step-by-step tutorial for Basketball Scoreboard. Learn scoring, timer controls, keyboard shortcuts, player stats tracking, OBS streaming integration, and more.',
          },
        };

        const meta = routeMeta[renderedRoute.route];
        if (meta) {
          // Update title
          renderedRoute.html = renderedRoute.html.replace(
            /<title>[^<]*<\/title>/,
            `<title>${meta.title}</title>`
          );
          // Update meta description
          renderedRoute.html = renderedRoute.html.replace(
            /<meta name="description" content="[^"]*">/,
            `<meta name="description" content="${meta.description}">`
          );
          // Update OG title
          renderedRoute.html = renderedRoute.html.replace(
            /<meta property="og:title" content="[^"]*">/,
            `<meta property="og:title" content="${meta.title}">`
          );
          // Update OG description
          renderedRoute.html = renderedRoute.html.replace(
            /<meta property="og:description" content="[^"]*">/,
            `<meta property="og:description" content="${meta.description}">`
          );
          // Update Twitter title
          renderedRoute.html = renderedRoute.html.replace(
            /<meta property="twitter:title" content="[^"]*">/,
            `<meta property="twitter:title" content="${meta.title}">`
          );
          // Update Twitter description
          renderedRoute.html = renderedRoute.html.replace(
            /<meta property="twitter:description" content="[^"]*">/,
            `<meta property="twitter:description" content="${meta.description}">`
          );
          // Update canonical URL
          const pageUrl = `https://www.basketballscoreboardonline.com${renderedRoute.route === '/' ? '' : renderedRoute.route}`;
          renderedRoute.html = renderedRoute.html.replace(
            /<link rel="canonical" href="[^"]*">/,
            `<link rel="canonical" href="${pageUrl}">`
          );
          // Update meta name="title"
          renderedRoute.html = renderedRoute.html.replace(
            /<meta name="title" content="[^"]*">/,
            `<meta name="title" content="${meta.title}">`
          );
          // Update og:url
          renderedRoute.html = renderedRoute.html.replace(
            /<meta property="og:url" content="[^"]*">/,
            `<meta property="og:url" content="${pageUrl}">`
          );
          // Update twitter:url
          renderedRoute.html = renderedRoute.html.replace(
            /<meta property="twitter:url" content="[^"]*">/,
            `<meta property="twitter:url" content="${pageUrl}">`
          );
        }
      },
    })] : []),
  ],
})
