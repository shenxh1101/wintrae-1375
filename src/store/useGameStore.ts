import { create } from 'zustand';
import type { GameState } from '../types';
import { getLevelById } from '../data/levels';
import { getEquationsByLevelId } from '../data/equations';

interface GameActions {
  startLevel: (levelId: string) => void;
  setCoefficient: (index: number, value: number) => void;
  resetCoefficients: () => void;
  useHint: () => void;
  incrementAttempts: () => void;
  showResultModal: (correct: boolean) => void;
  hideResultModal: () => void;
  nextEquation: () => void;
  previousEquation: () => void;
  goToEquation: (index: number) => void;
  setElapsedTime: (time: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endLevel: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  currentLevelId: null,
  currentEquationIndex: 0,
  coefficients: [],
  startTime: 0,
  elapsedTime: 0,
  hintsUsed: 0,
  attempts: 0,
  isPaused: false,
  showResult: false,
  lastAnswerCorrect: null,
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  startLevel: (levelId: string) => {
    const level = getLevelById(levelId);
    if (!level) return;

    const equations = getEquationsByLevelId(levelId);
    if (equations.length === 0) return;

    const firstEquation = equations[0];
    const totalCompounds = firstEquation.reactants.length + firstEquation.products.length;

    set({
      currentLevelId: levelId,
      currentEquationIndex: 0,
      coefficients: new Array(totalCompounds).fill(0),
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: 0,
      attempts: 0,
      isPaused: false,
      showResult: false,
      lastAnswerCorrect: null,
    });
  },

  setCoefficient: (index: number, value: number) => {
    set(state => {
      const newCoefficients = [...state.coefficients];
      newCoefficients[index] = value;
      return { coefficients: newCoefficients };
    });
  },

  resetCoefficients: () => {
    set(state => ({
      coefficients: new Array(state.coefficients.length).fill(0),
    }));
  },

  useHint: () => {
    set(state => ({ hintsUsed: state.hintsUsed + 1 }));
  },

  incrementAttempts: () => {
    set(state => ({ attempts: state.attempts + 1 }));
  },

  showResultModal: (correct: boolean) => {
    set({ showResult: true, lastAnswerCorrect: correct });
  },

  hideResultModal: () => {
    set({ showResult: false, lastAnswerCorrect: null });
  },

  nextEquation: () => {
    const { currentLevelId, currentEquationIndex } = get();
    if (!currentLevelId) return;

    const equations = getEquationsByLevelId(currentLevelId);
    if (currentEquationIndex >= equations.length - 1) return;

    const nextIndex = currentEquationIndex + 1;
    const nextEquation = equations[nextIndex];
    const totalCompounds = nextEquation.reactants.length + nextEquation.products.length;

    set({
      currentEquationIndex: nextIndex,
      coefficients: new Array(totalCompounds).fill(0),
      attempts: 0,
      showResult: false,
      lastAnswerCorrect: null,
    });
  },

  previousEquation: () => {
    const { currentLevelId, currentEquationIndex } = get();
    if (!currentLevelId || currentEquationIndex <= 0) return;

    const equations = getEquationsByLevelId(currentLevelId);
    const prevIndex = currentEquationIndex - 1;
    const prevEquation = equations[prevIndex];
    const totalCompounds = prevEquation.reactants.length + prevEquation.products.length;

    set({
      currentEquationIndex: prevIndex,
      coefficients: new Array(totalCompounds).fill(0),
      attempts: 0,
      showResult: false,
      lastAnswerCorrect: null,
    });
  },

  goToEquation: (index: number) => {
    const { currentLevelId } = get();
    if (!currentLevelId) return;

    const equations = getEquationsByLevelId(currentLevelId);
    if (index < 0 || index >= equations.length) return;

    const equation = equations[index];
    const totalCompounds = equation.reactants.length + equation.products.length;

    set({
      currentEquationIndex: index,
      coefficients: new Array(totalCompounds).fill(0),
      attempts: 0,
      showResult: false,
      lastAnswerCorrect: null,
    });
  },

  setElapsedTime: (time: number) => {
    set({ elapsedTime: time });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  endLevel: () => {
    set(initialState);
  },

  resetGame: () => {
    set(initialState);
  },
}));
