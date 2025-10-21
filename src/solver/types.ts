export type Grid = string[][];

export interface Solution {
  grid: Grid;  // (rows+1) × (cols+1) の格子点配置
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
