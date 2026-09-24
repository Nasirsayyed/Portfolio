import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    // three.js is ~800 kB minified on its own. It's reached only through the
    // lazy 3D scene imports, so it loads after first paint. (Don't force it into
    // a manualChunks bucket: Rollup then hoists shared deps like React into it
    // and the entry chunk ends up statically importing all of three.js.)
    chunkSizeWarningLimit: 900,
  },
});
