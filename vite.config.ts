// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Plugin to inject Firebase config into service worker
    {
      name: 'firebase-config-injector',
      generateBundle(_options, bundle) {
        // Inject Firebase config into service worker
        const swFileName = 'firebase-messaging-sw.js';
        const swFile = bundle[swFileName] || Object.values(bundle).find(
          (file: any) => file.fileName === swFileName || file.name === swFileName
        ) as any;
        
        if (swFile && swFile.type === 'asset' && typeof swFile.source === 'string') {
          const replacements: Record<string, string> = {
            '{{VITE_FIREBASE_API_KEY}}': process.env.VITE_FIREBASE_API_KEY || '',
            '{{VITE_FIREBASE_AUTH_DOMAIN}}': process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
            '{{VITE_FIREBASE_PROJECT_ID}}': process.env.VITE_FIREBASE_PROJECT_ID || '',
            '{{VITE_FIREBASE_STORAGE_BUCKET}}': process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
            '{{VITE_FIREBASE_MESSAGING_SENDER_ID}}': process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
            '{{VITE_FIREBASE_APP_ID}}': process.env.VITE_FIREBASE_APP_ID || ''
          };
          
          // Replace all placeholders
          Object.entries(replacements).forEach(([placeholder, value]) => {
            const source = swFile.source as string;
            swFile.source = source.replace(new RegExp(placeholder, 'g'), value);
          });
        }
      }
    }
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: mode === 'production' ? false : 'inline',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id: string) { // Explicitly type 'id' as string
          if (id.includes('node_modules')) {
            const match = id.match(/node_modules\/(.*?)(?:\/|$)/);
            if (match && match[1]) {
              // For scoped packages like @scope/package, return the full name
              if (match[1].startsWith('@')) {
                const scopedMatch = id.match(/node_modules\/(@.*?\/.*?)(?:\/|$)/);
                return scopedMatch ? scopedMatch[1] : 'vendor';
              }
              return match[1];
            }
            return 'vendor'; // Fallback for any unexpected paths
          }
          return undefined; // Let Vite handle default chunking for other files
        }
      }
    }
  }
}));
