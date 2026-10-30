import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp, world } from '../engine/world';
import { BallStick, water } from './Molecule';
import { C } from './palette';
import { toWorld } from './space';

const SHARDS = 28;

/** A water molecule leaves the benzene, hits the "Molecules" title and shatters into shards. */
export function Fragment({ origin }: { origin: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null!);
  const shards = useRef<THREE.InstancedMesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const dirs = useMemo(
    () =>
      Array.from({ length: SHARDS }, (_, i) => {
        const a = (i / SHARDS) * Math.PI * 2 + Math.sin(i * 7.1);
        const s = 0.6 + ((i * 37) % 10) / 10;
        return {
          x: Math.cos(a) * s,
          y: Math.sin(a) * s,
          z: Math.sin(i * 3.7) * s * 0.5,
          r: i * 1.3,
        };
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
    g.rotation.set(t * 10, t * 14, t * 6);
    g.scale.setScalar(0.9);

    const age = clamp((t - 0.7) / 0.3);
    shards.current.visible = age > 0 && age < 1;
    if (!shards.current.visible) return;
    dirs.forEach((d, i) => {
      const k = age * 3.4;
      o.position.set(tgt.x + d.x * k, tgt.y + d.y * k, d.z * k);
      o.rotation.set(d.r + age * 6, d.r * 0.7 + age * 4, 0);
      o.scale.setScalar((1 - age) * 0.16);
      o.updateMatrix();
      shards.current.setMatrixAt(i, o.matrix);
    });
    shards.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={group} visible={false}>
        <BallStick def={water} />
      </group>
      <instancedMesh
        ref={shards}
        args={[undefined, undefined, SHARDS]}
        frustumCulled={false}
        visible={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={C.accent} />
      </instancedMesh>
    </>
  );
}
