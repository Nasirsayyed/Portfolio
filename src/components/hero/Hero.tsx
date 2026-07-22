import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { HeroBackground } from '@/components/hero/HeroBackground';
import { ProfileImage } from '@/components/hero/ProfileImage';
import { useRotatingText } from '@/hooks/useRotatingText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';

export function Hero() {
  const reduceMotion = useReducedMotion();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const role = useRotatingText(personalInfo.roles, 2600, reduceMotion || recruiterMode);

  const contactSocials = personalInfo.socials.filter((s) => s.icon === 'github' || s.icon === 'linkedin' || s.icon === 'mail');

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <HeroBackground />

      <div className="container relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-start gap-6 text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground shadow-card">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {personalInfo.availability}
          </span>

          <h1 className="text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-foreground">
            Hi, I&apos;m <span className="text-gradient-brand">{personalInfo.name.split(' ')[0]}</span>
          </h1>

          <div className="flex h-9 items-center text-[clamp(1.1rem,2.4vw,1.5rem)] font-semibold text-muted-foreground sm:h-10">
            <Sparkles className="mr-2 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.span
                key={role}
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {role}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {personalInfo.valueProposition}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as="a" href="#projects" variant="primary" size="lg">
              View My Work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button as="a" href={personalInfo.resumeUrl} download variant="secondary" size="lg">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
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
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <ProfileImage />
        </motion.div>
      </div>
    </section>
  );
}
