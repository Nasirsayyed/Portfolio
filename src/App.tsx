import { lazy, Suspense } from 'react';
import { LazyMotion } from 'framer-motion';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { use3DEnabled } from '@/hooks/use3DEnabled';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { Cursor } from '@/components/cursor/Cursor';
import { Atmosphere, FallbackBackdrop } from '@/components/layout/Atmosphere';
import { WebGLBoundary } from '@/components/three/WebGLBoundary';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { Chapter } from '@/components/ui/Chapter';
import { Boot } from '@/components/boot/Boot';
import { Preloader } from '@/components/boot/Preloader';
import { About } from '@/components/about/About';
import { Experience } from '@/components/experience/Experience';
import { Stack } from '@/components/stack/Stack';
import { Work } from '@/components/work/Work';
import { Achievements } from '@/components/achievements/Achievements';
import { Education } from '@/components/education/Education';
import { Contact } from '@/components/contact/Contact';
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
  // Reduced motion already folds in Recruiter Mode.
  const reduceMotion = useReducedMotion();
  const webgl = use3DEnabled();

  return (
    <LazyMotion features={loadMotionFeatures}>
      {!recruiterMode && <Atmosphere />}
      {webgl ? (
        <WebGLBoundary fallback={<FallbackBackdrop />}>
          <Suspense fallback={<FallbackBackdrop />}>
            <SignalField />
          </Suspense>
        </WebGLBoundary>
      ) : (
        !recruiterMode && <FallbackBackdrop />
      )}
      <Cursor />
      <Preloader />
      {!reduceMotion && (
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
        <Chapter id="proof">
          <Achievements />
          <Education />
        </Chapter>
        <Chapter id="connect">
          <Contact />
        </Chapter>
      </main>

      <Footer />

      <ThemeCustomizer />
      <CommandPalette />
      <DevTerminal />
    </LazyMotion>
  );
}
