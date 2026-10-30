import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { renderHook } from '../engine/clock';
import { world } from '../engine/world';
import { Fragment } from './Fragment';
import { Particles } from './Particles';
import { Snake } from './Snake';

/** One fixed, click-through canvas. Rendering is driven by the shared ticker (frameloop never). */
export default function Stage() {
  const origin = useMemo(() => new THREE.Vector3(), []);
  const narrow = window.innerWidth < 760;
  return (
    <Canvas
      className="stage"
      frameloop="never"
      dpr={[1, narrow ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 18], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={(state) => {
        const el = state.gl.domElement;
        let slow = 0;
        renderHook.fn = (ms) => {
          el.style.opacity = String(world.visible * Math.min(1, world.reveal * 2));
          if (world.visible < 0.01) return;
          const t0 = performance.now();
          state.advance(ms / 1000, true); // never-mode expects seconds, not ms
          // adaptive resolution: drop the pixel ratio if frames stay slow
          slow = performance.now() - t0 > 14 ? slow + 1 : Math.max(0, slow - 1);
          if (slow > 90 && state.gl.getPixelRatio() > 1) {
            state.gl.setPixelRatio(Math.max(1, state.gl.getPixelRatio() * 0.8));
            slow = 0;
          }
        };
        el.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          renderHook.fn = null;
          document.documentElement.dataset.motion = 'off';
        });
      }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={2.4} />
      <directionalLight position={[-6, -2, -4]} intensity={0.8} color="#7FD6B0" />
      <Particles origin={origin} />
      <Fragment origin={origin} />
      <Snake />
    </Canvas>
  );
}
