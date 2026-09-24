import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Color, Vector2 } from 'three';

/**
 * Desktop-only, dark-only finish: a soft bloom on the accent particles and a
 * hair of chromatic aberration at the edges. The composer renders opaque, so
 * the scene takes the page background while it's mounted.
 */
export default function SignalPost({ background }: { background: string }) {
  const scene = useThree((s) => s.scene);
  const offset = useMemo(() => new Vector2(0.0006, 0.0004), []);

  useEffect(() => {
    scene.background = new Color(background);
    return () => {
      scene.background = null;
    };
  }, [scene, background]);

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.35} mipmapBlur radius={0.7} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={offset}
        radialModulation
        modulationOffset={0.35}
      />
    </EffectComposer>
  );
}
