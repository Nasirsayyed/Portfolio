import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { HeroBackground } from '@/components/hero/HeroBackground';
import { ProfileImage } from '@/components/hero/ProfileImage';
import { WebGLBoundary } from '@/components/three/WebGLBoundary';
import { use3DEnabled } from '@/hooks/use3DEnabled';
import { useRotatingText } from '@/hooks/useRotatingText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';

const HeroMedallion = lazy(() => import('@/components/three/HeroMedallion'));

const flipIn = {
  hidden: { opacity: 0, rotateX: -90, y: 24 },
  show: { opacity: 1, rotateX: 0, y: 0 },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const enable3D = use3DEnabled();
  const role = useRotatingText(personalInfo.roles, 2600, reduceMotion || recruiterMode);
  const firstName = personalInfo.name.split(' ')[0];

  const contactSocials = personalInfo.socials.filter((s) => s.icon === 'github' || s.icon === 'linkedin' || s.icon === 'mail');

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      {!enable3D && <HeroBackground />}

      <div className="container relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div
          initial={reduceMotion ? undefined : 'hidden'}
          animate={reduceMotion ? undefined : 'show'}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
          className="flex flex-col items-start gap-6 text-left [perspective:900px]"
        >
          <motion.span
            variants={flipIn}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex origin-bottom items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground shadow-card"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {personalInfo.availability}
          </motion.span>

          <h1 className="text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-foreground [perspective:900px]">
            {['Hi,', 'I’m'].map((word) => (
              <motion.span
                key={word}
                variants={flipIn}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mr-[0.25em] inline-block origin-bottom"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              variants={flipIn}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient-brand text-3d-glow inline-block origin-bottom"
            >
              {firstName}
            </motion.span>
          </h1>

          <motion.div
            variants={flipIn}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-9 origin-bottom items-center text-[clamp(1.1rem,2.4vw,1.5rem)] font-semibold text-muted-foreground sm:h-10"
          >
            <Sparkles className="mr-2 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            {/* Old and new titles share one grid cell and turn together on a common
                axis set back from the text, so it rolls like a cube and is never blank. */}
            <span className="inline-grid [perspective:500px]">
              <AnimatePresence initial={false}>
                <motion.span
                  key={role}
                  className="backface-hidden whitespace-nowrap [grid-area:1/1]"
                  style={{ originZ: -18 }}
                  initial={reduceMotion ? undefined : { rotateX: -90, opacity: 0 }}
                  animate={reduceMotion ? undefined : { rotateX: 0, opacity: 1 }}
                  exit={reduceMotion ? undefined : { rotateX: 90, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                >
                  {role}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.p
            variants={flipIn}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl origin-bottom text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {personalInfo.valueProposition}
          </motion.p>

          <motion.div
            variants={flipIn}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex origin-bottom flex-col gap-3 sm:flex-row"
          >
            <Button as="a" href="#projects" variant="primary" size="lg">
              View My Work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button as="a" href={personalInfo.resumeUrl} download variant="secondary" size="lg">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </Button>
          </motion.div>

          <motion.div
            variants={flipIn}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex origin-bottom items-center gap-3 pt-2"
          >
            {contactSocials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary focus-ring"
              >
                <SocialIcon icon={social.icon} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8, rotateY: -35 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ transformPerspective: 1000 }}
        >
          {enable3D ? (
            <WebGLBoundary fallback={<ProfileImage />}>
              <Suspense fallback={<ProfileImage />}>
                <HeroMedallion />
              </Suspense>
            </WebGLBoundary>
          ) : (
            <ProfileImage />
          )}
        </motion.div>
      </div>
    </section>
  );
}
