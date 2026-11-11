import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/smoothScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Inertial smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger
 * and the scroll position update on the exact same frame. Also keeps every
 * ScrollTrigger's start/end positions fresh when the page height changes
 * (Recruiter Mode toggles, accordions, skill filters, late-loading images).
 */
export function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      autoRaf: false,
    });
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduceMotion]);

  useEffect(() => {
    let timer = 0;
    let lastHeight = document.body.scrollHeight;
    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
