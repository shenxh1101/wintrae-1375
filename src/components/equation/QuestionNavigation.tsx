import { CheckCircle2, XCircle, HelpCircle, BookOpen, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import type { QuestionResult, Equation } from '../../types';
import { getReactionTypeName } from '../../utils/equationParser';

interface QuestionNavigationProps {
  equations: Equation[];
  currentIndex: number;
  questionResults: QuestionResult[];
  masteredEquations: string[];
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function QuestionNavigation({
  equations,
  currentIndex,
  questionResults,
  masteredEquations,
  onSelect,
  onPrevious,
  onNext,
}: QuestionNavigationProps) {
  const getStatus = (equation: Equation, index: number) => {
    const result = questionResults.find(r => r.equationId === equation.id);
    const isMastered = masteredEquations.includes(equation.id);
    
    if (result) {
      if (result.correct) return 'correct';
      return 'wrong';
    }
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  const statusStyles = {
    current: 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/50 scale-110',
    correct: 'bg-green-500/20 border-green-400/50 text-green-400',
    wrong: 'bg-red-500/20 border-red-400/50 text-red-400',
    pending: 'bg-white/5 border-white/20 text-white/50 hover:bg-white/10 hover:border-white/40',
  };

  const statusIcons = {
    current: null,
    correct: <CheckCircle2 className="w-4 h-4" />,
    wrong: <XCircle className="w-4 h-4" />,
    pending: null,
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          题目导航
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onPrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white/60 text-sm px-2">
            {currentIndex + 1} / {equations.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onNext} disabled={currentIndex === equations.length - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {equations.map((equation, index) => {
          const status = getStatus(equation, index);
          const isMastered = masteredEquations.includes(equation.id);
          
          return (
            <button
              key={equation.id}
              onClick={() => onSelect(index)}
              className={cn(
                'group relative w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-200',
                statusStyles[status]
              )}
              title={`${getReactionTypeName(equation.type)} · ${isMastered ? '已掌握' : ''}`}
            >
              {statusIcons[status] || (index + 1)}
              {isMastered && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                  <BookmarkCheck className="w-2 h-2 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-white/50">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-cyan-500" />
          <span>当前</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/40 border border-green-400/50" />
          <span>答对</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500/40 border border-red-400/50" />
          <span>答错</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-white/5 border border-white/20" />
          <span>未答</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/40 border border-green-400/50 relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
          </div>
          <span>已掌握</span>
        </div>
      </div>
    </div>
  );
}
