import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, ChevronRight, FlaskConical, Zap, GitMerge, ArrowLeftRight, Trophy, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { themes, getReactionTypeIcon } from '../data/levels';
import { useProgressStore } from '../store/useProgressStore';
import { cn } from '../lib/utils';
import type { ReactionTheme, Level } from '../types';

const themeIcons: Record<string, React.FC<{ className?: string }>> = {
  'flask-conical': FlaskConical,
  'arrow-left-right': ArrowLeftRight,
  'git-merge': GitMerge,
  'zap': Zap,
  'trophy': Trophy,
};

function StarRating({ stars, max = 3 }: { stars: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-4 h-4 transition-all duration-300',
            i < stars
              ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
              : 'text-white/20'
          )}
        />
      ))}
    </div>
  );
}

function LevelCard({
  level,
  theme,
  onSelect,
}: {
  level: Level;
  theme: ReactionTheme;
  onSelect: () => void;
}) {
  const { progress } = useProgressStore();
  const levelResult = progress.levels[level.id];
  const isUnlocked = level.unlocked || progress.themes[theme.id];

  const difficultyColors = {
    1: 'from-green-400 to-emerald-500',
    2: 'from-yellow-400 to-orange-500',
    3: 'from-red-400 to-rose-500',
  };

  const difficultyLabels = {
    1: '简单',
    2: '中等',
    3: '困难',
  };

  return (
    <button
      onClick={onSelect}
      disabled={!isUnlocked}
      className={cn(
        'relative w-full p-5 rounded-xl text-left transition-all duration-300 group',
        isUnlocked
          ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 hover:-translate-y-1 cursor-pointer'
          : 'bg-white/[0.02] border border-white/5 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br',
              difficultyColors[level.difficulty]
            )}
          >
            <span className="text-white font-bold text-sm">{level.difficulty}</span>
          </div>
          <div>
            <h3 className={cn(
              'font-bold',
              isUnlocked ? 'text-white' : 'text-white/50'
            )}>
              {level.name}
            </h3>
            <p className="text-xs text-white/50">{difficultyLabels[level.difficulty]}</p>
          </div>
        </div>
        {!isUnlocked ? (
          <Lock className="w-5 h-5 text-white/30" />
        ) : (
          <StarRating stars={levelResult?.stars || 0} />
        )}
      </div>

      <p className={cn(
        'text-sm mb-4 line-clamp-2',
        isUnlocked ? 'text-white/60' : 'text-white/30'
      )}>
        {level.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-xs text-white/40">
          {level.equations.length} 道题
          {levelResult?.bestTime && (
            <span className="ml-3">最佳: {Math.floor(levelResult.bestTime / 60)}:{(levelResult.bestTime % 60).toString().padStart(2, '0')}</span>
          )}
        </div>
        {isUnlocked && (
          <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        )}
      </div>

      {levelResult?.completed && (
        <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-br-xl rounded-tl-xl flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );
}

export function LevelSelect() {
  const navigate = useNavigate();
  const { progress } = useProgressStore();
  const [expandedTheme, setExpandedTheme] = useState<string | null>(themes[0]?.id || null);

  const handleLevelSelect = (levelId: string) => {
    navigate(`/challenge/${levelId}`);
  };

  const totalLevels = themes.reduce((sum, theme) => sum + theme.levels.length, 0);
  const completedLevels = Object.values(progress.levels).filter(r => r.completed).length;
  const totalStars = Object.values(progress.levels).reduce((sum, r) => sum + r.stars, 0);
  const maxStars = totalLevels * 3;

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 ml-64">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">选择关卡</h1>
          <p className="text-white/60 text-lg">选择一个反应主题开始配平挑战</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/50">总进度</p>
                  <p className="text-2xl font-bold text-white">{completedLevels} / {totalLevels}</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={completedLevels} max={totalLevels} />
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <p className="text-sm text-white/50">获得星星</p>
                  <p className="text-2xl font-bold text-white">{totalStars} / {maxStars}</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={totalStars} max={maxStars} color="yellow" />
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/50">当前积分</p>
                  <p className="text-2xl font-bold text-cyan-400">{progress.totalScore.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-white/40">最高连对: {progress.maxStreak}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {themes.map((theme) => {
            const Icon = themeIcons[theme.icon] || FlaskConical;
            const isUnlocked = theme.unlocked || progress.themes[theme.id];
            const isExpanded = expandedTheme === theme.id;
            const completedInTheme = theme.levels.filter(
              level => progress.levels[level.id]?.completed
            ).length;

            return (
              <Card
                key={theme.id}
                hover={false}
                className={cn(
                  'transition-all duration-300 overflow-hidden',
                  isUnlocked && 'cursor-pointer'
                )}
                onClick={() => isUnlocked && setExpandedTheme(isExpanded ? null : theme.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${theme.color}dd, ${theme.color}88)`,
                        boxShadow: `0 10px 30px ${theme.color}33`,
                      }}
                    >
                      {isUnlocked ? (
                        <Icon className="w-7 h-7 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-white/70" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">{theme.name}</h2>
                        {!isUnlocked && (
                          <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/50">
                            需要 {theme.requiredScore} 分解锁
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        'text-sm mt-1',
                        isUnlocked ? 'text-white/60' : 'text-white/30'
                      )}>
                        {theme.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/50">
                        {completedInTheme} / {theme.levels.length} 完成
                      </p>
                      <ChevronRight
                        className={cn(
                          'w-5 h-5 text-white/40 ml-auto transition-transform duration-300',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && isUnlocked && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {theme.levels.map((level) => (
                        <LevelCard
                          key={level.id}
                          level={level}
                          theme={theme}
                          onSelect={() => handleLevelSelect(level.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
