import type { Equation, HintStep } from '../types';
import { getAllElements, calculateAtomCount } from './equationParser';
import { lcmArray } from './mathUtils';

export function generateElementStatsHint(equation: Equation): HintStep {
  const elements = getAllElements(equation.reactants, equation.products);
  const leftAtoms = calculateAtomCount(equation.reactants, equation.reactants.map(() => 1));
  const rightAtoms = calculateAtomCount(equation.products, equation.products.map(() => 1));

  const elementStats = elements.map(el => {
    const left = leftAtoms[el] || 0;
    const right = rightAtoms[el] || 0;
    return `${el}: 左边${left}个, 右边${right}个`;
  }).join('\n');

  return {
    id: 1,
    title: '第一步：统计各元素原子数',
    content: `先数一数方程式两边各元素的原子数量：\n\n${elementStats}\n\n目标：让两边每种元素的原子数都相等`,
    type: 'element-stats',
  };
}

export function generateLCMHint(equation: Equation): HintStep {
  const elements = getAllElements(equation.reactants, equation.products);
  const leftAtoms = calculateAtomCount(equation.reactants, equation.reactants.map(() => 1));
  const rightAtoms = calculateAtomCount(equation.products, equation.products.map(() => 1));

  const unbalanced = elements.filter(el => (leftAtoms[el] || 0) !== (rightAtoms[el] || 0));
  
  if (unbalanced.length === 0) {
    return {
      id: 2,
      title: '第二步：找最小公倍数',
      content: '看起来所有元素都已经平衡了！检查一下系数是否为最简比。',
      type: 'lcm',
    };
  }

  const targetElement = unbalanced[0];
  const leftCount = leftAtoms[targetElement] || 1;
  const rightCount = rightAtoms[targetElement] || 1;
  const lcmValue = lcmArray([leftCount, rightCount]);

  return {
    id: 2,
    title: '第二步：找最小公倍数',
    content: `以 ${targetElement} 元素为例：\n左边有 ${leftCount} 个，右边有 ${rightCount} 个\n\n${leftCount} 和 ${rightCount} 的最小公倍数是 ${lcmValue}\n\n左边需要乘以 ${lcmValue / leftCount}\n右边需要乘以 ${lcmValue / rightCount}`,
    type: 'lcm',
  };
}

export function generateMethodHint(equation: Equation): HintStep {
  const compoundCount = equation.reactants.length + equation.products.length;
  const elementCount = getAllElements(equation.reactants, equation.products).length;

  let method = '';

  if (elementCount <= 3 && compoundCount <= 3) {
    method = '观察法：\n1. 从最复杂的化学式开始配平\n2. 依次配平其他元素\n3. 最后检查是否配平';
  } else if (equation.type === 'redox') {
    method = '氧化还原配平法：\n1. 标出化合价变化\n2. 求得失电子最小公倍数\n3. 确定氧化剂和还原剂的系数\n4. 配平其他原子';
  } else {
    method = '最小公倍数法：\n1. 找出两边各出现一次且原子数相差较大的元素\n2. 求其最小公倍数\n3. 确定该元素所在化学式的系数\n4. 再配平其他元素';
  }

  return {
    id: 3,
    title: '第三步：配平方法建议',
    content: `推荐使用以下方法配平此方程式：\n\n${method}`,
    type: 'method',
  };
}

export function generateIonHint(equation: Equation): HintStep {
  const hasPolyatomic = equation.reactants.some(c => c.formula.includes('(')) ||
    equation.products.some(c => c.formula.includes('('));

  if (hasPolyatomic) {
    return {
      id: 4,
      title: '常见离子提醒',
      content: `这个方程式中含有原子团！\n\n技巧：可以把原子团当作一个整体来配平\n\n常见原子团：\n• SO₄²⁻ (硫酸根)\n• NO₃⁻ (硝酸根)\n• CO₃²⁻ (碳酸根)\n• OH⁻ (氢氧根)\n• NH₄⁺ (铵根)\n• PO₄³⁻ (磷酸根)`,
      type: 'ion',
    };
  }

  return {
    id: 4,
    title: '化合价口诀',
    content: `记住常见元素的化合价有助于配平：\n\n• 钾钠银氢 +1价\n• 钙镁钡锌 +2价\n• 铝 +3，硅 +4\n• 铁有 +2 和 +3\n• 氧硫 -2，氯 -1\n\n单质的化合价永远是 0！`,
    type: 'ion',
  };
}

export function generateAllHints(equation: Equation): HintStep[] {
  return [
    generateElementStatsHint(equation),
    generateLCMHint(equation),
    generateMethodHint(equation),
    generateIonHint(equation),
  ];
}

export function generateBalanceReasoning(
  equation: Equation,
  correctCoefficients: number[]
): string {
  const reactantCoeffs = correctCoefficients.slice(0, equation.reactants.length);
  const productCoeffs = correctCoefficients.slice(equation.reactants.length);
  
  const leftAtoms = calculateAtomCount(equation.reactants, reactantCoeffs);
  const rightAtoms = calculateAtomCount(equation.products, productCoeffs);
  const elements = getAllElements(equation.reactants, equation.products);
  
  const verification = elements.map(el => 
    `${el}: ${leftAtoms[el]} = ${rightAtoms[el]} ✓`
  ).join('\n');

  return `配平思路：\n\n1. 观察方程式，确定各元素原子数\n2. 使用最小公倍数法配平主要元素\n3. 依次调整其他元素的系数\n4. 最后验证所有元素是否平衡\n\n系数：${correctCoefficients.join(', ')}\n\n验证：\n${verification}`;
}
