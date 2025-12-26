'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-neutralGray/10 border border-neutralGray/30 rounded-lg',
          'max-w-2xl w-full max-h-[90vh] overflow-auto',
          'backdrop-blur-md shadow-2xl',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ModalHeader({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-neutralGray/30 p-6">
      <h2 className="text-2xl font-heading font-bold text-white">{children}</h2>
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-neutralGray/30 p-6 flex justify-end gap-3">
      {children}
    </div>
  );
}