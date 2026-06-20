import { useState, useEffect } from 'react';
import { BarChart3, Trophy, Star, Clock, Target, Zap, Award, TrendingUp, Lock, Unlock, Sparkles, Medal, Crown } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { RadarChart } from '../components/charts/RadarChart';
import { useProgressStore } from '../store/useProgressStore';
import { themes } from '../data/levels';
import { calculateScoreBreakdown, calculateOverallRating, getGradeFromScore } from '../utils/scoring';
import { formatTime } from '../utils/mathUtils';
import { cn } from '../lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export function Stats() {
  const { progress, loadProgress } = useProgressStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const scoreBreakdown = calculateScoreBreakdown(progress);
  const overallRating = calculateOverallRating(scoreBreakdown);
  const gradeInfo = getGradeFromScore(overallRating);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    const newAchievements: Achievement[] = [
      {
        id: 'first-correct',
        name: '初次胜利',
        description: '完成第一道配平题目',
        icon: <Star className="w-6 h-6" />,
        color: '#FFD700',
        unlocked: progress.correctAnswers >= 1,
      },
      {
        id: 'streak-5',
        name: '连对达人',
        description: '连续答对5道题',
        icon: <Zap className="w-6 h-6" />,
        color: '#FF6B35',
        unlocked: progress.maxStreak >= 5,
      },
      {
        id: 'streak-10',
        name: '连对大师',
        description: '连续答对10道题',
        icon: <Crown className="w-6 h-6" />,
        color: '#FF1744',
        unlocked: progress.maxStreak >= 10,
      },
      {
        id: 'accuracy-80',
        name: '精准射手',
        description: '准确率达到80%',
        icon: <Target className="w-6 h-6" />,
        color: '#00C853',
        unlocked: progress.totalQuestions >= 10 && (progress.correctAnswers / progress.totalQuestions) >= 0.8,
      },
      {
        id: 'theme-2',
        name: '探索者',
        description: '解锁置换反应主题',
        icon: <Award className="w-6 h-6" />,
        color: '#00D4FF',
        unlocked: progress.themes['theme-2'] === true,
      },
      {
        id: 'theme-3',
        name: '化学家',
        description: '解锁复分解反应主题',
        icon: <Medal className="w-6 h-6" />,
        color: '#9C27B0',
        unlocked: progress.themes['theme-3'] === true,
      },
      {
        id: 'theme-4',
        name: '氧化大师',
        description: '解锁氧化还原反应主题',
        icon: <Trophy className="w-6 h-6" />,
        color: '#FFD700',
        unlocked: progress.themes['theme-4'] === true,
      },
      {
        id: 'theme-5',
        name: '终极挑战者',
        description: '解锁综合挑战主题',
        icon: <Crown className="w-6 h-6" />,
        color: '#FF1744',
        unlocked: progress.themes['theme-5'] === true,
      },
      {
        id: 'score-1000',
        name: '千分选手',
        description: '累计得分达到1000分',
        icon: <TrendingUp className="w-6 h-6" />,
        color: '#00D4FF',
        unlocked: progress.totalScore >= 1000,
      },
      {
        id: 'score-3000',
        name: '化学精英',
        description: '累计得分达到3000分',
        icon: <Trophy className="w-6 h-6" />,
        color: '#FFD700',
        unlocked: progress.totalScore >= 3000,
      },
      {
        id: 'no-hint-10',
        name: '独立思考者',
        description: '不使用提示完成10道题',
        icon: <Sparkles className="w-6 h-6" />,
        color: '#00C853',
        unlocked: (progress.totalQuestions - progress.totalHintsUsed) >= 10,
      },
      {
        id: 'all-levels',
        name: '全关卡通关',
        description: '完成所有关卡',
        icon: <Crown className="w-6 h-6" />,
        color: '#FFD700',
        unlocked: Object.values(progress.levels).filter(l => l.completed).length >= 15,
      },
    ];

    setAchievements(newAchievements);
  }, [progress]);

  const accuracy = progress.totalQuestions > 0
    ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
    : 0;

  const unlockedThemesCount = Object.values(progress.themes).filter(Boolean).length;
  const completedLevels = Object.values(progress.levels).filter(l => l.completed).length;
  const totalLevels = themes.reduce((sum, t) => sum + t.levels.length, 0);
  const totalStars = Object.values(progress.levels).reduce((sum, l) => sum + l.stars, 0);
  const maxPossibleStars = totalLevels * 3;

  const nextTheme = themes.find(t => !progress.themes[t.id]);
  const nextThemeProgress = nextTheme
    ? Math.min(100, (progress.totalScore / nextTheme.requiredScore) * 100)
    : 100;

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 ml-64">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            <BarChart3 className="inline w-10 h-10 mr-3 text-cyan-400" />
            成绩中心
          </h1>
          <p className="text-white/60 text-lg">
            查看你的学习进度和成就
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card hover={false} className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-xl font-bold text-white">综合评分</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around flex-wrap gap-8">
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center mb-4 mx-auto"
                    style={{
                      background: `conic-gradient(${gradeInfo.color} ${overallRating * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center">
                      <span
                        className="text-5xl font-bold"
                        style={{ color: gradeInfo.color }}
                      >
                        {gradeInfo.grade}
                      </span>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg">{overallRating}分</p>
                  <p className="text-white/60 text-sm">{gradeInfo.description}</p>
                </div>
                <div className="flex-1 min-w-[300px]">
                  <RadarChart data={scoreBreakdown} size={300} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <h2 className="text-xl font-bold text-white">核心数据</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">总得分</p>
                    <p className="text-white font-bold text-xl">{progress.totalScore}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">正确率</p>
                    <p className="text-white font-bold text-xl">{accuracy}%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">最大连对</p>
                    <p className="text-white font-bold text-xl">{progress.maxStreak}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">获得星星</p>
                    <p className="text-white font-bold text-xl">{totalStars}/{maxPossibleStars}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-3xl font-bold text-white mb-1">{progress.totalQuestions}</p>
              <p className="text-white/60 text-sm">总答题数</p>
            </CardContent>
          </Card>
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-3xl font-bold text-green-400 mb-1">{progress.correctAnswers}</p>
              <p className="text-white/60 text-sm">答对题数</p>
            </CardContent>
          </Card>
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-3xl font-bold text-cyan-400 mb-1">{formatTime(progress.averageTime)}</p>
              <p className="text-white/60 text-sm">平均用时</p>
            </CardContent>
          </Card>
          <Card hover={false} className="text-center">
            <CardContent className="py-6">
              <p className="text-3xl font-bold text-orange-400 mb-1">{progress.totalHintsUsed}</p>
              <p className="text-white/60 text-sm">使用提示</p>
            </CardContent>
          </Card>
        </div>

        <Card hover={false} className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-white mb-2">主题解锁进度</h2>
            <p className="text-white/60 text-sm">
              已解锁 {unlockedThemesCount}/{themes.length} 个主题，完成 {completedLevels}/{totalLevels} 个关卡
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {themes.map(theme => {
              const isUnlocked = progress.themes[theme.id];
              const themeLevelsCompleted = theme.levels.filter(l => progress.levels[l.id]?.completed).length;
              const themeStars = theme.levels.reduce((sum, l) => sum + (progress.levels[l.id]?.stars || 0), 0);
              const themeMaxStars = theme.levels.length * 3;

              return (
                <div key={theme.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: isUnlocked ? `${theme.color}33` : 'rgba(255,255,255,0.1)' }}
                    >
                      {isUnlocked ? (
                        <Unlock className="w-6 h-6" style={{ color: theme.color }} />
                      ) : (
                        <Lock className="w-6 h-6 text-white/30" />
                      )}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-bold",
                        isUnlocked ? "text-white" : "text-white/50"
                      )}>
                        {theme.name}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {isUnlocked
                          ? `已完成 ${themeLevelsCompleted}/${theme.levels.length} 关，获得 ${themeStars}/${themeMaxStars} 星`
                          : `需要 ${theme.requiredScore} 分解锁`}
                      </p>
                    </div>
                  </div>
                  {isUnlocked ? (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map(i => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i <= Math.ceil(themeStars / theme.levels.length)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/20"
                        )}
                      />
                    ))}
                    </div>
                  ) : (
                    <span className="text-white/40 text-sm">
                      {Math.min(100, Math.round((progress.totalScore / theme.requiredScore) * 100))}%
                    </span>
                  )}
                </div>
                {!isUnlocked && (
                  <ProgressBar
                    value={Math.min(100, (progress.totalScore / theme.requiredScore) * 100)}
                    color="cyan"
                    className="mt-2"
                  />
                )}
              </div>
            );
          })}

          {nextTheme && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 font-medium mb-1">
                    <Sparkles className="inline w-4 h-4 mr-2" />
                    下一主题：{nextTheme.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    还需 {nextTheme.requiredScore - progress.totalScore} 分即可解锁
                  </p>
                </div>
                <Button variant="primary" size="sm">
                  继续挑战
                </Button>
              </div>
              <ProgressBar
                value={nextThemeProgress}
                color="cyan"
                className="mt-3"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card hover={false}>
        <CardHeader>
          <h2 className="text-xl font-bold text-white mb-2">成就徽章</h2>
          <p className="text-white/60 text-sm">
            已解锁 {achievements.filter(a => a.unlocked).length}/{achievements.length} 个成就
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-300",
                  achievement.unlocked
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/[0.02] border-white/5 opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      achievement.unlocked
                        ? "bg-white/10"
                        : "bg-white/5"
                    )}
                    style={{
                      background: achievement.unlocked
                        ? `${achievement.color}22`
                        : undefined,
                    }}
                  >
                    <div style={{ color: achievement.unlocked ? achievement.color : 'rgba(255,255,255,0.3)' }}>
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-bold text-sm truncate",
                      achievement.unlocked ? "text-white" : "text-white/50"
                    )}>
                      {achievement.name}
                    </h4>
                    <p className="text-white/60 text-xs mt-1">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Star className="w-3 h-3 text-green-400 fill-green-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
