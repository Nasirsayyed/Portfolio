import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card text-card-foreground shadow-card ${
        hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-primary/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
