import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/',
  publicDir: false,
  server: { host: 'localhost', port: 5173, strictPort: true },
  preview: { host: 'localhost', port: 4175, strictPort: true },
  plugins: [{
    name: 'birthday-slide-templates',
    buildStart() { execFileSync(process.execPath, ['build.cjs'], { cwd: root, stdio: 'inherit' }); },
    configureServer(server) {
      server.watcher.on('change', file => {
        if (file.endsWith('section.html') || file.endsWith('navigation.html')) {
          execFileSync(process.execPath, ['build.cjs'], { cwd: root, stdio: 'inherit' });
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  }],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    assetsInlineLimit: 0,
    rolldownOptions: {
      input: Object.fromEntries(['index.html', ...[1, 2, 3, 4].map(n => `slides/slide${n}/index.html`)]
        .map(file => [file, fileURLToPath(new URL(file, import.meta.url))])),
    },
  },
});
