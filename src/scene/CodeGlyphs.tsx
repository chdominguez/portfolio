import { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { anchor, isNarrow } from '../scroll';
import { clamp } from './helpers';

const WORDS = [
  '{ }',
  '</>',
  'def',
  'async',
  'tsx',
  '=>',
  'await',
  'py',
  '[ ]',
  'docker',
  'SELECT',
  'import',
  'yield',
  '0x1F',
  'ts',
  'git',
];
const ANCHORS = ['bsc1', 'python', 'nostrum2'];

/** Code glyphs drift up along the page margins while the career moves from chemistry to software. */
export function CodeGlyphs() {
  const refs = useRef<(THREE.Object3D | null)[]>([]);
  const seeds = useMemo(
    () =>
      WORDS.map((w, i) => ({
        w,
        x: (i % 2 ? 1 : -1) * (0.84 + ((i * 37) % 14) / 100),
        phase: i / WORDS.length,
        speed: 0.03 + ((i * 13) % 10) / 400,
        color: i % 3 ? '#5eead4' : '#a78bfa',
      })),
    []
  );

  useFrame(({ viewport, clock }) => {
    const env = Math.max(...ANCHORS.map((id) => Math.sin(Math.PI * clamp(anchor(id)?.p ?? 0))));
    const n = isNarrow() ? 6 : WORDS.length;
    seeds.forEach((s, i) => {
      const o = refs.current[i] as THREE.Mesh | null;
      if (!o) return;
      o.visible = env > 0.02 && i < n;
      if (!o.visible) return;
      const y = (((clock.elapsedTime * s.speed + s.phase) % 1) - 0.5) * viewport.height * 1.1;
      o.position.set(s.x * (viewport.width / 2), y, -1);
      o.rotation.z = Math.sin(clock.elapsedTime + i) * 0.15;
      ((o as THREE.Mesh).material as THREE.Material).opacity = 0.55 * env;
    });
  });

  return (
    <>
      {seeds.map((s, i) => (
        <Text
          key={s.w}
          ref={(o: THREE.Object3D | null) => (refs.current[i] = o)}
          fontSize={0.45}
          color={s.color}
          fillOpacity={1}
          material-transparent
          visible={false}
        >
          {s.w}
        </Text>
      ))}
    </>
  );
}
