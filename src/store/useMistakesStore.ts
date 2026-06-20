import { create } from 'zustand';
import type { WrongAnswer } from '../types';
import { getFromStorage, setToStorage } from '../hooks/useLocalStorage';

const MISTAKES_KEY = 'chem-balance-mistakes';

interface MistakesState {
  wrongAnswers: WrongAnswer[];
  loadMistakes: () => void;
  saveMistakes: () => void;
  addWrongAnswer: (answer: Omit<WrongAnswer, 'id' | 'createdAt'>) => void;
  markMastered: (id: string) => void;
  removeWrongAnswer: (id: string) => void;
  clearAll: () => void;
  getUnmastered: () => WrongAnswer[];
  getByEquationId: (equationId: string) => WrongAnswer | undefined;
}

export const useMistakesStore = create<MistakesState>((set, get) => ({
  wrongAnswers: [],

  loadMistakes: () => {
    const saved = getFromStorage<WrongAnswer[]>(MISTAKES_KEY, []);
    set({ wrongAnswers: saved });
  },

  saveMistakes: () => {
    const { wrongAnswers } = get();
    setToStorage(MISTAKES_KEY, wrongAnswers);
  },

  addWrongAnswer: (answer) => {
    set(state => {
      const existingIndex = state.wrongAnswers.findIndex(
        wa => wa.equationId === answer.equationId
      );

      let newAnswers: WrongAnswer[];
      
      if (existingIndex >= 0) {
        const existing = state.wrongAnswers[existingIndex];
        newAnswers = [...state.wrongAnswers];
        newAnswers[existingIndex] = {
          ...existing,
          wrongCoefficients: answer.wrongCoefficients,
          attempts: existing.attempts + 1,
          mastered: false,
        };
      } else {
        const newAnswer: WrongAnswer = {
          ...answer,
          id: `mistake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        newAnswers = [newAnswer, ...state.wrongAnswers];
      }

      setToStorage(MISTAKES_KEY, newAnswers);
      return { wrongAnswers: newAnswers };
    });
  },

  markMastered: (id: string) => {
    set(state => {
      const newAnswers = state.wrongAnswers.map(wa =>
        wa.id === id ? { ...wa, mastered: true } : wa
      );
      setToStorage(MISTAKES_KEY, newAnswers);
      return { wrongAnswers: newAnswers };
    });
  },

  removeWrongAnswer: (id: string) => {
    set(state => {
      const newAnswers = state.wrongAnswers.filter(wa => wa.id !== id);
      setToStorage(MISTAKES_KEY, newAnswers);
      return { wrongAnswers: newAnswers };
    });
  },

  clearAll: () => {
    setToStorage(MISTAKES_KEY, []);
    set({ wrongAnswers: [] });
  },

  getUnmastered: () => {
    return get().wrongAnswers.filter(wa => !wa.mastered);
  },

  getByEquationId: (equationId: string) => {
    return get().wrongAnswers.find(wa => wa.equationId === equationId);
  },
}));
