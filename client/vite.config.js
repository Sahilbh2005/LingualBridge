import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import themeDetector from './vite-plugin-theme-detector';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), themeDetector()],
});
