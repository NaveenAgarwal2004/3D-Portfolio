'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'w-full px-4 py-3 bg-neutralGray/10 border border-neutralGray/30 rounded-lg',
          'text-white placeholder:text-neutralGray',
          'focus:outline-none focus:border-ionizedBlue focus:ring-1 focus:ring-ionizedBlue',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';