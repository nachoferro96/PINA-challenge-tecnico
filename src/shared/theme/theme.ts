import {useColorScheme} from 'react-native';

const lightColors = {
  background: '#FFFFFF',
  surface: '#F3F5F7',
  surfaceStrong: '#E9EDF1',
  text: '#17202A',
  textSecondary: '#667281',
  divider: '#DDE2E7',
  accent: '#C92542',
  accentSoft: '#FBE7EA',
  warning: '#A86600',
  warningSoft: '#FFF2D6',
  success: '#08783E',
  successSoft: '#DFF3E8',
  info: '#315C85',
  infoSoft: '#E5EEF7',
  overlay: 'rgba(23, 32, 42, 0.08)',
} as const;

const darkColors = {
  background: '#101418',
  surface: '#1A2026',
  surfaceStrong: '#262E36',
  text: '#F5F7F8',
  textSecondary: '#AAB4BE',
  divider: '#303943',
  accent: '#FF6B81',
  accentSoft: '#42212A',
  warning: '#FFC45C',
  warningSoft: '#3A2C15',
  success: '#62D69A',
  successSoft: '#153927',
  info: '#91BDE8',
  infoSoft: '#1A3248',
  overlay: 'rgba(0, 0, 0, 0.28)',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radii = {sm: 10, md: 14, pill: 999} as const;

export function useAppTheme() {
  const mode = useColorScheme();
  const isDark = mode === 'dark';

  return {isDark, colors: isDark ? darkColors : lightColors};
}

export type AppColors = ReturnType<typeof useAppTheme>['colors'];

