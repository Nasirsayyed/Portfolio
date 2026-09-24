import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, rotateX: -70, y: 30 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 900, transformOrigin: 'center bottom' }}
      className={`mb-12 flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
    >
      <Badge variant="outline" className="bg-card/80">
        {eyebrow}
      </Badge>
      <h2 className="text-3d text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p> : null}
    </motion.div>
  );
}
