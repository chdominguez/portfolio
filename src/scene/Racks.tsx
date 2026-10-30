import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, world } from '../engine/world';
import { C } from './palette';
import { smooth, stage } from './space';

const RACKS = 3;
const SLOTS = 10;
const W = 1.7;
const H = 4.6;
const D = 1.3;
const GAP = 0.45;

/** Three server racks. Their status lights switch on one by one as the Compute chapter plays. */
export function Racks() {
  const group = useRef<THREE.Group>(null!);
  const leds = useRef<THREE.InstancedMesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);

  const slots = useMemo(() => {
    const out: { x: number; y: number; r: number; s: number }[] = [];
    for (let r = 0; r < RACKS; r++)
      for (let s = 0; s < SLOTS; s++)
        out.push({
          x: (r - (RACKS - 1) / 2) * (W + GAP),
          y: -H / 2 + 0.45 + s * ((H - 0.9) / (SLOTS - 1)),
          r,
          s,
        });
    return out;
  }, []);

  useFrame(({ viewport, clock }) => {
    const g = group.current;
    g.visible = world.racks > 0.01;
    if (!g.visible) return;
    const st = stage(viewport);
    g.position.set(st.x, st.y - 0.2, 0);
    g.scale.setScalar(st.scale * smooth(world.racks) * 0.85);
    g.rotation.set(0.05, -0.55 + Math.sin(clock.elapsedTime * 0.3) * 0.05, 0);
    slots.forEach((sl, i) => {
      // fill rack by rack, bottom to top
      const lit = clamp(world.lit * slots.length - (sl.r * SLOTS + sl.s));
      o.position.set(sl.x + W * 0.36, sl.y, D / 2 + 0.07);
      o.updateMatrix();
      leds.current.setMatrixAt(i, o.matrix);
      col.copy(C.dim).lerp(C.accent, lit);
      leds.current.setColorAt(i, col);
    });
    leds.current.instanceMatrix.needsUpdate = true;
    if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={group} visible={false}>
      {Array.from({ length: RACKS }, (_, r) => (
        <group key={r} position={[(r - (RACKS - 1) / 2) * (W + GAP), 0, 0]}>
          <mesh>
            <boxGeometry args={[W, H, D]} />
            <meshStandardMaterial color="#222B31" roughness={0.55} metalness={0.2} />
          </mesh>
          {/* technical-plate outline so the racks read against the dark page */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
            <lineBasicMaterial color={C.muted} transparent opacity={0.55} />
          </lineSegments>
          {Array.from({ length: SLOTS }, (_, s) => (
            <mesh
              key={s}
              position={[-0.1, -H / 2 + 0.45 + s * ((H - 0.9) / (SLOTS - 1)), D / 2 + 0.03]}
            >
              <boxGeometry args={[W * 0.78, 0.3, 0.06]} />
              <meshStandardMaterial color="#323D44" roughness={0.5} metalness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      <instancedMesh ref={leds} args={[undefined, undefined, slots.length]} frustumCulled={false}>
        <boxGeometry args={[0.14, 0.14, 0.06]} />
        <meshBasicMaterial />
      </instancedMesh>
    </group>
  );
}
