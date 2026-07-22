import type { HTMLAttributes, ReactNode } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'solid' | 'outline' | 'soft';
}

const variants = {
  solid: 'bg-gradient-brand text-primary-foreground',
  outline: 'border border-border text-foreground',
  soft: 'bg-secondary text-secondary-foreground',
};

export function Badge({ children, variant = 'soft', className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
