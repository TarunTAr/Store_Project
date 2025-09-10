import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import eslint from 'vite-plugin-eslint';
import { checker } from 'vite-plugin-checker';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  return {
    // Base path
    base: env.VITE_BASE_PATH || '/',
    
    // Define global variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      __DEV__: !isProduction,
    },
    
    // Plugins
    plugins: [
      // React with SWC (faster than Babel)
      react({
        jsxImportSource: '@emotion/react',
        babel: false,
        plugins: [
          ['@swc/plugin-emotion', {}]
        ],
      }),
      
      // ESLint integration (only in development)
      isDevelopment && eslint({
        cache: true,
        include: ['./src/**/*.{js,jsx,ts,tsx}'],
        exclude: ['node_modules', 'dist', 'build'],
        failOnWarning: false,
        failOnError: false,
      }),
      
      // TypeScript and ESLint checker (only in development)
      isDevelopment && checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        },
        overlay: {
          initialIsOpen: false,
          position: 'tl',
        },
        terminal: false,
      }),
      
      // Progressive Web App
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        
        // Service worker configuration
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}'],
          runtimeCaching: [
            // API responses
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 5 * 60, // 5 minutes
                },
                cacheKeyWillBeUsed: async ({ request }) => {
                  return `${request.url}?timestamp=${Math.floor(Date.now() / 1000 / 60 / 5)}`;
                },
              },
            },
            // Images
            {
              urlPattern: /\.(png|jpg|jpeg|gif|svg|webp|ico|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
            // Static assets
            {
              urlPattern: /\.(js|css|woff|woff2|ttf|eot)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
              },
            },
            // External CDN resources
            {
              urlPattern: /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg\.com)/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'cdn-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/, /^\/api\//],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        },
        
        // Manifest configuration
        manifest: {
          name: 'Store Rating Platform',
          short_name: 'StoreRating',
          description: 'Rate and review stores with our comprehensive platform',
          theme_color: '#667eea',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          id: 'store-rating-app',
          categories: ['business', 'shopping', 'lifestyle', 'productivity'],
          lang: 'en-US',
          dir: 'ltr',
          icons: [
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'maskable any'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable any'
            }
          ],
          shortcuts: [
            {
              name: 'Find Stores',
              short_name: 'Stores',
              description: 'Browse and search for stores',
              url: '/stores',
              icons: [{ src: '/icons/shortcut-stores.png', sizes: '96x96' }]
            },
            {
              name: 'My Ratings',
              short_name: 'Ratings',
              description: 'View your submitted ratings',
              url: '/profile/ratings',
              icons: [{ src: '/icons/shortcut-ratings.png', sizes: '96x96' }]
            },
            {
              name: 'Dashboard',
              short_name: 'Dashboard',
              description: 'Access your dashboard',
              url: '/dashboard',
              icons: [{ src: '/icons/shortcut-dashboard.png', sizes: '96x96' }]
            }
          ],
        },
        
        // Development options
        devOptions: {
          enabled: isDevelopment && env.VITE_PWA_DEV === 'true',
          type: 'module',
          navigateFallback: '/index.html',
          suppressWarnings: true,
        },
      }),
    ].filter(Boolean), // Remove falsy plugins
    
    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@hooks': resolve(__dirname, './src/hooks'),
        '@services': resolve(__dirname, './src/services'),
        '@utils': resolve(__dirname, './src/utils'),
        '@styles': resolve(__dirname, './src/styles'),
        '@assets': resolve(__dirname, './src/assets'),
        '@config': resolve(__dirname, './src/config'),
        '@store': resolve(__dirname, './src/store'),
        '@contexts': resolve(__dirname, './src/contexts'),
        '@types': resolve(__dirname, './src/types'),
        '@api': resolve(__dirname, './src/api'),
        '@constants': resolve(__dirname, './src/constants'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
    },
    
    // CSS configuration
    css: {
      devSourcemap: isDevelopment,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
          includePaths: ['node_modules'],
        },
      },
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: isDevelopment 
          ? '[name]__[local]___[hash:base64:5]' 
          : '[hash:base64:8]',
      },
      postcss: {
        plugins: [],
      },
    },
    
    // Development server
    server: {
      host: env.VITE_HOST || '0.0.0.0',
      port: parseInt(env.VITE_PORT) || 3000,
      strictPort: false,
      open: isDevelopment && env.VITE_OPEN_BROWSER !== 'false',
      cors: {
        origin: true,
        credentials: true,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('Proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        '/ws': {
          target: env.VITE_WS_URL || 'ws://localhost:3001',
          ws: true,
          changeOrigin: true,
        },
        '/socket.io': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3001',
          ws: true,
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: isDevelopment,
        clientPort: parseInt(env.VITE_HMR_PORT) || undefined,
      },
      watch: {
        usePolling: process.env.VITE_USE_POLLING === 'true',
        interval: 1000,
      },
    },
    
    // Preview server (for production build testing)
    preview: {
      host: env.VITE_PREVIEW_HOST || '0.0.0.0',
      port: parseInt(env.VITE_PREVIEW_PORT) || 3000,
      strictPort: false,
      open: env.VITE_PREVIEW_OPEN === 'true',
      cors: true,
    },
    
    // Build configuration
    build: {
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      outDir: env.VITE_BUILD_DIR || 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true' || (isDevelopment && 'inline'),
      minify: isProduction ? 'esbuild' : false,
      cssMinify: isProduction,
      
      // Rollup options
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          chunkFileNames: isProduction 
            ? 'assets/js/[name]-[hash].js' 
            : 'assets/js/[name].js',
          entryFileNames: isProduction 
            ? 'assets/js/[name]-[hash].js' 
            : 'assets/js/[name].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
          manualChunks: isProduction ? {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            'vendor-ui': ['framer-motion', 'react-hot-toast', '@emotion/react', '@emotion/styled'],
            'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'yup', 'zod'],
            'vendor-utils': ['lodash', 'date-fns', 'uuid', 'axios'],
            'vendor-icons': ['lucide-react', 'react-icons', '@heroicons/react'],
            
            // Feature chunks - only if files exist
            ...((() => {
              const chunks = {};
              // Add conditional chunks based on your actual file structure
              return chunks;
            })()),
          } : undefined,
        },
        external: [],
      },
      
      // Asset optimization
      assetsInlineLimit: 4096, // 4kb
      cssCodeSplit: true,
      
      // Bundle analysis
      reportCompressedSize: isProduction,
      chunkSizeWarningLimit: 1500, // 1.5MB
      
      // Terser options for production
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
    },
    
    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux',
        'redux-persist',
        'axios',
        'react-hook-form',
        'framer-motion',
        'date-fns',
        'lodash',
        'clsx',
        'uuid',
        'js-cookie',
      ],
      exclude: ['@vite/client', '@vite/env'],
      esbuildOptions: {
        target: 'es2020',
      },
    },
    
    // Environment variables prefix
    envPrefix: ['VITE_', 'REACT_APP_'],
    
    // Worker configuration
    worker: {
      format: 'es',
      rollupOptions: {
        output: {
          chunkFileNames: 'worker/[name]-[hash].js',
          entryFileNames: 'worker/[name]-[hash].js',
        },
      },
    },
    
    // JSON configuration
    json: {
      namedExports: true,
      stringify: false,
    },
    
    // Esbuild configuration
    esbuild: {
      target: 'es2020',
      platform: 'browser',
      logOverride: {
        'this-is-undefined-in-esm': 'silent',
      },
      drop: isProduction ? ['console', 'debugger'] : [],
    },

    // Experimental features
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { js: `/${filename}` };
        } else {
          return { relative: true };
        }
      },
    },

    // Logger level
    logLevel: isDevelopment ? 'info' : 'warn',
    
    // Clear screen
    clearScreen: isDevelopment,
  };
});
