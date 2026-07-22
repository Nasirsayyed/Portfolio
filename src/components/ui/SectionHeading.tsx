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
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`mb-12 flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
    >
      <Badge variant="outline">{eyebrow}</Badge>
      <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className={`text-muted-foreground text-base sm:text-lg ${align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}`}>
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
