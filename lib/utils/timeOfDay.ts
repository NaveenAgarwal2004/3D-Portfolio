import { QUANTUM_COLORS } from '../constants/colors';

export function getAccentColor(): string {
  const hour = new Date().getHours();
  // Day mode: 6am-6pm = Ionized Blue
  // Night mode: 6pm-6am = Violet Accent
  return (hour >= 6 && hour < 18) 
    ? QUANTUM_COLORS.ionizedBlue 
    : QUANTUM_COLORS.violetAccent;
}

export function isDayMode(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}