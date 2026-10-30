import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { world } from '../engine/world';
import { C } from './palette';

const LENGTH = 3.2;
const TINT: Record<string, THREE.Color> = {
  DarkGreen: new THREE.Color('#2F6B55'),
  LightGreen: C.accent,
  Red: C.oxygen,
  Teeth: C.text,
  Purple: C.dim,
  Yellow: new THREE.Color('#E6C75A'),
  DarkRed: new THREE.Color('#9C4F43'),
};

/**
 * Python. Rigged low-poly snake by Quaternius (CC0, poly.pizza), recoloured to the page palette.
 * It slithers across the lower part of the screen during the Code chapter.
 */
export function Snake() {
  const gltf = useLoader(GLTFLoader, '/models/snake.glb');
  const root = useRef<THREE.Group>(null!);
  const model = useMemo(() => clone(gltf.scene), [gltf]);

  const mixer = useMemo(() => new THREE.AnimationMixer(model), [model]);
  // the armature is scaled x100 and the mesh is ~0.03 long, so the model is ~3 units as exported
  const fit = LENGTH / 3;

  useEffect(() => {
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const m = (mesh.material as THREE.MeshStandardMaterial).clone();
      m.color = (TINT[m.name] ?? C.muted).clone();
      m.roughness = 0.55;
      m.metalness = 0;
      mesh.material = m;
    });
    const walk = gltf.animations.find((a) => a.name.endsWith('Snake_Walk')) ?? gltf.animations[0];
    if (walk) mixer.clipAction(walk, model).play();
    return () => {
      mixer.stopAllAction();
    };
  }, [gltf, model, mixer]);

  useFrame(({ viewport, clock }, dt) => {
    const t = world.snake;
    const g = root.current;
    g.visible = t > 0.005 && t < 0.995;
    if (!g.visible) return;
    mixer.update(dt * 1.2);
    // enters from the right, leaves on the left, weaving a little on the way
    const x = viewport.width / 2 + LENGTH - t * (viewport.width + LENGTH * 2);
    g.position.set(x, -viewport.height * 0.43, 0.6);
    // the model rears up by design (forward is +Z): turn it so it moves left, in side profile
    g.rotation.set(0, -Math.PI / 2 + Math.sin(clock.elapsedTime * 1.7) * 0.12, 0);
    g.scale.setScalar(fit);
  });

  return (
    <group ref={root} visible={false}>
      <primitive object={model} />
    </group>
  );
}
