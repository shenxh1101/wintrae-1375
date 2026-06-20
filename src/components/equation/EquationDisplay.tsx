import type { ChemicalCompound } from '../../types';
import { CoefficientSlot } from './CoefficientSlot';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

interface EquationDisplayProps {
  reactants: ChemicalCompound[];
  products: ChemicalCompound[];
  coefficients: number[];
  onCoefficientRemove: (index: number) => void;
  disabled?: boolean;
  highlightCorrect?: boolean;
}

function renderFormula(formula: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  let i = 0;
  while (i < formula.length) {
    const char = formula[i];
    
    if (char === '(' || char === ')') {
      parts.push(<span key={key++}>{char}</span>);
      i++;
    } else if (/[A-Z]/.test(char)) {
      let element = char;
      i++;
      while (i < formula.length && /[a-z]/.test(formula[i])) {
        element += formula[i];
        i++;
      }
      parts.push(<span key={key++} className="font-semibold">{element}</span>);
    } else if (/\d/.test(char)) {
      let num = char;
      i++;
      while (i < formula.length && /\d/.test(formula[i])) {
        num += formula[i];
        i++;
      }
      parts.push(<sub key={key++} className="text-sm text-white/80">{num}</sub>);
    } else {
      parts.push(<span key={key++}>{char}</span>);
      i++;
    }
  }
  
  return parts;
}

export function EquationDisplay({
  reactants,
  products,
  coefficients,
  onCoefficientRemove,
  disabled = false,
  highlightCorrect = false,
}: EquationDisplayProps) {
  const totalCompounds = reactants.length + products.length;

  const renderCompound = (
    compound: ChemicalCompound,
    compoundIndex: number,
    isLast: boolean
  ) => {
    const slotId = `slot-${compoundIndex}`;
    const coefficient = coefficients[compoundIndex] || 0;

    return (
      <div key={compoundIndex} className="flex items-center gap-2">
        <CoefficientSlot
          id={slotId}
          value={coefficient}
          onRemove={() => onCoefficientRemove(compoundIndex)}
          index={compoundIndex}
          disabled={disabled}
        />
        <div
          className={cn(
            'px-6 py-4 rounded-xl text-2xl font-medium transition-all duration-300',
            highlightCorrect && coefficient > 0
              ? 'bg-green-500/20 border-2 border-green-400/50 text-green-300'
              : 'bg-white/5 border border-white/10 text-white'
          )}
        >
          {renderFormula(compound.formula)}
        </div>
        {!isLast && (
          <span className="text-3xl text-white/60 font-bold mx-2">+</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex flex-wrap items-center gap-4">
        {reactants.map((compound, index) =>
          renderCompound(compound, index, index === reactants.length - 1)
        )}
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/50 animate-shimmer" />
        </div>
        <ArrowRight className="w-8 h-8 text-cyan-400" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {products.map((compound, index) =>
          renderCompound(
            compound,
            reactants.length + index,
            index === products.length - 1
          )
        )}
      </div>
    </div>
  );
}
