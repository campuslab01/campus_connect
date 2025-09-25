import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: mode === 'production' 
    ? '/campus_connect'   // GitHub Pages repo name (no trailing slash)
    : '/',
}));
