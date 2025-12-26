'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-neutralGray/10 border border-neutralGray/30',
      glass: 'bg-neutralGray/5 border border-neutralGray/20 backdrop-blur-md',
      solid: 'bg-obsidian border border-neutralGray/30',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-6 transition-all duration-200',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';