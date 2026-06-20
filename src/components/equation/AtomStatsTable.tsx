import type { BalanceDetail } from '../../types';
import { cn } from '../../lib/utils';
import { Check, X } from 'lucide-react';

interface AtomStatsTableProps {
  details: BalanceDetail[];
  showLabels?: boolean;
}

export function AtomStatsTable({ details, showLabels = true }: AtomStatsTableProps) {
  const maxCount = Math.max(...details.map(d => Math.max(d.leftCount, d.rightCount)), 1);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="grid grid-cols-4 gap-2 mb-3 text-xs text-white/50">
          <div>元素</div>
          <div className="text-center">反应物</div>
          <div className="text-center">生成物</div>
          <div className="text-center">状态</div>
        </div>
      )}
      <div className="space-y-2">
        {details.map((detail) => {
          const leftPercent = (detail.leftCount / maxCount) * 100;
          const rightPercent = (detail.rightCount / maxCount) * 100;
          const isBalanced = detail.balanced;

          return (
            <div key={detail.element} className="grid grid-cols-4 gap-2 items-center">
              <div className={cn(
                'font-bold text-lg',
                isBalanced ? 'text-green-400' : 'text-white'
              )}>
                {detail.element}
              </div>
              <div className="relative">
                <div className="h-8 rounded-lg bg-white/10 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      isBalanced ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                    )}
                    style={{ width: `${leftPercent}%` }}
                  />
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {detail.leftCount}
                </span>
              </div>
              <div className="relative">
                <div className="h-8 rounded-lg bg-white/10 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500',
                      isBalanced ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-red-500'
                    )}
                    style={{ width: `${rightPercent}%` }}
                  />
                </div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {detail.rightCount}
                </span>
              </div>
              <div className="flex justify-center">
                {isBalanced ? (
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 animate-bounce-slow">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <X className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
