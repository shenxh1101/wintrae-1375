import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          'absolute inset-0 bg-black/70 backdrop-blur-sm',
          'animate-fade-in'
        )}
        onClick={() => closeOnBackdrop && onClose()}
      />
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl',
          'bg-gradient-to-br from-slate-800/95 to-slate-900/95',
          'border border-white/10 shadow-2xl',
          'animate-scale-in',
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            {title && (
              <h2 className="text-xl font-bold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 h-auto"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10',
      className
    )}>
      {children}
    </div>
  );
}
