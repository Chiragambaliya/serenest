/**
 * Single-file build used only to produce a shareable, clickable
 * preview of the site (published as an artifact). Everything —
 * JS, CSS, fonts — is inlined into one HTML document, because the
 * artifact host blocks requests to any external file.
 *
 * This config is for review only. It is not used by `npm run build`
 * and has no effect on what ships.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-preview',
    // Inline every asset, fonts included (~1.4 MB of .ttf).
    assetsInlineLimit: 100 * 1024 * 1024,
    cssCodeSplit: false,
    // Lazy routes must be folded into the single bundle rather than
    // emitted as separate chunks the page could never fetch.
    rollupOptions: {
      output: { inlineDynamicImports: true, manualChunks: undefined },
    },
    chunkSizeWarningLimit: 100000,
  },
});
