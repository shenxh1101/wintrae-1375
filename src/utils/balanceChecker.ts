import type { Equation, BalanceResult, BalanceDetail } from '../types';
import { calculateAtomCount, getAllElements } from './equationParser';
import { checkSimplestRatio } from './mathUtils';

export function checkBalance(
  equation: Equation,
  coefficients: number[]
): BalanceResult {
  const allCompounds = [...equation.reactants, ...equation.products];
  
  if (coefficients.length !== allCompounds.length) {
    return {
      isBalanced: false,
      isSimplest: false,
      details: [],
    };
  }

  const reactantCoeffs = coefficients.slice(0, equation.reactants.length);
  const productCoeffs = coefficients.slice(equation.reactants.length);

  const leftAtoms = calculateAtomCount(equation.reactants, reactantCoeffs);
  const rightAtoms = calculateAtomCount(equation.products, productCoeffs);

  const elements = getAllElements(equation.reactants, equation.products);
  const details: BalanceDetail[] = elements.map(element => ({
    element,
    leftCount: leftAtoms[element] || 0,
    rightCount: rightAtoms[element] || 0,
    balanced: (leftAtoms[element] || 0) === (rightAtoms[element] || 0),
  }));

  const isBalanced = details.every(d => d.balanced);
  const isSimplest = checkSimplestRatio(coefficients);

  return {
    isBalanced,
    isSimplest,
    details,
  };
}

export function getUnbalancedElements(result: BalanceResult): string[] {
  return result.details
    .filter(d => !d.balanced)
    .map(d => d.element);
}

export function validateAnswer(
  equation: Equation,
  coefficients: number[]
): {
  valid: boolean;
  errorType: 'none' | 'incomplete' | 'unbalanced' | 'not-simplest';
  message: string;
} {
  const hasZero = coefficients.some(c => c === 0);
  if (hasZero) {
    return {
      valid: false,
      errorType: 'incomplete',
      message: '请填写所有化学式前的系数',
    };
  }

  const result = checkBalance(equation, coefficients);

  if (!result.isBalanced) {
    const unbalanced = getUnbalancedElements(result);
    return {
      valid: false,
      errorType: 'unbalanced',
      message: `配平不正确：${unbalanced.join('、')} 原子数不相等`,
    };
  }

  if (!result.isSimplest) {
    return {
      valid: false,
      errorType: 'not-simplest',
      message: '系数可以化简为最简整数比',
    };
  }

  return {
    valid: true,
    errorType: 'none',
    message: '配平正确！',
  };
}
