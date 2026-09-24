import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { use3DEnabled } from '@/hooks/use3DEnabled';
import { useThemeStore } from '@/store/themeStore';
import { WebGLBoundary } from '@/components/three/WebGLBoundary';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { About } from '@/components/about/About';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';
import { SkillsGrid } from '@/components/skills/SkillsGrid';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { Achievements } from '@/components/achievements/Achievements';
import { Education } from '@/components/education/Education';
import { Contact } from '@/components/contact/Contact';
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer';
import { FloatingSettingsButton } from '@/components/theme/FloatingSettingsButton';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { DevTerminal } from '@/components/terminal/DevTerminal';
import { FloatingTerminalButton } from '@/components/terminal/FloatingTerminalButton';

// three.js + R3F live in a separate chunk so the page shell stays light.
const Scene3D = lazy(() => import('@/components/three/Scene3D'));

export default function App() {
  useApplyTheme();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const enable3D = use3DEnabled();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading ? <LoadingScreen /> : null}</AnimatePresence>

      {enable3D && (
        <WebGLBoundary fallback={null}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </WebGLBoundary>
      )}

      <ScrollProgress />
      <Navbar />

      {/* overflow-x-clip: 3D reveals start rotated, and perspective can push their near
          edge past the viewport before they swing in. clip (unlike hidden) doesn't
          create a scroll container, so scroll anchoring and sticky UI keep working. */}
      <main id="main-content" className="overflow-x-clip">
        <Hero />
        {!recruiterMode && <About />}
        <ExperienceTimeline />
        <SkillsGrid />
        <ProjectsGrid />
        {!recruiterMode && <Achievements />}
        <Education />
        <Contact />
      </main>

      <Footer />

      <BackToTop />
      <FloatingTerminalButton />
      <FloatingSettingsButton />

      <ThemeCustomizer />
      <CommandPalette />
      <DevTerminal />
    </>
  );
}
