import { DEFAULT_CALCULATOR_CONFIG } from '../config/calculator-config';

export function plusTen(nr: Number, options = DEFAULT_CALCULATOR_CONFIG) {
  if (options.calculatorEnabled) {
    return +nr + +10;
  }
}
