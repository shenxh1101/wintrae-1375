import { create } from 'zustand';
import type { UserProgress, LevelResult } from '../types';
import { getFromStorage, setToStorage } from '../hooks/useLocalStorage';
import { updateProgressStats, checkThemeUnlock } from '../utils/scoring';
import { themes } from '../data/levels';

const PROGRESS_KEY = 'chem-balance-progress';

const initialProgress: UserProgress = {
  totalScore: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalHintsUsed: 0,
  averageTime: 0,
  lastPlayed: new Date().toISOString(),
  themes: { 'theme-1': true },
  levels: {},
};

interface ProgressState {
  progress: UserProgress;
  loadProgress: () => void;
  saveProgress: () => void;
  updateStats: (correct: boolean, time: number, hints: number, score: number) => void;
  updateLevelResult: (result: LevelResult) => void;
  checkAndUnlockThemes: () => string[];
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: initialProgress,

  loadProgress: () => {
    const saved = getFromStorage<UserProgress>(PROGRESS_KEY, initialProgress);
    set({ progress: saved });
  },

  saveProgress: () => {
    const { progress } = get();
    setToStorage(PROGRESS_KEY, progress);
  },

  updateStats: (correct: boolean, time: number, hints: number, score: number) => {
    set(state => {
      const newProgress = updateProgressStats(state.progress, correct, time, hints, score);
      setToStorage(PROGRESS_KEY, newProgress);
      return { progress: newProgress };
    });
  },

  updateLevelResult: (result: LevelResult) => {
    set(state => {
      const existing = state.progress.levels[result.levelId];
      const shouldUpdate = !existing || 
        result.stars > existing.stars ||
        (result.completed && !existing.completed) ||
        (result.timeSpent < (existing.bestTime || Infinity));

      if (!shouldUpdate) return state;

      const newProgress = {
        ...state.progress,
        levels: {
          ...state.progress.levels,
          [result.levelId]: {
            ...result,
            bestTime: existing && existing.bestTime 
              ? Math.min(existing.bestTime, result.timeSpent) 
              : result.timeSpent,
          } as LevelResult & { bestTime: number },
        },
      };

      setToStorage(PROGRESS_KEY, newProgress);
      return { progress: newProgress };
    });
  },

  checkAndUnlockThemes: (): string[] => {
    const { progress } = get();
    const newlyUnlocked: string[] = [];

    themes.forEach(theme => {
      if (!progress.themes[theme.id] && checkThemeUnlock(progress, theme.requiredScore)) {
        newlyUnlocked.push(theme.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      set(state => {
        const newThemes = { ...state.progress.themes };
        newlyUnlocked.forEach(id => {
          newThemes[id] = true;
        });
        const newProgress = {
          ...state.progress,
          themes: newThemes,
        };
        setToStorage(PROGRESS_KEY, newProgress);
        return { progress: newProgress };
      });
    }

    return newlyUnlocked;
  },

  resetProgress: () => {
    setToStorage(PROGRESS_KEY, initialProgress);
    set({ progress: initialProgress });
  },
}));
