import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { anchor, isNarrow } from '../scroll';
import { clamp, toWorld } from './helpers';

const COLS = 6;
const ROWS = 4;
const GAP = 0.8;

/** HPC node grid: a workflow lights up node by node as the Temple Compute card scrolls by. */
export function Cluster() {
  const group = useRef<THREE.Group>(null!);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);
  // a snake-order walk through the grid stands in for the workflow DAG
  const order = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        return r % 2 ? r * COLS + (COLS - 1 - c) : i;
      }),
    []
  );

  useFrame(({ viewport, clock }) => {
    const a = anchor('temple');
    const g = group.current;
    g.visible = !!a && !isNarrow();
    if (!a || !g.visible) return;
    const w = (COLS - 1) * GAP;
    const pos = toWorld(
      a.rect.right + (window.innerWidth - a.rect.right) / 2,
      a.rect.top + a.rect.height / 2,
      viewport
    );
    g.position.set(Math.min(pos.x, viewport.width / 2 - w / 2 - 0.4), pos.y, -0.5);
    g.rotation.set(-0.5, -0.5 + Math.sin(clock.elapsedTime * 0.3) * 0.1, 0);
    const fade = Math.sin(Math.PI * clamp((a.p - 0.1) / 0.8));
    g.scale.setScalar(clamp(fade * 2));
    g.visible = fade > 0.001; // scale 0 is invisible anyway; lets the stage go idle
    const lit = clamp((a.p - 0.25) / 0.45) * order.length;
    for (let step = 0; step < order.length; step++) {
      const m = nodes.current[order[step]];
      if (!m) continue;
      const on = clamp(lit - step);
      (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + on * 1.6;
      m.scale.setScalar(0.8 + on * 0.25);
    }
  });

  return (
    <group ref={group} visible={false}>
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => (nodes.current[i] = m)}
          position={[
            (i % COLS) * GAP - ((COLS - 1) * GAP) / 2,
            (ROWS / 2 - Math.floor(i / COLS)) * GAP,
            0,
          ]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#5eead4"
            emissiveIntensity={0.15}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
