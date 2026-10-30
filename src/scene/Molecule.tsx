import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';

type El = 'O' | 'H' | 'C';
type V3 = [number, number, number];
export interface MoleculeDef {
  atoms: { el: El; p: V3 }[];
  bonds: [number, number][];
}

const ATOM: Record<El, { color: string; r: number }> = {
  O: { color: '#ff6b6b', r: 0.42 },
  H: { color: '#f1f5f9', r: 0.27 },
  C: { color: '#8b9bb4', r: 0.38 },
};

const ring = (n: number, radius: number, el: El, z = 0): MoleculeDef['atoms'] =>
  Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    return { el, p: [Math.cos(a) * radius, Math.sin(a) * radius, z] as V3 };
  });

export const water: MoleculeDef = {
  atoms: [
    { el: 'O', p: [0, 0, 0] },
    { el: 'H', p: [0.78, 0.6, 0] },
    { el: 'H', p: [-0.78, 0.6, 0] },
  ],
  bonds: [
    [0, 1],
    [0, 2],
  ],
};

export const co2: MoleculeDef = {
  atoms: [
    { el: 'C', p: [0, 0, 0] },
    { el: 'O', p: [-1.2, 0, 0] },
    { el: 'O', p: [1.2, 0, 0] },
  ],
  bonds: [
    [0, 1],
    [0, 2],
  ],
};

export const benzene: MoleculeDef = {
  atoms: [...ring(6, 1.4, 'C'), ...ring(6, 2.45, 'H')],
  bonds: [
    ...[0, 1, 2, 3, 4, 5].map((i) => [i, (i + 1) % 6] as [number, number]),
    ...[0, 1, 2, 3, 4, 5].map((i) => [i, i + 6] as [number, number]),
  ],
};

const UP = new THREE.Vector3(0, 1, 0);

export const Molecule = forwardRef<THREE.Group, { def: MoleculeDef; scale?: number }>(
  ({ def, scale = 1 }, ref) => {
    const bonds = useMemo(
      () =>
        def.bonds.map(([i, j]) => {
          const a = new THREE.Vector3(...def.atoms[i].p);
          const b = new THREE.Vector3(...def.atoms[j].p);
          const dir = b.clone().sub(a);
          return {
            pos: a.clone().add(b).multiplyScalar(0.5),
            quat: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
            len: dir.length(),
          };
        }),
      [def]
    );
    return (
      <group ref={ref} scale={scale}>
        {def.atoms.map((a, i) => (
          <mesh key={i} position={a.p}>
            <sphereGeometry args={[ATOM[a.el].r, 32, 32]} />
            <meshStandardMaterial color={ATOM[a.el].color} roughness={0.25} metalness={0.15} />
          </mesh>
        ))}
        {bonds.map((b, i) => (
          <mesh key={i} position={b.pos} quaternion={b.quat}>
            <cylinderGeometry args={[0.08, 0.08, b.len, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </mesh>
        ))}
      </group>
    );
  }
);
