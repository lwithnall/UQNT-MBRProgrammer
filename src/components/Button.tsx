import { type ComponentProps } from 'react';
import { cn } from '../lib/utils';
import type { IconType } from 'react-icons';

export interface ButtonProps extends ComponentProps<'button'> {
  icon?: IconType;
  variant?: 'default' | 'link' | 'disabled';
  size?: 'small' | 'medium' | 'large' | 'icon';
  greyed?: boolean;
  selected?: boolean;
  className?: string;
}

const btnVariantStyling = {
  default: 'bg-primary text-primary-foreground hover:opacity-50',
  link: 'text-primary underline-offset-4 hover:underline',
  disabled: 'bg-primary text-primary-foreground',
};

const btnSizeStyling = {
  small: 'h-8 px-3 py-1.5',
  medium: 'h-10 px-4 py-2',
  large: 'h-12 px-6 py-3',
  icon: 'h-8 w-8',
};

export function Button({
  icon: Icon,
  variant = 'default',
  size = 'small',
  greyed = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const styling = cn(
    'h-8 px-3 py-1.5 relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium rounded-md cursor-pointer overflow-hidden disabled:pointer-events-none disabled:opacity-50',
    greyed ? 'transition-opacity opacity-50 hover:opacity-100' : null,
    btnVariantStyling[variant],
    btnSizeStyling[size],
    className
  );

  return (
    <button className={cn(styling)} {...props}>
      {Icon && <Icon />}
      {children}
    </button>
  );
}
