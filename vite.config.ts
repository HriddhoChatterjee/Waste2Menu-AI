import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Using relative base path ensures smooth deployment on GitHub Pages (any repo name) and custom domains
});