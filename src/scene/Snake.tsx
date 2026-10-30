import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from '../engine/world';
import { C } from './palette';

const SEGMENTS = 34;
const GAP = 0.02;

/** The Python snake crosses the screen in the Code chapter, low enough to leave the text clear. */
export function Snake() {
  const segs = useRef<(THREE.Mesh | null)[]>([]);
  const colors = useMemo(
    () => Array.from({ length: SEGMENTS }, (_, i) => C.accent.clone().lerp(C.dim, i / SEGMENTS)),
    []
  );

  useFrame(({ viewport, clock }) => {
    const y0 = -viewport.height * 0.3;
    const h = world.snake * (1 + SEGMENTS * GAP);
    segs.current.forEach((m, i) => {
      if (!m) return;
      const s = h - i * GAP;
      m.visible = s > 0 && s < 1;
      if (!m.visible) return;
      const x = viewport.width / 2 + 1 - s * (viewport.width + 2);
      m.position.set(x, y0 + Math.sin(s * 20 - clock.elapsedTime * 3) * 0.5, 0.6);
      m.scale.setScalar(i === 0 ? 1.4 : 1 - (i / SEGMENTS) * 0.5);
    });
  });

  return (
    <>
      {colors.map((c, i) => (
        <mesh key={i} ref={(m) => (segs.current[i] = m)} visible={false}>
          <sphereGeometry args={[0.2, 18, 18]} />
          <meshStandardMaterial color={c} roughness={0.4} />
        </mesh>
      ))}
    </>
  );
}
