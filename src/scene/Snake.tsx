import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { anchor } from '../scroll';
import { clamp, lerp, toWorld } from './helpers';

const N = 30;
const GAP = 0.018;

/** The Python backend snake: slithers in from the right and burrows into the skills chip. */
export function Snake() {
  const segs = useRef<(THREE.Mesh | null)[]>([]);
  const colors = useMemo(
    () =>
      Array.from({ length: N }, (_, i) =>
        new THREE.Color('#ffd43b').lerp(new THREE.Color('#3776ab'), i / N)
      ),
    []
  );

  useFrame(({ viewport, clock }) => {
    const a = anchor('python');
    if (!a) return;
    const start = viewport.width / 2 + 1.5;
    const end = toWorld(a.rect.left + a.rect.width * 0.25, 0, viewport).x;
    const y0 = toWorld(0, a.rect.top + a.rect.height / 2, viewport).y;
    // head runs s=0..1, then keeps going so the tail follows it into the "hole" at s=1
    const h = clamp((a.p - 0.2) / 0.45) * (1 + N * GAP);
    segs.current.forEach((m, i) => {
      if (!m) return;
      const s = h - i * GAP;
      m.visible = s > 0 && s < 1;
      if (!m.visible) return;
      const amp = 0.45 * Math.sin(s * Math.PI);
      m.position.set(lerp(start, end, s), y0 + Math.sin(s * 22 - clock.elapsedTime * 3) * amp, 0.6);
      m.scale.setScalar(i === 0 ? 1.35 : 1 - (i / N) * 0.55);
    });
  });

  return (
    <>
      {colors.map((c, i) => (
        <mesh key={i} ref={(m) => (segs.current[i] = m)} visible={false}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color={c} roughness={0.35} />
          {i === 0 && (
            <>
              <mesh position={[-0.1, 0.12, 0.17]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color="#07080d" />
              </mesh>
              <mesh position={[-0.1, -0.1, 0.17]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color="#07080d" />
              </mesh>
            </>
          )}
        </mesh>
      ))}
    </>
  );
}
