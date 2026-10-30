import * as THREE from 'three';

/** A pool of five water molecules; the one in slot 0 is ejected and crashes into the title. */
export const POOL_SCALE = 1.0;
const RADIUS = 1.9;

export const SLOTS: THREE.Vector3[] = Array.from({ length: 5 }, (_, k) => {
  const a = Math.PI * 0.85 + (k / 5) * Math.PI * 2;
  return new THREE.Vector3(
    Math.cos(a) * RADIUS,
    Math.sin(a) * RADIUS * 0.8,
    Math.sin(k * 2.1) * 0.8
  );
});

/** Fixed starting orientation per molecule so the pool does not look like copies. */
export const TILT: [number, number, number][] = SLOTS.map((_, k) => [k * 1.1, k * 0.7, k * 0.5]);

/** Where the pool currently is in the world. Written by Hero, read by Fragment. */
export const pool = { center: new THREE.Vector3(), scale: 1 };
