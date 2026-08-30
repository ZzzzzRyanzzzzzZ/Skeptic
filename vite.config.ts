import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: process.env.GITHUB_PAGES && repo ? `/${repo}/` : '/',
  plugins: [react(), tailwindcss()],
  build: { target: 'es2022' },
});
