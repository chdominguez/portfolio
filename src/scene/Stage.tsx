import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Cluster } from './Cluster';
import { CodeGlyphs } from './CodeGlyphs';
import { clamp, toWorld } from './helpers';
import { benzene, co2, Molecule, water } from './Molecule';
import { Projectile } from './Projectile';
import { Snake } from './Snake';
import { isNarrow } from '../scroll';

function HeroMolecule() {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ viewport, pointer, clock }) => {
    const k = clamp(window.scrollY / (window.innerHeight * 0.9));
    const pos = toWorld(
      window.innerWidth * (isNarrow() ? 0.5 : 0.72),
      window.innerHeight * 0.5,
      viewport
    );
    g.current.visible = k < 1;
    g.current.position.set(pos.x, pos.y + k * 3, 0);
    g.current.rotation.set(
      0.9 + pointer.y * 0.3 + k * 2,
      clock.elapsedTime * 0.25 + pointer.x * 0.4,
      k * 1.5
    );
    g.current.scale.setScalar((isNarrow() ? 0.55 : 0.9) * (1 - k * 0.7));
  });
  return <Molecule ref={g} def={benzene} />;
}

/** Renders on demand: scroll/resize wake it, and it keeps looping only while an actor is visible. */
function Pacer() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const wake = () => invalidate();
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    return () => {
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
    };
  }, [invalidate]);
  // Mounted last, so this runs after every actor has updated its visibility for the frame.
  useFrame(({ scene }) => {
    if (scene.children.some((c) => c.visible && !(c as THREE.Light).isLight)) invalidate();
  });
  return null;
}

/** One fixed, click-through canvas over the whole page; the DOM drives every actor. */
export default function Stage() {
  return (
    <Canvas
      className="stage"
      dpr={[1, isNarrow() ? 1.5 : 1.75]}
      frameloop="demand"
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} />
      <pointLight position={[-6, -3, 4]} intensity={30} color="#a78bfa" />
      <HeroMolecule />
      <Projectile anchorId="uab" def={water} side="right" />
      <Projectile anchorId="ub" def={co2} side="left" />
      <Snake />
      <CodeGlyphs />
      <Cluster />
      <Pacer />
    </Canvas>
  );
}
