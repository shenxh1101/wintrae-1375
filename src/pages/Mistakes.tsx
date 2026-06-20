import { useState } from 'react';
import { BookX, CheckCircle, RotateCcw, Trash2, AlertCircle, Lightbulb, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useMistakesStore } from '../store/useMistakesStore';
import { getEquationById } from '../data/equations';
import { generateBalanceReasoning } from '../utils/hintGenerator';
import { formatEquationString, getReactionTypeName } from '../utils/equationParser';
import { cn } from '../lib/utils';
import type { WrongAnswer } from '../types';

interface MistakeCardProps {
  mistake: WrongAnswer;
  onRetry: (mistake: WrongAnswer) => void;
  onMarkMastered: (id: string) => void;
  onRemove: (id: string) => void;
}

function MistakeCard({ mistake, onRetry, onMarkMastered, onRemove }: MistakeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const equation = getEquationById(mistake.equationId);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderCoefficients = (coefficients: number[], isCorrect: boolean) => {
    if (!equation) return null;
    const totalCompounds = equation.reactants.length + equation.products.length;
    const coeffs = coefficients.length === totalCompounds ? coefficients : Array(totalCompounds).fill(1);

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {equation.reactants.map((r, i) => (
          <div key={`r-${i}`} className="flex items-center">
            <span className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg',
              isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              {coeffs[i]}
            </span>
            <span className="ml-1 text-white/80 font-mono">{r.formula}</span>
            {i < equation.reactants.length - 1 && <span className="mx-2 text-white/40">+</span>}
          </div>
        ))}
        <span className="mx-3 text-cyan-400">→</span>
        {equation.products.map((p, i) => (
          <div key={`p-${i}`} className="flex items-center">
            <span className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg',
              isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              {coeffs[equation.reactants.length + i]}
            </span>
            <span className="ml-1 text-white/80 font-mono">{p.formula}</span>
            {i < equation.products.length - 1 && <span className="mx-2 text-white/40">+</span>}
          </div>
        ))}
      </div>
    );
  };

  if (!equation) return null;

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {mistake.mastered ? (
                <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 font-medium">
                  <CheckCircle className="inline w-3 h-3 mr-1" />
                  已掌握
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 font-medium">
                  <AlertCircle className="inline w-3 h-3 mr-1" />
                  待巩固
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400 font-medium">
                {getReactionTypeName(equation.type)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400 font-medium">
                难度 {equation.difficulty}
              </span>
            </div>
            <div className="text-white/60 text-sm flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(mistake.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-400" />
                错误 {mistake.attempts} 次
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-white/50" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/50" />
            )}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-white/60 text-sm mb-2">原始方程式：</p>
          <div className="p-3 rounded-xl bg-white/5 font-mono text-lg text-white">
            {formatEquationString(equation.reactants, equation.products)}
          </div>
        </div>

        <div className={cn(
          'transition-all duration-300 overflow-hidden',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 font-medium mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                你的错误答案
              </p>
              {renderCoefficients(mistake.wrongCoefficients, false)}
            </div>

            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                正确答案
              </p>
              {renderCoefficients(mistake.correctCoefficients, true)}
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-cyan-400 font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                配平思路
              </p>
              <div className="text-white/70 text-sm space-y-2">
                {mistake.reasoning ? (
                  <p className="leading-relaxed">{mistake.reasoning}</p>
                ) : (
                  <p className="leading-relaxed whitespace-pre-line">{generateBalanceReasoning(equation, mistake.correctCoefficients)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-wrap gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onRetry(mistake)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            再练一次
          </Button>
          {!mistake.mastered && (
            <Button
              size="sm"
              variant="success"
              onClick={() => onMarkMastered(mistake.id)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              标记已掌握
            </Button>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(mistake.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          移除
        </Button>
      </CardFooter>
    </Card>
  );
}

export function Mistakes() {
  const { wrongAnswers, markMastered, removeWrongAnswer, clearAll, getUnmastered } = useMistakesStore();
  const [filter, setFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredMistakes = wrongAnswers.filter(m => {
    if (filter === 'unmastered') return !m.mastered;
    if (filter === 'mastered') return m.mastered;
    return true;
  });

  const unmasteredCount = getUnmastered().length;
  const masteredCount = wrongAnswers.length - unmasteredCount;

  const handleRetry = (mistake: WrongAnswer) => {
    const levelId = mistake.equationId.split('-').slice(0, 3).join('-');
    window.location.href = `/challenge?level=${levelId}&equation=${mistake.equationId}`;
  };

  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            <BookX className="inline w-10 h-10 mr-3 text-red-400" />
            错题本
          </h1>
          <p className="text-white/60 text-lg">
            记录失败的尝试，从错误中学习提高
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-4xl font-bold text-white mb-2">{wrongAnswers.length}</p>
              <p className="text-white/60 text-sm">总错题数</p>
            </CardContent>
          </Card>
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-4xl font-bold text-red-400 mb-2">{unmasteredCount}</p>
              <p className="text-white/60 text-sm">待巩固</p>
            </CardContent>
          </Card>
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-4xl font-bold text-green-400 mb-2">{masteredCount}</p>
              <p className="text-white/60 text-sm">已掌握</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-2">
            {(['all', 'unmastered', 'mastered'] as const).map(f => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? 'primary' : 'secondary'}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '全部' : f === 'unmastered' ? '待巩固' : '已掌握'}
              </Button>
            ))}
          </div>
          {wrongAnswers.length > 0 && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空全部
            </Button>
          )}
        </div>

        {filteredMistakes.length === 0 ? (
          <Card hover={false} className="text-center py-16">
            <CardContent>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {wrongAnswers.length === 0 ? '太棒了！' : '没有符合条件的错题'}
              </h3>
              <p className="text-white/60">
                {wrongAnswers.length === 0
                  ? '你还没有做错任何题目，继续保持！'
                  : filter === 'unmastered'
                  ? '所有错题都已掌握，继续加油！'
                  : '还没有已掌握的错题，多练习吧！'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMistakes.map(mistake => (
            <MistakeCard
              key={mistake.id}
              mistake={mistake}
              onRetry={handleRetry}
              onMarkMastered={markMastered}
              onRemove={removeWrongAnswer}
            />
          ))
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <Card hover={false} className="max-w-md w-full mx-4">
            <CardHeader>
              <h3 className="text-xl font-bold text-white">确认清空</h3>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                确定要清空所有错题记录吗？此操作不可撤销。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setShowClearConfirm(false)}>
                取消
              </Button>
              <Button variant="danger" onClick={handleClearAll}>
                确认清空
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
