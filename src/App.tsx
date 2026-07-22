import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import { useThemeStore } from '@/store/themeStore';
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

export default function App() {
  useApplyTheme();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading ? <LoadingScreen /> : null}</AnimatePresence>

      <ScrollProgress />
      <Navbar />

      <main id="main-content">
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
