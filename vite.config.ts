import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The 3D stack is split out automatically via the lazy import of scene/Stage in App.tsx.
export default defineConfig({ plugins: [react()] });
