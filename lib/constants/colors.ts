export const QUANTUM_COLORS = {
  obsidian: '#030303',
  ionizedBlue: '#4D7FFF',
  violetAccent: '#8B5CF6',
  glassTint: '#E0E7FF',
  warning: '#F43F5E',
  success: '#10B981',
  neutralGray: '#6B7280',
  pureWhite: '#FFFFFF',
} as const;

export type QuantumColor = keyof typeof QUANTUM_COLORS;