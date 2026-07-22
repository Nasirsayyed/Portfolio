import { motion } from 'framer-motion';
import { personalInfo } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LoadingScreen() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">
        <span className="text-muted-foreground">&lt;</span>
        <span className="text-gradient-brand">{personalInfo.initials}</span>
        <span className="text-muted-foreground"> /&gt;</span>
        <span className="ml-1 inline-block w-2 animate-pulse text-primary">|</span>
      </div>
    </motion.div>
  );
}
