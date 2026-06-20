import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface CoefficientSlotProps {
  id: string;
  value: number;
  onRemove: () => void;
  index: number;
  disabled?: boolean;
}

export function CoefficientSlot({ id, value, onRemove, index, disabled = false }: CoefficientSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200',
        'border-2 border-dashed',
        value === 0
          ? isOver
            ? 'border-cyan-400 bg-cyan-400/20 scale-110'
            : 'border-white/20 bg-white/5 hover:border-white/40'
          : 'border-transparent',
        disabled && 'opacity-50'
      )}
    >
      {value > 0 ? (
        <>
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-white font-bold text-xl">{value}</span>
          </div>
          <button
            onClick={onRemove}
            disabled={disabled}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity shadow-lg"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <span className="text-white/30 text-xs">系数{index + 1}</span>
      )}
      {isOver && value === 0 && (
        <div className="absolute inset-0 rounded-xl bg-cyan-400/30 animate-pulse" />
      )}
    </div>
  );
}
