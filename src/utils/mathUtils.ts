export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function gcdArray(numbers: number[]): number {
  if (numbers.length === 0) return 1;
  return numbers.reduce((acc, num) => gcd(acc, num));
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function lcmArray(numbers: number[]): number {
  if (numbers.length === 0) return 1;
  return numbers.reduce((acc, num) => lcm(acc, num));
}

export function checkSimplestRatio(coefficients: number[]): boolean {
  const nonZero = coefficients.filter(c => c > 0);
  if (nonZero.length === 0) return true;
  const greatestCommonDivisor = gcdArray(nonZero);
  return greatestCommonDivisor === 1;
}

export function simplifyCoefficients(coefficients: number[]): number[] {
  const nonZero = coefficients.filter(c => c > 0);
  if (nonZero.length === 0) return coefficients;
  const greatestCommonDivisor = gcdArray(nonZero);
  return coefficients.map(c => c / greatestCommonDivisor);
}

export function generateCoefficientOptions(max: number = 10): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
