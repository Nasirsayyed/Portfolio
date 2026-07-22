import { motion } from 'framer-motion';
import { personalInfo } from '@/data/portfolio';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stats } from '@/components/about/Stats';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="About Me"
          title="Full-stack delivery, end to end"
          description="A quick look at the experience, specialization, and technical range behind the work below."
        />

        <div className="mx-auto max-w-3xl">
          <motion.p
            initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {personalInfo.summary}
          </motion.p>

          <div className="mt-14">
            <Stats />
          </div>
        </div>
      </div>
    </section>
  );
}
