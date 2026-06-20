export type ReactionType = 'synthesis' | 'decomposition' | 'single-replacement' | 'double-replacement' | 'redox';

export interface ChemicalCompound {
  formula: string;
  elements: Record<string, number>;
}

export interface Equation {
  id: string;
  levelId: string;
  reactants: ChemicalCompound[];
  products: ChemicalCompound[];
  type: ReactionType;
  correctCoefficients: number[];
  hint: string;
  difficulty: number;
}

export interface Level {
  id: string;
  themeId: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3;
  equations: string[];
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  bestTime: number | null;
}

export interface ReactionTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  levels: Level[];
  unlocked: boolean;
  requiredScore: number;
}

export interface LevelResult {
  levelId: string;
  stars: number;
  timeSpent: number;
  hintsUsed: number;
  completed: boolean;
  completedAt: string;
  bestTime?: number;
}

export interface UserProgress {
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  totalHintsUsed: number;
  averageTime: number;
  lastPlayed: string;
  themes: Record<string, boolean>;
  levels: Record<string, LevelResult>;
}

export interface WrongAnswer {
  id: string;
  equationId: string;
  equationText: string;
  wrongCoefficients: number[];
  correctCoefficients: number[];
  reasoning: string;
  attempts: number;
  createdAt: string;
  mastered: boolean;
}

export interface ScoreBreakdown {
  speed: number;
  accuracy: number;
  streak: number;
  hints: number;
  knowledge: number;
}

export type HintType = 'element-stats' | 'lcm' | 'ion' | 'method';

export interface HintStep {
  id: number;
  title: string;
  content: string;
  type: HintType;
}

export interface IonData {
  formula: string;
  name: string;
  charge: string;
  type: 'cation' | 'anion' | 'polyatomic';
  example: string;
}

export interface BalanceDetail {
  element: string;
  leftCount: number;
  rightCount: number;
  balanced: boolean;
}

export interface BalanceResult {
  isBalanced: boolean;
  isSimplest: boolean;
  details: BalanceDetail[];
}

export interface GameState {
  currentLevelId: string | null;
  currentEquationIndex: number;
  coefficients: number[];
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
  attempts: number;
  isPaused: boolean;
  showResult: boolean;
  lastAnswerCorrect: boolean | null;
  isRetryMode: boolean;
  retryEquationId: string | null;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  equationId: string;
  correct: boolean;
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
  answeredAt: string;
  mastered: boolean;
}

export interface SavedGameProgress {
  levelId: string;
  equationIndex: number;
  coefficients: number[];
  elapsedTime: number;
  hintsUsed: number;
  attempts: number;
  questionResults: QuestionResult[];
  savedAt: string;
}

export interface LevelCompletionStats {
  levelId: string;
  levelName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalHintsUsed: number;
  totalTime: number;
  stars: number;
  score: number;
  reactionTypeStats: Record<string, { correct: number; total: number }>;
  questionResults: QuestionResult[];
}
