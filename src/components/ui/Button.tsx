import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap';

const variants = {
  primary:
    'bg-gradient-brand text-primary-foreground shadow-glow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-card text-card-foreground border border-border hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-foreground hover:bg-muted',
  outline: 'border border-border text-foreground hover:bg-muted hover:-translate-y-0.5',
};

const sizes = {
  sm: 'h-9 px-3.5 text-sm rounded-md',
  md: 'h-11 px-5 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
  icon: 'h-10 w-10 rounded-full',
};

interface CommonProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

interface ButtonAsButton extends CommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
}
interface ButtonAsAnchor extends CommonProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  as: 'a';
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (props.as === 'a') {
    const { as: _as, ...anchorProps }: ButtonAsAnchor = props;
    void _as;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonProps }: ButtonAsButton = props;
  void _as;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
