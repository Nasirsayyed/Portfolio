import { useEffect, useMemo, useRef, type PointerEvent } from 'react';
import type { Skill, SkillCategory } from '@/types';
import { skillCategoryIcons } from '@/data/skillCategoryIcons';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SkillSphereProps {
  skills: Skill[];
  active: SkillCategory | 'All';
}

interface Point {
  x: number;
  y: number;
  z: number;
}

/** Evenly distributes n points over a unit sphere. */
function fibonacciSphere(n: number): Point[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
}

const AUTO_SPIN = 0.22; // radians per second
const DRAG_SENSITIVITY = 0.006;

/**
 * Skills as billboarded chips on a rotating sphere. Positions are projected
 * in JS and written straight to each chip's style inside a rAF loop, so the
 * sphere animates without re-rendering React. Drag to spin (with inertia);
 * chips outside the selected category recede.
 */
export function SkillSphere({ skills, active }: SkillSphereProps) {
  const container = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLDivElement | null)[]>([]);
  const points = useMemo(() => fibonacciSphere(skills.length), [skills.length]);
  const reduceMotion = useReducedMotion();
  const activeRef = useRef(active);
  activeRef.current = active;
  const renderRef = useRef<() => void>(() => undefined);

  const motion = useRef({
    rotX: -0.35,
    rotY: 0.6,
    vx: 0,
    vy: 0,
    dragging: false,
    hovered: false,
    lastX: 0,
    lastY: 0,
    radius: 180,
  });

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const m = motion.current;

    const render = () => {
      const cosX = Math.cos(m.rotX);
      const sinX = Math.sin(m.rotX);
      const cosY = Math.cos(m.rotY);
      const sinY = Math.sin(m.rotY);
      const r = m.radius;
      const perspective = r * 4;
      const filtering = activeRef.current !== 'All';

      points.forEach((p, i) => {
        const tag = tags.current[i];
        const skill = skills[i];
        if (!tag || !skill) return;
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;
        const projection = perspective / (perspective - z2 * r);
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        const match = !filtering || skill.category === activeRef.current;
        // Chip size falls off faster than position so far chips shrink out of the way of near ones.
        const size = (0.5 + depth * 0.62) * (match ? 1 : 0.8);

        tag.style.transform = `translate3d(${x2 * r * projection}px, ${-y1 * r * projection}px, 0) translate(-50%, -50%) scale(${size})`;
        tag.style.opacity = String((0.2 + depth * 0.8) * (match ? 1 : 0.16));
        tag.style.zIndex = String(Math.round(depth * 100) + (match ? 100 : 0));
        tag.style.filter = depth < 0.3 ? 'blur(1.2px)' : 'none';
        tag.dataset.match = String(match && filtering);
      });
    };
    renderRef.current = render;

    const resize = new ResizeObserver(([entry]) => {
      if (!entry) return;
      m.radius = Math.min(entry.contentRect.width, entry.contentRect.height) * 0.41;
      render();
    });
    resize.observe(el);

    if (reduceMotion) {
      render();
      return () => resize.disconnect();
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!m.dragging) {
        m.rotY += AUTO_SPIN * dt * (m.hovered ? 0.25 : 1) + m.vy;
        m.rotX += m.vx;
        m.vx *= 0.93;
        m.vy *= 0.93;
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    // Only spin while on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!entry?.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    visibility.observe(el);

    return () => {
      resize.disconnect();
      visibility.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [points, skills, reduceMotion]);

  // Reduced motion has no loop, so a filter change needs an explicit redraw.
  useEffect(() => {
    renderRef.current();
  }, [active]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    m.dragging = true;
    m.lastX = e.clientX;
    m.lastY = e.clientY;
    m.vx = 0;
    m.vy = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    const dx = (e.clientX - m.lastX) * DRAG_SENSITIVITY;
    const dy = (e.clientY - m.lastY) * DRAG_SENSITIVITY;
    m.lastX = e.clientX;
    m.lastY = e.clientY;
    m.rotY += dx;
    m.rotX += dy;
    m.vy = reduceMotion ? 0 : dx;
    m.vx = reduceMotion ? 0 : dy;
    if (reduceMotion) renderRef.current();
  };

  const endDrag = () => {
    motion.current.dragging = false;
  };

  return (
    <div
      ref={container}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => (motion.current.hovered = true)}
      onPointerLeave={() => (motion.current.hovered = false)}
      className="group relative mx-auto aspect-square w-full max-w-[720px] cursor-grab [perspective:900px] touch-pan-y select-none active:cursor-grabbing"
      data-filtered={active !== 'All'}
      aria-hidden="true"
    >
      {/* Core glow + silhouette give the cloud a sense of volume */}
      <div className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-brand opacity-30 blur-3xl" />
      <div className="absolute inset-[9%] rounded-full border border-dashed border-border/80" />
      <div className="absolute inset-[9%] rounded-full border border-border/60 [transform:rotateX(72deg)]" />

      {skills.map((skill, i) => {
        const Icon = skillCategoryIcons[skill.category];
        return (
          <div
            key={skill.name}
            ref={(node) => {
              tags.current[i] = node;
            }}
            className="absolute left-1/2 top-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-card transition-[background-color,border-color,color] duration-300 [will-change:transform,opacity] data-[match=true]:border-transparent data-[match=true]:bg-gradient-brand data-[match=true]:text-primary-foreground data-[match=true]:shadow-glow sm:text-[13px]"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
            {skill.name}
          </div>
        );
      })}
    </div>
  );
}
