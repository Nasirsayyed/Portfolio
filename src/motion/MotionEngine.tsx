import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis } from '@/motion/lenis';
import { useUiStore } from '@/store/uiStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll + scroll-linked animation runtime. Loaded lazily and mounted
 * only when motion is allowed (not reduced motion, not Recruiter Mode), so
 * GSAP, ScrollTrigger and Lenis stay off the critical path.
 *
 * Lenis is advanced from GSAP's ticker rather than its own rAF, and every
 * Lenis scroll event updates ScrollTrigger — so smooth scroll, scrubbed
 * timelines and the WebGL field (which reads window.scrollY in its frame
 * loop) all see the same scroll position on the same frame.
 */
export default function MotionEngine() {
  const setMotionReady = useUiStore((s) => s.setMotionReady);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(lenis);
    setMotionReady(true);
    // Fonts shift line boxes; re-measure pinned sections once they've settled.
    void document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      setMotionReady(false);
      setLenis(null);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [setMotionReady]);

  return null;
}
