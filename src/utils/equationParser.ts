import type { ChemicalCompound } from '../types';

export function parseFormula(formula: string): Record<string, number> {
  const elements: Record<string, number> = {};

  const parseSegment = (seg: string, multiplier: number = 1): void => {
    let i = 0;
    while (i < seg.length) {
      if (seg[i] === '(') {
        let depth = 1;
        let j = i + 1;
        while (j < seg.length && depth > 0) {
          if (seg[j] === '(') depth++;
          if (seg[j] === ')') depth--;
          j++;
        }
        const inner = seg.substring(i + 1, j - 1);
        let numStr = '';
        while (j < seg.length && /\d/.test(seg[j])) {
          numStr += seg[j];
          j++;
        }
        const innerMultiplier = numStr ? parseInt(numStr, 10) : 1;
        parseSegment(inner, multiplier * innerMultiplier);
        i = j;
      } else if (/[A-Z]/.test(seg[i])) {
        let element = seg[i];
        i++;
        while (i < seg.length && /[a-z]/.test(seg[i])) {
          element += seg[i];
          i++;
        }
        let numStr = '';
        while (i < seg.length && /\d/.test(seg[i])) {
          numStr += seg[i];
          i++;
        }
        const count = numStr ? parseInt(numStr, 10) : 1;
        elements[element] = (elements[element] || 0) + count * multiplier;
      } else {
        i++;
      }
    }
  };

  parseSegment(formula);
  return elements;
}

export function parseCompound(formula: string): ChemicalCompound {
  return {
    formula,
    elements: parseFormula(formula),
  };
}

export function calculateAtomCount(
  compounds: ChemicalCompound[],
  coefficients: number[]
): Record<string, number> {
  const atomCount: Record<string, number> = {};

  compounds.forEach((compound, index) => {
    const coefficient = coefficients[index] || 1;
    Object.entries(compound.elements).forEach(([element, count]) => {
      atomCount[element] = (atomCount[element] || 0) + count * coefficient;
    });
  });

  return atomCount;
}

export function getAllElements(
  reactants: ChemicalCompound[],
  products: ChemicalCompound[]
): string[] {
  const elements = new Set<string>();

  reactants.forEach(compound => {
    Object.keys(compound.elements).forEach(el => elements.add(el));
  });

  products.forEach(compound => {
    Object.keys(compound.elements).forEach(el => elements.add(el));
  });

  return Array.from(elements);
}

export function formatEquationString(
  reactants: ChemicalCompound[],
  products: ChemicalCompound[],
  coefficients: number[] = []
): string {
  const reactantStr = reactants
    .map((compound, index) => {
      const coeff = coefficients[index] || 1;
      return coeff > 1 ? `${coeff}${compound.formula}` : compound.formula;
    })
    .join(' + ');

  const productStr = products
    .map((compound, index) => {
      const coeff = coefficients[reactants.length + index] || 1;
      return coeff > 1 ? `${coeff}${compound.formula}` : compound.formula;
    })
    .join(' + ');

  return `${reactantStr} → ${productStr}`;
}

export function getReactionTypeName(type: string): string {
  const names: Record<string, string> = {
    'synthesis': '化合反应',
    'decomposition': '分解反应',
    'single-replacement': '置换反应',
    'double-replacement': '复分解反应',
    'redox': '氧化还原反应',
  };
  return names[type] || type;
}

export function getReactionTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'synthesis': '多种物质生成一种物质的反应',
    'decomposition': '一种物质生成多种物质的反应',
    'single-replacement': '单质与化合物反应生成新的单质和化合物',
    'double-replacement': '两种化合物互相交换成分生成另外两种化合物',
    'redox': '有电子转移的反应',
  };
  return descriptions[type] || '';
}
