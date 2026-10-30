import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { atomAt, EDGES, N } from '../engine/layouts';
import { clamp, world } from '../engine/world';
import { C } from './palette';
import { smooth, stage } from './space';

const ELEMENTS = [C.carbon, C.carbon, C.nitrogen, C.oxygen];

/** The figure: 48 atoms and their bonds, morphing molecule -> call graph -> compute cluster. */
export function Particles({ origin }: { origin: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null!);
  const atoms = useRef<THREE.InstancedMesh>(null!);
  const bonds = useRef<THREE.LineSegments>(null!);
  const spin = useRef(0);
  const o = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const p = useMemo<[number, number, number]>(() => [0, 0, 0], []);
  const pos = useMemo(() => new Float32Array(N * 3), []);
  const edgePos = useMemo(() => new Float32Array(EDGES.length * 6), []);

  useFrame(({ viewport, pointer }, dt) => {
    const m = world.morph;
    const t1 = smooth(clamp(m));
    const t2 = smooth(clamp(m - 1));
    const s = stage(viewport);
    const reveal = 1 - Math.pow(1 - world.reveal, 3);

    spin.current += dt * 0.25 + world.velocity * dt * 0.4;
    const g = group.current;
    g.position.set(s.x, s.y, 0);
    // the lattice shrinks as it morphs so it stays clear of the text column
    g.scale.setScalar(s.scale * reveal * (1 - t1 * 0.38));
    g.rotation.set(0.18 * (1 - t1) - 0.5 * t2, spin.current * (1 - t1) + pointer.x * 0.2, 0);
    origin.copy(g.position);

    for (let i = 0; i < N; i++) {
      atomAt(i, m, p);
      pos.set(p, i * 3);
      o.position.set(p[0], p[1], p[2]);
      const lit = clamp(world.lit * N - i);
      o.scale.setScalar(1 + t2 * 0.2 + lit * 0.25 * t2);
      o.updateMatrix();
      atoms.current.setMatrixAt(i, o.matrix);
      col
        .copy(ELEMENTS[i % 4])
        .lerp(C.muted, t1)
        .lerp(C.dim, t2)
        .lerp(C.accent, lit * t2);
      atoms.current.setColorAt(i, col);
    }
    atoms.current.instanceMatrix.needsUpdate = true;
    if (atoms.current.instanceColor) atoms.current.instanceColor.needsUpdate = true;

    EDGES.forEach(([a, b], e) => {
      edgePos.set(pos.subarray(a * 3, a * 3 + 3), e * 6);
      edgePos.set(pos.subarray(b * 3, b * 3 + 3), e * 6 + 3);
    });
    const attr = bonds.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.needsUpdate = true;
    (bonds.current.material as THREE.LineBasicMaterial).color
      .copy(C.muted)
      .lerp(C.accent, world.lit * t2);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={atoms} args={[undefined, undefined, N]} frustumCulled={false}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial roughness={0.45} metalness={0.05} />
      </instancedMesh>
      <lineSegments ref={bonds} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={edgePos}
            count={edgePos.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial transparent opacity={0.45} />
      </lineSegments>
    </group>
  );
}
