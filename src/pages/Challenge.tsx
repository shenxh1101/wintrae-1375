import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { ArrowLeft, Lightbulb, RotateCcw, Send, Clock, Zap, Sparkles, X } from 'lucide-react';
import { EquationDisplay } from '../components/equation/EquationDisplay';
import { DraggableCard } from '../components/equation/DraggableCard';
import { AtomStatsTable } from '../components/equation/AtomStatsTable';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useGameStore } from '../store/useGameStore';
import { useProgressStore } from '../store/useProgressStore';
import { useMistakesStore } from '../store/useMistakesStore';
import { getEquationsByLevelId } from '../data/equations';
import { getLevelById, getThemeByLevelId, getThemeById } from '../data/levels';
import { checkBalance } from '../utils/balanceChecker';
import { validateAnswer } from '../utils/balanceChecker';
import { generateCoefficientOptions, formatTime } from '../utils/mathUtils';
import { calculateQuestionScore, calculateStars, generateLevelResult } from '../utils/scoring';
import { generateAllHints, generateBalanceReasoning } from '../utils/hintGenerator';
import { formatEquationString, getReactionTypeName } from '../utils/equationParser';
import { useTimer } from '../hooks/useTimer';
import { cn } from '../lib/utils';
import type { HintStep } from '../types';

