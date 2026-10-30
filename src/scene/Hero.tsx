import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from '../engine/world';
import { BallStick, water } from './Molecule';
import { POOL_SCALE, SLOTS, TILT, pool } from './pool';
import { stage } from './space';

/** Hero: a pool of water. Slot 0 belongs to the Fragment, which ejects it later. */
export function Hero() {
  const outer = useRef<THREE.Group>(null!);
  const mols = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ viewport, pointer, clock }) => {
    const s = stage(viewport);
    const reveal = 1 - Math.pow(1 - world.reveal, 3);
    const t = clock.elapsedTime;
    const vis = world.mol * (1 - world.gap);
    outer.current.visible = vis > 0.01;
    outer.current.position.set(s.x, s.y, 0);
    outer.current.scale.setScalar(s.scale * reveal * vis);
    outer.current.rotation.set(pointer.y * 0.15, pointer.x * 0.15, 0);
    pool.center.copy(outer.current.position);
    pool.scale = s.scale * reveal * vis;
    mols.current.forEach((m, k) => {
      if (!m) return;
      m.rotation.set(TILT[k][0] + t * 0.35, TILT[k][1] + t * 0.27, TILT[k][2] + t * 0.18);
    });
  });
  return (
    <group ref={outer}>
      {SLOTS.map(
        (p, k) =>
          k > 0 && (
            <group key={k} position={p} scale={POOL_SCALE}>
              <BallStick ref={(m) => (mols.current[k] = m)} def={water} />
            </group>
          )
      )}
    </group>
  );
}
