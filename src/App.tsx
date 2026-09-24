import { lazy, Suspense, useEffect } from 'react';
import { LazyMotion } from 'framer-motion';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { use3DEnabled } from '@/hooks/use3DEnabled';
import { useIdleReady } from '@/hooks/useIdleReady';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';
import { Cursor } from '@/components/cursor/Cursor';
import { Atmosphere, FallbackBackdrop } from '@/components/layout/Atmosphere';
import { WebGLBoundary } from '@/components/three/WebGLBoundary';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { Boot } from '@/components/boot/Boot';
import { Preloader } from '@/components/boot/Preloader';
import { About } from '@/components/about/About';
import { Experience } from '@/components/experience/Experience';
import { Stack } from '@/components/stack/Stack';
import { Work } from '@/components/work/Work';
import { Proof } from '@/components/proof/Proof';
import { Connect } from '@/components/connect/Connect';
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { DevTerminal } from '@/components/terminal/DevTerminal';

// Everything motion-heavy is off the critical path.
const MotionEngine = lazy(() => import('@/motion/MotionEngine'));
const SignalField = lazy(() => import('@/components/signal/SignalField'));
const loadMotionFeatures = () => import('@/motion/features').then((mod) => mod.default);

export default function App() {
  useApplyTheme();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);

  // Lets CSS treat Recruiter Mode as reduced motion (see index.css); index.html sets it before first paint too.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-recruiter', recruiterMode);
  }, [recruiterMode]);
  // Reduced motion already folds in Recruiter Mode.
  const reduceMotion = useReducedMotion();
  const webgl = use3DEnabled();
  // The field and smooth scrolling mount only after the intro hands over and the browser is idle,
  // so neither competes with fonts or the first paint.
  const booted = useUiStore((s) => s.booted);
  const idle = useIdleReady();
  const deferredReady = booted && idle;

  return (
    // strict: only the tree-shakable `m` components may be used, keeping full framer-motion out of the entry.
    <LazyMotion features={loadMotionFeatures} strict>
      {!recruiterMode && <Atmosphere />}
      {webgl ? (
        deferredReady && (
          <WebGLBoundary fallback={<FallbackBackdrop />}>
            <Suspense fallback={null}>
              <SignalField />
            </Suspense>
          </WebGLBoundary>
        )
      ) : (
        !recruiterMode && <FallbackBackdrop />
      )}
      <Cursor />
      <Preloader />
      {!reduceMotion && deferredReady && (
        <Suspense fallback={null}>
          <MotionEngine />
        </Suspense>
      )}

      <TopBar />
      {!recruiterMode && <ChapterNav />}

      <main id="main-content" className="overflow-x-clip">
        <Boot />
        <About />
        <Stack />
        <Experience />
        <Work />
        <Proof />
        <Connect />
      </main>

      <Footer />

      <ThemeCustomizer />
      <CommandPalette />
      <DevTerminal />
    </LazyMotion>
  );
}
