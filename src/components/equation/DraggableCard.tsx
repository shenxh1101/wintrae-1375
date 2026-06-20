import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';

interface DraggableCardProps {
  id: string;
  value: number;
  disabled?: boolean;
}

export function DraggableCard({ id, value, disabled = false }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      disabled={disabled}
      className={cn(
        'relative w-14 h-14 rounded-xl flex items-center justify-center',
        'bg-gradient-to-br from-cyan-500 to-blue-600',
        'text-white font-bold text-xl shadow-lg shadow-cyan-500/30',
        'transition-all duration-200 select-none',
        'hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/40',
        'active:scale-95',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        isDragging && 'scale-110 shadow-2xl shadow-cyan-500/50 z-50'
      )}
    >
      {value}
      <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
    </button>
  );
}
