import { useRef } from 'react';
import { personalInfo } from '@/data/portfolio';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stats } from '@/components/about/Stats';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function About() {
  const reduceMotion = useReducedMotion();
  const summaryRef = useRef<HTMLParagraphElement>(null);

  // Scroll-scrubbed "read-along": words light up as the paragraph scrolls by.
  useGSAP(
    () => {
      if (reduceMotion || !summaryRef.current) return;
      const split = SplitText.create(summaryRef.current, { type: 'words' });
      gsap.fromTo(
        split.words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: summaryRef.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      );
    },
    { revertOnUpdate: true, dependencies: [reduceMotion] },
  );

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="About Me"
          title="Full-stack delivery, end to end"
          description="A quick look at the experience, specialization, and technical range behind the work below."
        />

        <div className="mx-auto max-w-4xl">
          <p
            ref={summaryRef}
            className="text-center text-lg font-medium leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed"
          >
            {personalInfo.summary}
          </p>

          <div className="mt-16">
            <Stats />
          </div>
        </div>
      </div>
    </section>
  );
}