export function Challenge() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { addWrongAnswer } = useMistakesStore();
  const { updateStats, updateLevelResult, checkAndUnlockThemes } = useProgressStore();

  const {
    currentLevelId,
    currentEquationIndex,
    coefficients,
    hintsUsed,
    attempts,
    showResult,
    lastAnswerCorrect,
    startLevel,
    setCoefficient,
    resetCoefficients,
    useHint,
    incrementAttempts,
    showResultModal,
    hideResultModal,
    nextEquation,
    endLevel,
  } = useGameStore();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [currentHintStep, setCurrentHintStep] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>([]);

  const { elapsedTime, formattedTime, start: startTimer, pause: pauseTimer, reset: resetTimer } = useTimer(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const level = useMemo(() => getLevelById(levelId || ''), [levelId]);
  const theme = useMemo(() => getThemeByLevelId(levelId || ''), [levelId]);
  const equations = useMemo(() => getEquationsByLevelId(levelId || ''), [levelId]);
  const currentEquation = equations[currentEquationIndex];

  const balanceResult = useMemo(() => {
    if (!currentEquation || coefficients.some(c => c === 0)) {
      return { isBalanced: false, isSimplest: false, details: [] };
    }
    return checkBalance(currentEquation, coefficients);
  }, [currentEquation, coefficients]);

  const hints = useMemo(() => {
    if (!currentEquation) return [];
    return generateAllHints(currentEquation);
  }, [currentEquation]);

  const coefficientOptions = useMemo(() => generateCoefficientOptions(10), []);

  useEffect(() => {
    if (levelId && levelId !== currentLevelId) {
      startLevel(levelId);
      startTimer();
    }
    return () => {
      pauseTimer();
    };
  }, [levelId, currentLevelId, startLevel, startTimer, pauseTimer]);

  useEffect(() => {
    if (currentEquation) {
      setCurrentHintStep(0);
    }
  }, [currentEquationIndex, currentEquation]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);

    const { active, over } = event;
    if (!over) return;

    const cardValue = parseInt(active.id as string, 10);
    const slotId = over.id as string;
    const slotIndex = parseInt(slotId.replace('slot-', ''), 10);

    if (!isNaN(cardValue) && !isNaN(slotIndex)) {
      setCoefficient(slotIndex, cardValue);
    }
  };

  const handleCoefficientRemove = (index: number) => {
    setCoefficient(index, 0);
  };

  const handleSubmit = () => {
    if (!currentEquation) return;

    incrementAttempts();
    const validation = validateAnswer(currentEquation, coefficients);

    if (validation.valid) {
      const score = calculateQuestionScore(
        elapsedTime,
        hintsUsed,
        attempts + 1,
        currentEquation.difficulty
      );

      updateStats(true, elapsedTime, hintsUsed, score);
      setLevelScore(prev => prev + score);
      showResultModal(true);
    } else {
      showResultModal(false);

      if (attempts >= 2) {
        addWrongAnswer({
          equationId: currentEquation.id,
          equationText: formatEquationString(
            currentEquation.reactants,
            currentEquation.products
          ),
          wrongCoefficients: [...coefficients],
          correctCoefficients: [...currentEquation.correctCoefficients],
          reasoning: generateBalanceReasoning(currentEquation, currentEquation.correctCoefficients),
          attempts: attempts + 1,
          mastered: false,
        });
      }
    }
  };

  const handleNext = () => {
    hideResultModal();

    if (currentEquationIndex >= equations.length - 1) {
      const stars = calculateStars(levelScore, elapsedTime, hintsUsed);
      const result = generateLevelResult(levelId!, stars, elapsedTime, hintsUsed, true);
      updateLevelResult(result);

      const newUnlocks = checkAndUnlockThemes();
      if (newUnlocks.length > 0) {
        setUnlockedThemes(newUnlocks);
      }

      pauseTimer();
      setLevelCompleted(true);
    } else {
      nextEquation();
      resetTimer();
      startTimer();
    }
  };

  const handleUseHint = () => {
    if (currentHintStep < hints.length) {
      useHint();
      setCurrentHintStep(prev => Math.min(prev + 1, hints.length));
    }
    setShowHintModal(true);
  };

  const handleBack = () => {
    endLevel();
    navigate('/');
  };

  const handleFinish = () => {
    endLevel();
    navigate('/');
  };

  if (!level || !currentEquation) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-8 ml-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg">加载中...</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回关卡选择
          </Button>
        </div>
      </div>
    );
  }

  const activeDragValue = activeDragId ? parseInt(activeDragId, 10) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen pt-24 pb-12 px-8 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{level.name}</h1>
                <p className="text-sm text-white/50">
                  {theme?.name} · {getReactionTypeName(currentEquation.type)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-lg">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>连对: {useProgressStore.getState().progress.currentStreak}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/50">题目</p>
                <p className="text-lg font-bold text-white">
                  {currentEquationIndex + 1} / {equations.length}
                </p>
              </div>
            </div>
          </div>

          <ProgressBar
            value={currentEquationIndex + 1}
            max={equations.length}
            className="mb-8"
            showLabel
          />

          <Card hover={false} className="mb-6">
            <CardContent className="pt-6">
              <EquationDisplay
                reactants={currentEquation.reactants}
                products={currentEquation.products}
                coefficients={coefficients}
                onCoefficientRemove={handleCoefficientRemove}
                highlightCorrect={balanceResult.isBalanced && balanceResult.isSimplest}
              />
            </CardContent>
          </Card>

          <Card hover={false} className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-bold text-white">系数卡片</h3>
              <p className="text-sm text-white/50">拖拽卡片到化学式前的槽位</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {coefficientOptions.map((value) => (
                  <DraggableCard
                    key={value}
                    id={value.toString()}
                    value={value}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card hover={false}>
              <CardHeader>
                <h3 className="text-lg font-bold text-white">原子统计表</h3>
              </CardHeader>
              <CardContent>
                {balanceResult.details.length > 0 ? (
                  <AtomStatsTable details={balanceResult.details} />
                ) : (
                  <p className="text-white/40 text-center py-8">
                    填写系数后查看原子数量统计
                  </p>
                )}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <h3 className="text-lg font-bold text-white">配平状态</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">原子平衡</span>
                    <span className={cn(
                      'font-bold px-3 py-1 rounded-full text-sm',
                      balanceResult.isBalanced
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    )}>
                      {balanceResult.isBalanced ? '已平衡' : '未平衡'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">最简系数</span>
                    <span className={cn(
                      'font-bold px-3 py-1 rounded-full text-sm',
                      balanceResult.isSimplest
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {balanceResult.isSimplest ? '是' : '可化简'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">尝试次数</span>
                    <span className="text-white font-bold">{attempts + 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">使用提示</span>
                    <span className="text-white font-bold">{hintsUsed} 次</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={handleUseHint}>
              <Lightbulb className="w-4 h-4 mr-2" />
              获取提示 ({hints.length - currentHintStep} 剩余)
            </Button>
            <Button variant="secondary" onClick={resetCoefficients}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重置系数
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={coefficients.some(c => c === 0)}
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              提交答案
            </Button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDragValue ? (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-cyan-500/50 scale-110 opacity-90">
            {activeDragValue}
          </div>
        ) : null}
      </DragOverlay>

      <Modal
        isOpen={showResult}
        onClose={hideResultModal}
        showCloseButton={false}
        title={lastAnswerCorrect ? '🎉 配平正确！' : '❌ 配平错误'}
        className={lastAnswerCorrect ? 'border-green-500/30' : 'border-red-500/30'}
      >
        {lastAnswerCorrect ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
              <Sparkles className="w-10 h-10 text-green-400" />
            </div>
            <p className="text-white/70 mb-4">
              太棒了！你成功配平了这个方程式！
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">用时</p>
                <p className="text-xl font-bold text-white">{formattedTime}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">提示</p>
                <p className="text-xl font-bold text-white">{hintsUsed} 次</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-white/50">尝试</p>
                <p className="text-xl font-bold text-white">{attempts + 1} 次</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="w-10 h-10 text-red-400" />
            </div>
            <p className="text-white/70 mb-4">
              {validateAnswer(currentEquation, coefficients).message}
            </p>
            <p className="text-sm text-white/50">
              检查原子统计表，找出不平衡的元素
            </p>
          </div>
        )}
        <ModalFooter>
          {lastAnswerCorrect ? (
            <Button onClick={handleNext} size="lg" className="w-full">
              {currentEquationIndex >= equations.length - 1 ? '查看成绩' : '下一题'}
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleUseHint}>
                <Lightbulb className="w-4 h-4 mr-2" />
                查看提示
              </Button>
              <Button onClick={hideResultModal}>
                继续尝试
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
        title="💡 提示实验室"
      >
        <div className="space-y-4">
          {hints.slice(0, currentHintStep).map((hint: HintStep, index: number) => (
            <div
              key={hint.id}
              className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
                <h4 className="font-bold text-cyan-400">{hint.title}</h4>
              </div>
              <p className="text-white/80 whitespace-pre-line text-sm">{hint.content}</p>
            </div>
          ))}
          {currentHintStep === 0 && (
            <p className="text-center text-white/50 py-8">
              点击"获取提示"按钮查看分步提示
            </p>
          )}
          {currentHintStep < hints.length && currentHintStep > 0 && (
            <p className="text-center text-cyan-400 text-sm">
              还有 {hints.length - currentHintStep} 条提示可用
            </p>
          )}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowHintModal(false)}>
            关闭
          </Button>
          {currentHintStep < hints.length && (
            <Button onClick={handleUseHint}>
              <Lightbulb className="w-4 h-4 mr-2" />
              下一条提示
            </Button>
          )}
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={levelCompleted}
        onClose={handleFinish}
        title="🏆 关卡完成！"
        className="border-yellow-500/30"
      >
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            获得 {calculateStars(levelScore, elapsedTime, hintsUsed)} 星！
          </h3>
          <p className="text-white/60 mb-6">总得分: {levelScore} 分</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs text-white/50">总用时</p>
              <p className="text-xl font-bold text-white">{formatTime(elapsedTime)}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-xs text-white/50">使用提示</p>
              <p className="text-xl font-bold text-white">{hintsUsed} 次</p>
            </div>
          </div>

          {unlockedThemes.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6">
              <p className="text-green-400 font-bold mb-2">🎉 解锁新主题！</p>
              {unlockedThemes.map(themeId => {
                const t = getThemeByLevelId(themeId) || getThemeById(themeId);
                return (
                  <p key={themeId} className="text-white/80">
                    {t?.name}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => navigate('/stats')}>
            查看详细成绩
          </Button>
          <Button onClick={handleFinish} size="lg">
            完成
          </Button>
        </ModalFooter>
      </Modal>
    </DndContext>
  );
}
