import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Waste2Menu-AI/', // Must match repo name with leading and trailing slashes
});