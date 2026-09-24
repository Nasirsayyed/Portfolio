import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '@/hooks/useFinePointer';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { CursorState } from '@/store/uiStore';

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], [role="switch"], label, summary, select';
const TEXT_ENTRY = 'input, textarea, [contenteditable="true"], [contenteditable=""]';

const RING_SIZE: Record<CursorState, number> = { default: 34, link: 60, view: 88, drag: 76, text: 0 };
const LABEL: Partial<Record<CursorState, string>> = { view: 'View', drag: 'Drag' };

/** Reads the cursor state an element asks for via `data-cursor`, or infers it. */
function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';
  if (target.closest(TEXT_ENTRY)) return 'text';
  const explicit = target.closest<HTMLElement>('[data-cursor]')?.dataset.cursor;
  if (explicit === 'view' || explicit === 'drag' || explicit === 'link' || explicit === 'text') return explicit;
  return target.closest(INTERACTIVE) ? 'link' : 'default';
}

/**
 * Dot + lagging ring, blended with `difference` so it reads on any ground.
 * Only for hover-capable fine pointers with motion allowed; touch, reduced
 * motion and Recruiter Mode keep the native cursor. The native cursor is
 * also restored over text inputs (see `html.has-cursor` in index.css).
 */
export function Cursor() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const enabled = finePointer && !reduceMotion;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.2;
      ringPos.y += (target.y - ringPos.y) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      // Sleep once the ring has caught up; the next pointermove wakes it.
      raf = Math.abs(target.x - ringPos.x) + Math.abs(target.y - ringPos.y) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onOver = (e: PointerEvent) => setState(stateFor(e.target));
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = RING_SIZE[state];
  const label = LABEL[state];
  const hidden = !visible || state === 'text';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] mix-blend-difference">
      <div ref={dot} className="absolute left-0 top-0" style={{ willChange: 'transform' }}>
        <div
          className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-200"
          style={{ opacity: hidden || state === 'view' || state === 'drag' ? 0 : 1 }}
        />
      </div>
      <div ref={ring} className="absolute left-0 top-0" style={{ willChange: 'transform' }}>
        <div
          className="flex items-center justify-center rounded-full border border-white/80 transition-[width,height,margin,opacity,background-color] duration-300 ease-signal"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            opacity: hidden ? 0 : 1,
            backgroundColor: label ? 'white' : 'transparent',
          }}
        >
          {label ? <span className="label text-black">{label}</span> : null}
        </div>
      </div>
    </div>
  );
}
