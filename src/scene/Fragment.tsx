import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, world } from '../engine/world';
import { C } from './palette';
import { toWorld } from './space';

const BURST = 26;

/** A water-like fragment leaves the molecule, hits the "Molecules" title and bursts. */
export function Fragment({ origin }: { origin: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null!);
  const burst = useRef<THREE.InstancedMesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const dirs = useMemo(
    () =>
      Array.from({ length: BURST }, (_, i) => {
        const a = (i / BURST) * Math.PI * 2 + Math.sin(i * 7.1);
        const s = 0.6 + ((i * 37) % 10) / 10;
        return { x: Math.cos(a) * s, y: Math.sin(a) * s, z: Math.sin(i * 3.7) * s * 0.5 };
      }),
    []
  );

  useFrame(({ viewport }) => {
    const t = world.impact;
    const tgt = toWorld(world.target.x, world.target.y, viewport);
    const fly = clamp(t / 0.7);
    const u = fly * fly;
    const g = group.current;
    g.visible = t > 0.01 && t < 0.7;
    g.position.set(
      origin.x + (tgt.x - origin.x) * u,
      origin.y + (tgt.y - origin.y) * u + Math.sin(Math.PI * fly) * 1.4,
      0.8
    );
    g.rotation.set(t * 18, t * 24, 0);

    const age = clamp((t - 0.7) / 0.3);
    burst.current.visible = age > 0 && age < 1;
    if (!burst.current.visible) return;
    dirs.forEach((d, i) => {
      const k = age * 3.2;
      o.position.set(tgt.x + d.x * k, tgt.y + d.y * k, d.z * k);
      o.scale.setScalar((1 - age) * 0.1);
      o.updateMatrix();
      burst.current.setMatrixAt(i, o.matrix);
    });
    burst.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={group} visible={false}>
        <mesh>
          <sphereGeometry args={[0.34, 20, 20]} />
          <meshStandardMaterial color={C.oxygen} roughness={0.45} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.5, 0.38, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={C.text} roughness={0.45} />
          </mesh>
        ))}
      </group>
      <instancedMesh
        ref={burst}
        args={[undefined, undefined, BURST]}
        frustumCulled={false}
        visible={false}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={C.accent} />
      </instancedMesh>
    </>
  );
}
