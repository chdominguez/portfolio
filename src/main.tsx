import '@fontsource-variable/geist-mono';
import '@fontsource-variable/schibsted-grotesk';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// Static mode: reduced motion or no WebGL renders the same content as a plain page.
const gl = document.createElement('canvas').getContext('webgl2');
if (matchMedia('(prefers-reduced-motion: reduce)').matches || !gl) {
  document.documentElement.dataset.motion = 'off';
} else if (innerWidth <= 900) {
  // phones and tablets: normal page flow, 3D only in the hero
  document.documentElement.dataset.motion = 'lite';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
