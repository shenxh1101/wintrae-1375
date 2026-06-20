import type { ReactionTheme, Level } from '../types';
import { getEquationsByLevelId } from './equations';

const createLevel = (
  id: string,
  themeId: string,
  name: string,
  description: string,
  difficulty: 1 | 2 | 3,
  equationCount: number,
  unlocked: boolean = false
): Level => {
  const equations = getEquationsByLevelId(id);
  return {
    id,
    themeId,
    name,
    description,
    difficulty,
    equations: equations.slice(0, equationCount).map(e => e.id),
    unlocked,
    stars: 0,
    bestTime: null,
  };
};

export const themes: ReactionTheme[] = [
  {
    id: 'theme-1',
    name: '化合与分解',
    description: '学习化合反应和分解反应的配平',
    icon: 'flask-conical',
    color: '#00d4ff',
    unlocked: true,
    requiredScore: 0,
    levels: [
      createLevel('level-1-1', 'theme-1', '化合反应入门', '最简单的化合反应配平练习', 1, 4, true),
      createLevel('level-1-2', 'theme-1', '分解反应入门', '学习分解反应的配平方法', 1, 4),
      createLevel('level-1-3', 'theme-1', '化合分解进阶', '稍有难度的化合和分解反应', 2, 3),
    ],
  },
  {
    id: 'theme-2',
    name: '置换反应',
    description: '掌握金属活动性顺序和置换反应',
    icon: 'arrow-left-right',
    color: '#ff6b35',
    unlocked: false,
    requiredScore: 300,
    levels: [
      createLevel('level-2-1', 'theme-2', '活泼金属与酸', '金属和酸的置换反应', 1, 3),
      createLevel('level-2-2', 'theme-2', '金属与盐溶液', '金属间的置换反应', 2, 3),
      createLevel('level-2-3', 'theme-2', '置换反应挑战', '铝等金属的复杂置换', 2, 3),
    ],
  },
  {
    id: 'theme-3',
    name: '复分解反应',
    description: '学习酸碱盐之间的复分解反应',
    icon: 'git-merge',
    color: '#00c853',
    unlocked: false,
    requiredScore: 800,
    levels: [
      createLevel('level-3-1', 'theme-3', '酸碱中和', '中和反应配平入门', 1, 3),
      createLevel('level-3-2', 'theme-3', '碳酸盐反应', '碳酸盐与酸和碱的反应', 2, 3),
      createLevel('level-3-3', 'theme-3', '沉淀反应', '生成沉淀的复分解反应', 2, 4),
    ],
  },
  {
    id: 'theme-4',
    name: '氧化还原',
    description: '挑战氧化还原反应的配平',
    icon: 'zap',
    color: '#ffd700',
    unlocked: false,
    requiredScore: 1500,
    levels: [
      createLevel('level-4-1', 'theme-4', '燃烧反应', '有机物和无机物的燃烧', 2, 3),
      createLevel('level-4-2', 'theme-4', '还原反应', '氢气和一氧化碳还原金属氧化物', 2, 3),
      createLevel('level-4-3', 'theme-4', '氧化还原进阶', '复杂氧化还原反应配平', 3, 4),
    ],
  },
  {
    id: 'theme-5',
    name: '综合挑战',
    description: '综合运用所有配平技巧',
    icon: 'trophy',
    color: '#ff1744',
    unlocked: false,
    requiredScore: 2500,
    levels: [
      createLevel('level-5-1', 'theme-5', '基础综合', '各种反应类型的混合练习', 2, 3),
      createLevel('level-5-2', 'theme-5', '化学与生活', '与生活相关的化学反应', 2, 3),
      createLevel('level-5-3', 'theme-5', '终极挑战', '最具挑战性的配平题目', 3, 4),
    ],
  },
];

export const getLevelById = (levelId: string): Level | undefined => {
  for (const theme of themes) {
    const level = theme.levels.find(l => l.id === levelId);
    if (level) return level;
  }
  return undefined;
};

export const getThemeById = (themeId: string): ReactionTheme | undefined => {
  return themes.find(t => t.id === themeId);
};

export const getThemeByLevelId = (levelId: string): ReactionTheme | undefined => {
  for (const theme of themes) {
    if (theme.levels.some(l => l.id === levelId)) {
      return theme;
    }
  }
  return undefined;
};

export const getAllLevels = (): Level[] => {
  return themes.flatMap(t => t.levels);
};

export const getReactionTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'synthesis': 'plus',
    'decomposition': 'scissors',
    'single-replacement': 'arrow-left-right',
    'double-replacement': 'git-merge',
    'redox': 'zap',
  };
  return icons[type] || 'help-circle';
};
