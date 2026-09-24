import { useRef, type PointerEvent, type ReactNode } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the pointer's offset from centre the element follows. */
  strength?: number;
  className?: string;
}

const spring = { stiffness: 260, damping: 18, mass: 0.5 };

/**
 * Pulls its child slightly toward the pointer while hovered and springs back
 * on leave. Inert on touch, under reduced motion and in Recruiter Mode.
 */
export function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={enabled ? { x, y } : undefined}
      className={`inline-flex ${className}`}
    >
      {children}
    </m.span>
  );
}
