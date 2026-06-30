export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  surface: string;
  background: string;
  success: string;
  error: string;
  warning: string;
  discount: string;
  white: string;
  black: string;
  skeletonBase: string;
  skeletonHighlight: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#003684',       // Requested primary color
  primaryDark: '#002254',   // Darker shade for active pressed states
  primaryLight: '#E6EEFA',  // Premium soft blue tint for backgrounds and selected tabs
  textPrimary: '#11151A',
  textSecondary: '#5C6470',
  textTertiary: '#9AA1AC',
  border: '#E6E8EC',
  surface: '#FFFFFF',
  background: '#F7F8FA',
  success: '#1FAE5F',
  error: '#E1463E',
  warning: '#F2A93B',
  discount: '#E1463E',
  white: '#FFFFFF',
  black: '#000000',
  skeletonBase: '#E6E8EC',
  skeletonHighlight: '#F7F8FA',
  overlay: 'rgba(0,0,0,0.4)',
};

export const darkColors: ThemeColors = {
  primary: '#246BD3',       // High contrast blue for dark mode
  primaryDark: '#003684',
  primaryLight: '#10213d',  // Subtle dark blue surface tint
  textPrimary: '#F7F8FA',
  textSecondary: '#A9B2C3',
  textTertiary: '#64718A',
  border: '#2E3545',
  surface: '#181C26',
  background: '#0F1219',
  success: '#26C26D',
  error: '#EC5B53',
  warning: '#F7B84B',
  discount: '#EC5B53',
  white: '#FFFFFF',
  black: '#000000',
  skeletonBase: '#222836',
  skeletonHighlight: '#2A3142',
  overlay: 'rgba(0,0,0,0.7)',
};

export const colors = lightColors; // Default alias
export const Colors = colors; // Backward compatibility alias
