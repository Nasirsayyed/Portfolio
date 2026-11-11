import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

/**
 * Single registration point for GSAP and its plugins. Import everything
 * motion-related from here so plugins are always registered before use.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
