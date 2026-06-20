import type { Equation } from '../types';
import { parseCompound } from '../utils/equationParser';

const eq = (
  id: string,
  levelId: string,
  reactants: string[],
  products: string[],
  type: Equation['type'],
  correctCoefficients: number[],
  hint: string,
  difficulty: number
): Equation => ({
  id,
  levelId,
  reactants: reactants.map(parseCompound),
  products: products.map(parseCompound),
  type,
  correctCoefficients,
  hint,
  difficulty,
});

export const equations: Equation[] = [
  eq('eq-1-1', 'level-1-1', ['H2', 'O2'], ['H2O'], 'synthesis', [2, 1, 2], '先配平氢，再配平氧', 1),
  eq('eq-1-2', 'level-1-1', ['C', 'O2'], ['CO2'], 'synthesis', [1, 1, 1], '这个比较简单，碳和氧都已经配平了', 1),
  eq('eq-1-3', 'level-1-1', ['Mg', 'O2'], ['MgO'], 'synthesis', [2, 1, 2], '注意氧化镁中镁和氧的比例', 1),
  eq('eq-1-4', 'level-1-1', ['Fe', 'O2'], ['Fe3O4'], 'synthesis', [3, 2, 1], '四氧化三铁中有3个铁和4个氧', 2),
  eq('eq-1-5', 'level-1-2', ['H2O'], ['H2', 'O2'], 'decomposition', [2, 2, 1], '电解水生成氢气和氧气', 1),
  eq('eq-1-6', 'level-1-2', ['CaCO3'], ['CaO', 'CO2'], 'decomposition', [1, 1, 1], '碳酸钙高温分解', 1),
  eq('eq-1-7', 'level-1-2', ['H2CO3'], ['H2O', 'CO2'], 'decomposition', [1, 1, 1], '碳酸不稳定，容易分解', 1),
  eq('eq-1-8', 'level-1-2', ['KMnO4'], ['K2MnO4', 'MnO2', 'O2'], 'decomposition', [2, 1, 1, 1], '高锰酸钾分解，注意钾和锰的配平', 2),
  eq('eq-1-9', 'level-1-3', ['KClO3'], ['KCl', 'O2'], 'decomposition', [2, 2, 3], '氯酸钾分解制取氧气', 2),
  eq('eq-1-10', 'level-1-3', ['HgO'], ['Hg', 'O2'], 'decomposition', [2, 2, 1], '氧化汞分解', 1),

  eq('eq-2-1', 'level-2-1', ['Zn', 'H2SO4'], ['ZnSO4', 'H2'], 'single-replacement', [1, 1, 1, 1], '锌和稀硫酸反应', 1),
  eq('eq-2-2', 'level-2-1', ['Fe', 'HCl'], ['FeCl2', 'H2'], 'single-replacement', [1, 2, 1, 1], '铁和盐酸反应生成氯化亚铁', 1),
  eq('eq-2-3', 'level-2-1', ['Mg', 'HCl'], ['MgCl2', 'H2'], 'single-replacement', [1, 2, 1, 1], '镁和盐酸反应', 1),
  eq('eq-2-4', 'level-2-2', ['Cu', 'AgNO3'], ['Cu(NO3)2', 'Ag'], 'single-replacement', [1, 2, 1, 2], '铜置换硝酸银中的银', 2),
  eq('eq-2-5', 'level-2-2', ['Fe', 'CuSO4'], ['FeSO4', 'Cu'], 'single-replacement', [1, 1, 1, 1], '铁置换硫酸铜中的铜', 1),
  eq('eq-2-6', 'level-2-2', ['Zn', 'CuSO4'], ['ZnSO4', 'Cu'], 'single-replacement', [1, 1, 1, 1], '锌置换硫酸铜中的铜', 1),
  eq('eq-2-7', 'level-2-3', ['Al', 'HCl'], ['AlCl3', 'H2'], 'single-replacement', [2, 6, 2, 3], '铝和盐酸反应，注意氯化铝的化学式', 2),
  eq('eq-2-8', 'level-2-3', ['Al', 'H2SO4'], ['Al2(SO4)3', 'H2'], 'single-replacement', [2, 3, 1, 3], '铝和硫酸反应，配平原子团', 2),
  eq('eq-2-9', 'level-2-3', ['Fe', 'H2O'], ['Fe3O4', 'H2'], 'single-replacement', [3, 4, 1, 4], '铁和水蒸气反应', 3),

  eq('eq-3-1', 'level-3-1', ['NaOH', 'HCl'], ['NaCl', 'H2O'], 'double-replacement', [1, 1, 1, 1], '酸碱中和反应', 1),
  eq('eq-3-2', 'level-3-1', ['KOH', 'HNO3'], ['KNO3', 'H2O'], 'double-replacement', [1, 1, 1, 1], '氢氧化钾和硝酸反应', 1),
  eq('eq-3-3', 'level-3-1', ['NaOH', 'H2SO4'], ['Na2SO4', 'H2O'], 'double-replacement', [2, 1, 1, 2], '硫酸是二元酸，需要2个NaOH', 2),
  eq('eq-3-4', 'level-3-2', ['Na2CO3', 'HCl'], ['NaCl', 'H2O', 'CO2'], 'double-replacement', [1, 2, 2, 1, 1], '碳酸钠和盐酸反应', 2),
  eq('eq-3-5', 'level-3-2', ['CaCO3', 'HCl'], ['CaCl2', 'H2O', 'CO2'], 'double-replacement', [1, 2, 1, 1, 1], '实验室制取二氧化碳', 1),
  eq('eq-3-6', 'level-3-2', ['Na2CO3', 'Ca(OH)2'], ['NaOH', 'CaCO3'], 'double-replacement', [1, 1, 2, 1], '纯碱制烧碱', 2),
  eq('eq-3-7', 'level-3-3', ['AgNO3', 'NaCl'], ['AgCl', 'NaNO3'], 'double-replacement', [1, 1, 1, 1], '银离子和氯离子生成白色沉淀', 1),
  eq('eq-3-8', 'level-3-3', ['BaCl2', 'H2SO4'], ['BaSO4', 'HCl'], 'double-replacement', [1, 1, 1, 2], '钡离子和硫酸根生成白色沉淀', 1),
  eq('eq-3-9', 'level-3-3', ['CuSO4', 'NaOH'], ['Cu(OH)2', 'Na2SO4'], 'double-replacement', [1, 2, 1, 1], '生成蓝色氢氧化铜沉淀', 2),
  eq('eq-3-10', 'level-3-3', ['FeCl3', 'NaOH'], ['Fe(OH)3', 'NaCl'], 'double-replacement', [1, 3, 1, 3], '生成红褐色氢氧化铁沉淀', 2),

  eq('eq-4-1', 'level-4-1', ['C2H5OH', 'O2'], ['CO2', 'H2O'], 'redox', [1, 3, 2, 3], '酒精燃烧，先配碳再配氢最后配氧', 2),
  eq('eq-4-2', 'level-4-1', ['CH4', 'O2'], ['CO2', 'H2O'], 'redox', [1, 2, 1, 2], '甲烷燃烧', 2),
  eq('eq-4-3', 'level-4-1', ['CO', 'O2'], ['CO2'], 'redox', [2, 1, 2], '一氧化碳燃烧', 1),
  eq('eq-4-4', 'level-4-2', ['Fe2O3', 'CO'], ['Fe', 'CO2'], 'redox', [1, 3, 2, 3], '高炉炼铁，一氧化碳还原氧化铁', 2),
  eq('eq-4-5', 'level-4-2', ['CuO', 'H2'], ['Cu', 'H2O'], 'redox', [1, 1, 1, 1], '氢气还原氧化铜', 1),
  eq('eq-4-6', 'level-4-2', ['Fe2O3', 'H2'], ['Fe', 'H2O'], 'redox', [1, 3, 2, 3], '氢气还原氧化铁', 2),
  eq('eq-4-7', 'level-4-3', ['Cu', 'H2SO4'], ['CuSO4', 'SO2', 'H2O'], 'redox', [1, 2, 1, 1, 2], '铜和浓硫酸反应', 3),
  eq('eq-4-8', 'level-4-3', ['C', 'H2SO4'], ['CO2', 'SO2', 'H2O'], 'redox', [1, 2, 1, 2, 2], '碳和浓硫酸反应', 3),
  eq('eq-4-9', 'level-4-3', ['NO2', 'H2O'], ['HNO3', 'NO'], 'redox', [3, 1, 2, 1], '二氧化氮和水反应，歧化反应', 3),
  eq('eq-4-10', 'level-4-3', ['NH3', 'O2'], ['NO', 'H2O'], 'redox', [4, 5, 4, 6], '氨的催化氧化', 3),

  eq('eq-5-1', 'level-5-1', ['P', 'O2'], ['P2O5'], 'synthesis', [4, 5, 2], '白磷燃烧', 2),
  eq('eq-5-2', 'level-5-1', ['S', 'O2'], ['SO2'], 'synthesis', [1, 1, 1], '硫燃烧', 1),
  eq('eq-5-3', 'level-5-1', ['Na', 'O2'], ['Na2O2'], 'synthesis', [2, 1, 1], '钠在氧气中燃烧生成过氧化钠', 2),
  eq('eq-5-4', 'level-5-2', ['Fe', 'Cl2'], ['FeCl3'], 'synthesis', [2, 3, 2], '铁在氯气中燃烧', 2),
  eq('eq-5-5', 'level-5-2', ['H2', 'Cl2'], ['HCl'], 'synthesis', [1, 1, 2], '氢气在氯气中燃烧', 1),
  eq('eq-5-6', 'level-5-2', ['Cu', 'Cl2'], ['CuCl2'], 'synthesis', [1, 1, 1], '铜在氯气中燃烧', 1),
  eq('eq-5-7', 'level-5-3', ['Ca(OH)2', 'CO2'], ['CaCO3', 'H2O'], 'double-replacement', [1, 1, 1, 1], '澄清石灰水变浑浊', 1),
  eq('eq-5-8', 'level-5-3', ['NaOH', 'CO2'], ['Na2CO3', 'H2O'], 'double-replacement', [2, 1, 1, 1], '氢氧化钠吸收二氧化碳', 1),
  eq('eq-5-9', 'level-5-3', ['Fe', 'O2', 'H2O'], ['Fe(OH)3'], 'redox', [4, 3, 6, 4], '铁的吸氧腐蚀', 3),
  eq('eq-5-10', 'level-5-3', ['C2H4', 'O2'], ['CO2', 'H2O'], 'redox', [1, 3, 2, 2], '乙烯燃烧', 2),
];

export const getEquationById = (id: string): Equation | undefined => {
  return equations.find(eq => eq.id === id);
};

export const getEquationsByLevelId = (levelId: string): Equation[] => {
  return equations.filter(eq => eq.levelId === levelId);
};
