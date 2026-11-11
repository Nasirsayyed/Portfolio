import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      },
    );
  });

  return (
    <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent" aria-hidden="true">
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-brand" />
    </div>
  );
}
