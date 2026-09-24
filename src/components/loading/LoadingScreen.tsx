import { motion } from 'framer-motion';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FACES = [
  'rotateY(0deg)',
  'rotateY(90deg)',
  'rotateY(180deg)',
  'rotateY(-90deg)',
  'rotateX(90deg)',
  'rotateX(-90deg)',
];

export function LoadingScreen() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
      role="status"
      aria-label="Loading portfolio"
    >
      <div style={{ perspective: 500 }} aria-hidden="true">
        <div
          className={`preserve-3d relative h-14 w-14 [transform:rotateX(-24deg)_rotateY(35deg)] ${
            reduceMotion ? '' : 'animate-spin-cube'
          }`}
        >
          {FACES.map((face) => (
            <div
              key={face}
              className="absolute inset-0 rounded-md border-2 border-primary/70 bg-primary/10"
              style={{ transform: `${face} translateZ(28px)` }}
            />
          ))}
        </div>
      </div>
      <div className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">
        <span className="text-muted-foreground">&lt;</span>
        <span className="text-gradient-brand">{personalInfo.initials}</span>
        <span className="text-muted-foreground"> /&gt;</span>
      </div>
    </motion.div>
  );
}
