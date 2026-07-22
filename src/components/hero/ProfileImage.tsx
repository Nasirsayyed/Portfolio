import { motion } from 'framer-motion';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';

/**
 * No profile photograph was supplied with the resume, so this renders a
 * gradient initials avatar instead of fabricating a picture. To use a real
 * photo: drop it at `src/assets/images/profile.jpg` and swap the initials
 * block below for `<img src={profilePhoto} alt={personalInfo.name} ... />`.
 */
export function ProfileImage() {
  const reduceMotion = useReducedMotion();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[380px]">
      <motion.div
        className="absolute -inset-6 rounded-full bg-gradient-brand opacity-30 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {!recruiterMode && (
        <>
          <div
            className={`absolute inset-0 rounded-full border border-border/60 ${reduceMotion ? '' : 'animate-spin-slow'}`}
            style={{ borderStyle: 'dashed' }}
            aria-hidden="true"
          />
          <div
            className={`absolute inset-4 rounded-full border border-primary/30 ${reduceMotion ? '' : 'animate-spin-slow-reverse'}`}
            aria-hidden="true"
          />
        </>
      )}

      <motion.div
        className="absolute inset-8 overflow-hidden rounded-full bg-gradient-brand p-[3px] shadow-glow"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
          <span
            className="text-gradient-brand select-none text-6xl font-extrabold tracking-tight sm:text-7xl"
            aria-label={personalInfo.name}
          >
            {personalInfo.initials}
          </span>
        </div>
      </motion.div>

      {!recruiterMode && ['C#', 'React', '.NET'].map((tech, i) => (
        <motion.span
          key={tech}
          className="glass absolute rounded-full border border-border px-3 py-1.5 text-xs font-semibold shadow-card"
          style={
            i === 0
              ? { top: '4%', right: '0%' }
              : i === 1
                ? { bottom: '10%', left: '-4%' }
                : { bottom: '2%', right: '10%' }
          }
          animate={reduceMotion ? undefined : { y: [0, i % 2 === 0 ? -8 : 8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          {tech}
        </motion.span>
      ))}
    </div>
  );
}
