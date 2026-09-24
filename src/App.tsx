import { lazy, Suspense } from 'react';
import { LazyMotion } from 'framer-motion';
import { personalInfo } from '@/data/portfolio';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { Cursor } from '@/components/cursor/Cursor';
import { Atmosphere, FallbackBackdrop } from '@/components/layout/Atmosphere';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { Chapter } from '@/components/ui/Chapter';
import { About } from '@/components/about/About';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';
import { SkillsGrid } from '@/components/skills/SkillsGrid';
import { ProjectsGrid } from '@/components/projects/ProjectsGrid';
import { Achievements } from '@/components/achievements/Achievements';
import { Education } from '@/components/education/Education';
import { Contact } from '@/components/contact/Contact';
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { DevTerminal } from '@/components/terminal/DevTerminal';

// Everything motion-heavy is off the critical path.
const MotionEngine = lazy(() => import('@/motion/MotionEngine'));
const loadMotionFeatures = () => import('@/motion/features').then((mod) => mod.default);

export default function App() {
  useApplyTheme();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  // Reduced motion already folds in Recruiter Mode.
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={loadMotionFeatures}>
      {!recruiterMode && <Atmosphere />}
      <FallbackBackdrop />
      <Cursor />
      {!reduceMotion && (
        <Suspense fallback={null}>
          <MotionEngine />
        </Suspense>
      )}

      <TopBar />
      {!recruiterMode && <ChapterNav />}

      <main id="main-content" className="overflow-x-clip">
        <Chapter id="boot" className="flex min-h-[100svh] items-end pb-20">
          <div className="container">
            <h1 className="font-display text-mega">{personalInfo.name}</h1>
          </div>
        </Chapter>
        <About />
        <Chapter id="stack">
          <SkillsGrid />
        </Chapter>
        <ExperienceTimeline />
        <Chapter id="work">
          <ProjectsGrid />
        </Chapter>
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
