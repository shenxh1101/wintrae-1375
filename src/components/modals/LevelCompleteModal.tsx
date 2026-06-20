import { Trophy, Star, Clock, Lightbulb, CheckCircle2, XCircle, FlaskConical, ArrowRight, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal, ModalFooter } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { getReactionTypeName } from '../../utils/equationParser';
import { formatTime } from '../../utils/mathUtils';
import type { LevelCompletionStats, ReactionType } from '../../types';

interface LevelCompleteModalProps {
  isOpen: boolean;
  stats: LevelCompletionStats | null;
  onClose: () => void;
  onViewStats: () => void;
  onFinish: () => void;
}

export function LevelCompleteModal({
  isOpen,
  stats,
  onClose,
  onViewStats,
  onFinish,
}: LevelCompleteModalProps) {
  if (!stats) return null;

  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
    : 0;

  const reactionTypeEntries = Object.entries(stats.reactionTypeStats) as [ReactionType, { correct: number; total: number }][];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏆 关卡完成！"
      className="border-yellow-500/30 max-w-2xl"
      showCloseButton={false}
    >
      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30 animate-pulse">
          <Trophy className="w-12 h-12 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3].map(i => (
            <Star
              key={i}
              className={
                i <= stats.stars
                  ? 'w-10 h-10 text-yellow-400 fill-yellow-400 drop-shadow-lg'
                  : 'w-10 h-10 text-white/20'
              }
            />
          ))}
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">
          获得 {stats.stars} 星！
        </h3>
        <p className="text-cyan-400 text-xl font-bold mb-4">
          总得分: {stats.score.toLocaleString()} 分
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card hover={false} className="text-center bg-white/5">
          <CardContent className="py-4">
            <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{formatTime(stats.totalTime)}</p>
            <p className="text-xs text-white/50">总用时</p>
          </CardContent>
        </Card>
        <Card hover={false} className="text-center bg-white/5">
          <CardContent className="py-4">
            <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-400">{stats.correctAnswers}</p>
            <p className="text-xs text-white/50">答对</p>
          </CardContent>
        </Card>
        <Card hover={false} className="text-center bg-white/5">
          <CardContent className="py-4">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-400">{stats.wrongAnswers}</p>
            <p className="text-xs text-white/50">答错</p>
          </CardContent>
        </Card>
        <Card hover={false} className="text-center bg-white/5">
          <CardContent className="py-4">
            <Lightbulb className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{stats.totalHintsUsed}</p>
            <p className="text-xs text-white/50">使用提示</p>
          </CardContent>
        </Card>
      </div>

      <Card hover={false} className="bg-white/5 mb-4">
        <CardHeader>
          <h4 className="text-white font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            正确率
          </h4>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar
                value={stats.correctAnswers}
                max={stats.totalQuestions}
                color={accuracy >= 80 ? 'green' : accuracy >= 60 ? 'yellow' : 'red'}
              />
            </div>
            <span className="text-white font-bold text-lg w-16 text-right">
              {accuracy}%
            </span>
          </div>
        </CardContent>
      </Card>

      {reactionTypeEntries.length > 0 && (
        <Card hover={false} className="bg-white/5 mb-4">
          <CardHeader>
            <h4 className="text-white font-bold flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              反应类型掌握情况
            </h4>
          </CardHeader>
          <CardContent className="space-y-3">
            {reactionTypeEntries.map(([type, data]) => {
              const typeAccuracy = data.total > 0
                ? Math.round((data.correct / data.total) * 100)
                : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-sm">{getReactionTypeName(type)}</span>
                    <span className="text-white/60 text-sm">
                      {data.correct}/{data.total} ({typeAccuracy}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={data.correct}
                    max={data.total}
                    color={typeAccuracy >= 80 ? 'green' : typeAccuracy >= 60 ? 'yellow' : 'red'}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {stats.wrongAnswers > 0 && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
          <p className="text-red-400 text-sm">
            <XCircle className="inline w-4 h-4 mr-1" />
            本关有 {stats.wrongAnswers} 道题答错，已自动加入错题本，记得复习哦！
          </p>
        </div>
      )}

      <ModalFooter className="flex-col sm:flex-row gap-3">
        <Button variant="secondary" onClick={onViewStats} className="flex-1">
          <BarChart3 className="w-4 h-4 mr-2" />
          查看详细成绩
        </Button>
        <Button onClick={onFinish} size="lg" className="flex-1">
          完成
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </ModalFooter>
    </Modal>
  );
}
