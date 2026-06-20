import type { UserProgress, ScoreBreakdown, LevelResult } from '../types';
import { clamp } from './mathUtils';

export function calculateQuestionScore(
  timeSpent: number,
  hintsUsed: number,
  attempts: number,
  difficulty: number
): number {
  const baseScore = 100 * difficulty;
  
  const timeBonus = Math.max(0, 60 - timeSpent) * 0.5;
  const hintPenalty = hintsUsed * 15;
  const attemptPenalty = (attempts - 1) * 10;
  
  const totalScore = baseScore + timeBonus - hintPenalty - attemptPenalty;
  
  return Math.max(10, Math.round(totalScore));
}

export function calculateStars(
  totalScore: number,
  timeSpent: number,
  hintsUsed: number
): 0 | 1 | 2 | 3 {
  if (totalScore <= 0) return 0;
  
  if (totalScore >= 250 && timeSpent < 120 && hintsUsed === 0) {
    return 3;
  }
  
  if (totalScore >= 150 && timeSpent < 180 && hintsUsed <= 1) {
    return 2;
  }
  
  return 1;
}

export function calculateScoreBreakdown(progress: UserProgress): ScoreBreakdown {
  const accuracy = progress.totalQuestions > 0
    ? (progress.correctAnswers / progress.totalQuestions) * 100
    : 0;

  const speed = progress.averageTime > 0
    ? clamp(100 - (progress.averageTime - 30) * 0.5, 0, 100)
    : 0;

  const streak = progress.maxStreak > 0
    ? clamp(progress.maxStreak * 10, 0, 100)
    : 0;

  const hints = progress.totalQuestions > 0
    ? clamp(100 - (progress.totalHintsUsed / progress.totalQuestions) * 30, 0, 100)
    : 100;

  const knowledge = calculateKnowledgeScore(progress);

  return {
    speed: Math.round(speed),
    accuracy: Math.round(accuracy),
    streak: Math.round(streak),
    hints: Math.round(hints),
    knowledge: Math.round(knowledge),
  };
}

function calculateKnowledgeScore(progress: UserProgress): number {
  const levelResults = Object.values(progress.levels);
  if (levelResults.length === 0) return 0;

  const completedLevels = levelResults.filter(r => r.completed);
  const totalStars = completedLevels.reduce((sum, r) => sum + r.stars, 0);
  const maxPossibleStars = levelResults.length * 3;

  return maxPossibleStars > 0 ? (totalStars / maxPossibleStars) * 100 : 0;
}

export function calculateOverallRating(breakdown: ScoreBreakdown): number {
  const weights = {
    speed: 0.2,
    accuracy: 0.3,
    streak: 0.15,
    hints: 0.15,
    knowledge: 0.2,
  };

  const total = 
    breakdown.speed * weights.speed +
    breakdown.accuracy * weights.accuracy +
    breakdown.streak * weights.streak +
    breakdown.hints * weights.hints +
    breakdown.knowledge * weights.knowledge;

  return Math.round(total);
}

export function updateProgressStats(
  progress: UserProgress,
  correct: boolean,
  time: number,
  hints: number,
  score: number
): UserProgress {
  const newTotalQuestions = progress.totalQuestions + 1;
  const newCorrectAnswers = progress.correctAnswers + (correct ? 1 : 0);
  const newCurrentStreak = correct ? progress.currentStreak + 1 : 0;
  const newMaxStreak = Math.max(progress.maxStreak, newCurrentStreak);
  const newTotalHintsUsed = progress.totalHintsUsed + hints;
  const newTotalScore = progress.totalScore + score;
  const newAverageTime = 
    (progress.averageTime * progress.totalQuestions + time) / newTotalQuestions;

  return {
    ...progress,
    totalScore: newTotalScore,
    totalQuestions: newTotalQuestions,
    correctAnswers: newCorrectAnswers,
    currentStreak: newCurrentStreak,
    maxStreak: newMaxStreak,
    totalHintsUsed: newTotalHintsUsed,
    averageTime: newAverageTime,
    lastPlayed: new Date().toISOString(),
  };
}

export function checkThemeUnlock(
  progress: UserProgress,
  requiredScore: number
): boolean {
  return progress.totalScore >= requiredScore;
}

export function getGradeFromScore(score: number): {
  grade: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return { grade: 'S', color: '#FFD700', description: '化学大师！完美！' };
  } else if (score >= 80) {
    return { grade: 'A', color: '#00C853', description: '优秀！继续保持！' };
  } else if (score >= 70) {
    return { grade: 'B', color: '#00D4FF', description: '良好！还有提升空间！' };
  } else if (score >= 60) {
    return { grade: 'C', color: '#FF6B35', description: '及格！继续努力！' };
  } else {
    return { grade: 'D', color: '#FF1744', description: '需要多加练习！' };
  }
}

export function generateLevelResult(
  levelId: string,
  stars: number,
  timeSpent: number,
  hintsUsed: number,
  completed: boolean
): LevelResult {
  return {
    levelId,
    stars,
    timeSpent,
    hintsUsed,
    completed,
    completedAt: new Date().toISOString(),
  };
}
