import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'cyan' | 'green' | 'orange' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorClasses = {
  cyan: 'from-cyan-400 to-blue-500',
  green: 'from-green-400 to-emerald-500',
  orange: 'from-orange-400 to-amber-500',
  red: 'from-red-400 to-rose-500',
  yellow: 'from-yellow-400 to-amber-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-3',
  lg: 'h-5',
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = 'cyan',
  size = 'md',
  animated = true,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-1.5 text-xs text-white/70">
          <span>{value} / {max}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        'w-full rounded-full bg-white/10 overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            colorClasses[color],
            animated && 'transition-all duration-500 ease-out',
            animated && percentage > 0 && 'animate-pulse-slow'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
