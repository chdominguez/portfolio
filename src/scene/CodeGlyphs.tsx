import { useMemo, useRef } from 'react';
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

const FONT_PX = 64;
const FONT_UNITS = 0.45;

/** Draws a word once into a white-on-clear texture (tinted by the material), so no font fetch. */
function wordTexture(word: string) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  g.font = `${FONT_PX}px sans-serif`;
  c.width = Math.ceil(g.measureText(word).width) + 8;
  c.height = FONT_PX * 1.4;
  g.font = `${FONT_PX}px sans-serif`;
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(word, c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, pw: (c.width / FONT_PX) * FONT_UNITS, ph: (c.height / FONT_PX) * FONT_UNITS };
}

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
        ...wordTexture(w),
      })),
    []
  );

  useFrame(({ viewport, clock }) => {
    let env = 0;
    for (const id of ANCHORS) env = Math.max(env, Math.sin(Math.PI * clamp(anchor(id)?.p ?? 0)));
    const n = isNarrow() ? 6 : WORDS.length;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      const o = refs.current[i] as THREE.Mesh | null;
      if (!o) continue;
      o.visible = env > 0.02 && i < n;
      if (!o.visible) continue;
      const y = (((clock.elapsedTime * s.speed + s.phase) % 1) - 0.5) * viewport.height * 1.1;
      o.position.set(s.x * (viewport.width / 2), y, -1);
      o.rotation.z = Math.sin(clock.elapsedTime + i) * 0.15;
      ((o as THREE.Mesh).material as THREE.Material).opacity = 0.55 * env;
    }
  });

  return (
    <>
      {seeds.map((s, i) => (
        <mesh key={s.w} ref={(o) => (refs.current[i] = o)} visible={false}>
          <planeGeometry args={[s.pw, s.ph]} />
          <meshBasicMaterial map={s.tex} color={s.color} transparent depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}
