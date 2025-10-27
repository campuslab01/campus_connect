// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
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
