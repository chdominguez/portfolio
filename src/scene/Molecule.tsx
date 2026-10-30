import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import { C } from './palette';

type El = 'H' | 'O';
type V3 = [number, number, number];
export interface MoleculeDef {
  atoms: { el: El; p: V3 }[];
  /** [from, to, order] */
  bonds: [number, number, 1 | 2][];
}

const ATOM: Record<El, { color: THREE.Color; r: number }> = {
  H: { color: C.text, r: 0.26 },
  O: { color: C.oxygen, r: 0.46 },
};

/** Water, 104.5 degree angle, 0.96 angstrom bonds. */
export const water: MoleculeDef = {
  atoms: [
    { el: 'O', p: [0, 0, 0] },
    { el: 'H', p: [0.76, 0.59, 0] },
    { el: 'H', p: [-0.76, 0.59, 0] },
  ],
  bonds: [
    [0, 1, 1],
    [0, 2, 1],
  ],
};

const UP = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);

/** Ball and stick model: coloured spheres sized per element, cylinders for single/double bonds. */
export const BallStick = forwardRef<THREE.Group, { def: MoleculeDef }>(({ def }, ref) => {
  const bonds = useMemo(
    () =>
      def.bonds.flatMap(([i, j, order]) => {
        const a = new THREE.Vector3(...def.atoms[i].p);
        const b = new THREE.Vector3(...def.atoms[j].p);
        const dir = b.clone().sub(a);
        const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const perp = new THREE.Vector3().crossVectors(dir, Z).normalize();
        const offsets = order === 2 ? [-0.1, 0.1] : [0];
        return offsets.map((o) => ({
          pos: mid.clone().addScaledVector(perp, o),
          quat,
          len: dir.length(),
          r: order === 2 ? 0.045 : 0.07,
        }));
      }),
    [def]
  );
  return (
    <group ref={ref}>
      {def.atoms.map((a, i) => (
        <mesh key={i} position={a.p}>
          <sphereGeometry args={[ATOM[a.el].r, 32, 24]} />
          <meshStandardMaterial color={ATOM[a.el].color} roughness={0.4} metalness={0.05} />
        </mesh>
      ))}
      {bonds.map((b, i) => (
        <mesh key={i} position={b.pos} quaternion={b.quat}>
          <cylinderGeometry args={[b.r, b.r, b.len, 12]} />
          <meshStandardMaterial color={C.muted} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
});
