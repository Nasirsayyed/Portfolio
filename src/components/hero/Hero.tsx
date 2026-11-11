import { useEffect, useRef } from 'react';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { personalInfo } from '@/data/portfolio';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { Magnetic } from '@/components/motion/Magnetic';
import { HeroBackground } from '@/components/hero/HeroBackground';
import { ProfileImage } from '@/components/hero/ProfileImage';
import { useRotatingText } from '@/hooks/useRotatingText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';

export function Hero() {
  const reduceMotion = useReducedMotion();
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const introComplete = useUiStore((s) => s.introComplete);
  const role = useRotatingText(personalInfo.roles, 2600, reduceMotion || recruiterMode);

  const rootRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);

  const contactSocials = personalInfo.socials.filter((s) => s.icon === 'github' || s.icon === 'linkedin' || s.icon === 'mail');
  const firstName = personalInfo.name.split(' ')[0];

  // Intro timeline — built (and its "from" states applied) immediately, but
  // held paused until the loading curtain has lifted.
  useGSAP(
    () => {
      if (reduceMotion) return;

      const greeting = SplitText.create('[data-hero-greeting]', { type: 'chars', charsClass: 'hero-char' });

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 1.2 } });
      tl.from('[data-hero-badge]', { y: 24, autoAlpha: 0, duration: 0.8 })
        .from(greeting.chars, { yPercent: 120, rotate: 12, stagger: 0.035 }, 0.1)
        .from('[data-hero-name]', { yPercent: 115, skewY: 6 }, 0.3)
        .from('[data-hero-role]', { x: -30, autoAlpha: 0, duration: 0.9 }, 0.55)
        .from('[data-hero-copy]', { y: 30, autoAlpha: 0, filter: 'blur(10px)', duration: 1 }, 0.6)
        .from('[data-hero-cta]', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.9 }, 0.75)
        .from('[data-hero-social]', { y: 20, autoAlpha: 0, scale: 0.6, stagger: 0.07, duration: 0.8, ease: 'back.out(2)' }, 0.9)
        .from('[data-hero-visual]', { scale: 0.75, autoAlpha: 0, rotate: -8, duration: 1.6 }, 0.2)
        .from('[data-hero-chip]', { scale: 0, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: 'back.out(2.5)' }, 1);

      introRef.current = tl;
      // Motion was re-enabled after the intro already ran: show the end state.
      if (useUiStore.getState().introComplete) tl.progress(1);

      // Scroll-out parallax on wrappers that the intro never touches.
      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      scrollTl
        .to('[data-hero-content]', { yPercent: -18, autoAlpha: 0.15, ease: 'none' }, 0)
        .to('[data-hero-visual-wrap]', { yPercent: 22, scale: 0.92, rotate: 4, ease: 'none' }, 0);

      return () => {
        introRef.current = null;
      };
    },
    { scope: rootRef, revertOnUpdate: true, dependencies: [reduceMotion] },
  );

  useEffect(() => {
    if (introComplete) {
      introRef.current?.play();
      ScrollTrigger.refresh();
    }
  }, [introComplete, reduceMotion]);

  // Rolling role text — each new role flips up into place.
  useGSAP(
    () => {
      if (reduceMotion || !roleRef.current) return;
      gsap.fromTo(
        roleRef.current,
        { yPercent: 100, rotateX: -80, autoAlpha: 0 },
        { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out', transformPerspective: 400 },
      );
    },
    { dependencies: [role, reduceMotion] },
  );

  return (
    <section ref={rootRef} id="home" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <HeroBackground />

      <div className="container relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div data-hero-content className="flex flex-col items-start gap-6 text-left">
          <span
            data-hero-badge
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground shadow-card"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {personalInfo.availability}
          </span>

          <h1 className="text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[1] tracking-tight text-foreground">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-greeting className="inline-block">
                Hi, I&apos;m
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-hero-name className="text-gradient-brand inline-block">
                {firstName}
              </span>
            </span>
          </h1>

          <div
            data-hero-role
            className="flex h-9 items-center text-[clamp(1.1rem,2.4vw,1.5rem)] font-semibold text-muted-foreground sm:h-10"
          >
            <Sparkles className="mr-2 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="inline-block overflow-hidden" aria-live="polite">
              <span ref={roleRef} key={role} className="inline-block">
                {role}
              </span>
            </span>
          </div>

          <p data-hero-copy className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {personalInfo.valueProposition}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div data-hero-cta>
              <Magnetic className="w-full sm:w-auto">
                <Button as="a" href="#projects" variant="primary" size="lg" className="w-full sm:w-auto">
                  View My Work
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Magnetic>
            </div>
            <div data-hero-cta>
              <Magnetic className="w-full sm:w-auto">
                <Button as="a" href={personalInfo.resumeUrl} download variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Resume
                </Button>
              </Magnetic>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {contactSocials.map((social) => (
              <div key={social.label} data-hero-social>
                <Magnetic strength={0.5}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('http') ? '_blank' : undefined}
                    rel={social.url.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary focus-ring"
                  >
                    <SocialIcon icon={social.icon} className="h-[18px] w-[18px]" />
                  </a>
                </Magnetic>
              </div>
            ))}
          </div>
        </div>

        <div data-hero-visual-wrap>
          <div data-hero-visual>
            <ProfileImage />
          </div>
        </div>
      </div>

      {!reduceMotion && (
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground lg:flex"
          aria-hidden="true"
        >
          <span>Scroll</span>
          <span className="scroll-cue relative h-10 w-px overflow-hidden bg-border" />
        </div>
      )}
    </section>
  );
}
