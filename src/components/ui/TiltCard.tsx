import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TiltCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: ReactNode;
  /** Max rotation in degrees at the card's edge. */
  maxTilt?: number;
  /** How far toward the viewer the card lifts while hovered (px). */
  lift?: number;
  glare?: boolean;
}

const spring = { stiffness: 220, damping: 22, mass: 0.6 };
const REST_PERSPECTIVE = 6000;
const HOVER_PERSPECTIVE = 900;

/**
 * A card that rotates in 3D toward the pointer. It preserves 3D for its
 * children, so descendants can use the `.depth-*` utilities to sit at
 * different Z depths and parallax against the card face. Tilt is disabled
 * for touch, reduced motion and Recruiter Mode — the card renders flat.
 */
export function TiltCard({ children, className = '', maxTilt = 9, lift = 18, glare = true, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;

  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const z = useSpring(useMotionValue(0), spring);
  // Near-orthographic at rest keeps depth layers aligned with the card face;
  // pulling perspective in on hover is what makes them separate.
  const perspective = useSpring(useMotionValue(REST_PERSPECTIVE), spring);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(useMotionValue(0), spring);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), transparent 55%)`;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * maxTilt);
    rotateX.set(-(py - 0.5) * 2 * maxTilt);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const onPointerEnter = () => {
    if (!enabled) return;
    z.set(lift);
    perspective.set(HOVER_PERSPECTIVE);
    glareOpacity.set(1);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    z.set(0);
    perspective.set(REST_PERSPECTIVE);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={enabled ? { rotateX, rotateY, z, transformPerspective: perspective, transformStyle: 'preserve-3d' } : undefined}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      {glare && enabled ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBackground, opacity: glareOpacity }}
        />
      ) : null}
    </motion.div>
  );
}
