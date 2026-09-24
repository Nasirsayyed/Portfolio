import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Reveal3DProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Which edge the element swings in from. */
  from?: 'bottom' | 'left' | 'right';
}

const hidden = {
  bottom: { opacity: 0, rotateX: 28, y: 50, rotateY: 0 },
  left: { opacity: 0, rotateY: 32, x: -40, rotateX: 0 },
  right: { opacity: 0, rotateY: -32, x: 40, rotateX: 0 },
};

const origins = { bottom: 'center bottom', left: 'left center', right: 'right center' };

/** Swings content into view on a 3D hinge instead of a flat fade. */
export function Reveal3D({ children, className = '', delay = 0, from = 'bottom' }: Reveal3DProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={hidden[from]}
      whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: origins[from] }}
    >
      {children}
    </motion.div>
  );
}
