import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from '../engine/world';
import { BallStick, benzene } from './Molecule';
import { stage } from './space';

/** Benzene in ball-and-stick, the hero object. Its position is shared with the fragment. */
export function Hero({ origin }: { origin: THREE.Vector3 }) {
  const outer = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Group>(null!);
  const spin = useRef(0);
  useFrame(({ viewport, pointer }, dt) => {
    const s = stage(viewport);
    const reveal = 1 - Math.pow(1 - world.reveal, 3);
    spin.current += dt * 0.25 + Math.max(-40, Math.min(40, world.velocity)) * dt * 0.03;
    outer.current.visible = world.mol > 0.01;
    outer.current.position.set(s.x, s.y, 0);
    outer.current.scale.setScalar(s.scale * reveal * world.mol);
    // tilted toward the camera so the ring reads, then a turntable spin around its own axis
    outer.current.rotation.set(-0.95 + pointer.y * 0.2, pointer.x * 0.2, 0);
    ring.current.rotation.z = spin.current;
    origin.copy(outer.current.position);
  });
  return (
    <group ref={outer}>
      <BallStick ref={ring} def={benzene} />
    </group>
  );
}
