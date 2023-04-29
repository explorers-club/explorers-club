import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  outDir: '../../dist/apps/explorers-cafe-web',
  integrations: [react()],
});
