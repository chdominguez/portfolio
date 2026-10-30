import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { anchor } from '../scroll';
import { clamp, lerp, toWorld } from './helpers';
import { Molecule, MoleculeDef } from './Molecule';

const BURST = 28;

/**
 * A molecule that flies in from the empty side of the page and smashes into the edge of the
 * card `anchorId`. Everything is a pure function of scroll progress, so it scrubs both ways.
 */
export function Projectile({
  anchorId,
  def,
  side,
  startP = 0.05,
  hitP = 0.42,
}: {
  anchorId: string;
  def: MoleculeDef;
  side: 'left' | 'right';
  startP?: number;
  hitP?: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const burst = useRef<THREE.InstancedMesh>(null!);
  const hit = useRef(false);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dirs = useMemo(
    () =>
      Array.from({ length: BURST }, () => {
        const a = Math.random() * Math.PI * 2;
        const s = 0.5 + Math.random();
        return { x: Math.cos(a) * s, y: Math.sin(a) * s, z: (Math.random() - 0.5) * s };
      }),
    []
  );

  useFrame(({ viewport }) => {
    const a = anchor(anchorId);
    if (!a) return;
    const dir = side === 'right' ? 1 : -1;
    const edgePx = Math.min(
      window.innerWidth - 8,
      Math.max(8, side === 'right' ? a.rect.right : a.rect.left)
    );
    const target = toWorld(edgePx, a.rect.top + a.rect.height * 0.3, viewport);
    const age = clamp((a.p - hitP) / 0.22);
    const t = clamp((a.p - startP) / (hitP - startP));

    // DOM reacts exactly when the molecule lands.
    const landed = a.p >= hitP && a.p < hitP + 0.3;
    if (landed !== hit.current) {
      hit.current = landed;
      a.el.classList.toggle('hit', landed);
    }

    const g = group.current;
    g.visible = a.p > startP && age < 0.2;
    const e = t * t;
    g.position.set(
      lerp(dir * (viewport.width / 2 + 2), target.x + dir * 0.7, e),
      target.y + (1 - e) * 2.2,
      0.5
    );
    g.rotation.set(a.p * 9, a.p * 13, 0);
    g.scale.setScalar(age > 0 ? Math.max(0, 1 - age * 5) : 1);

    const b = burst.current;
    b.visible = age > 0 && age < 1;
    if (b.visible) {
      dirs.forEach((d, i) => {
        const k = age * 3.2;
        dummy.position.set(
          target.x + dir * 0.7 + d.x * k + dir * k * 0.4,
          target.y + d.y * k,
          d.z * k
        );
        dummy.scale.setScalar((1 - age) * 0.14);
        dummy.updateMatrix();
        b.setMatrixAt(i, dummy.matrix);
      });
      b.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <Molecule ref={group} def={def} scale={0.9} />
      <instancedMesh ref={burst} args={[undefined, undefined, BURST]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#5eead4" />
      </instancedMesh>
    </>
  );
}
