/**
 * Design Token Type Definitions
 * 
 * TypeScript types for the EcoTrack design system tokens.
 * These types ensure type safety when using design tokens in components.
 */

// ===== Color Tokens =====

export type ColorToken =
  // Primary colors
  | 'green'
  | 'green-dark'
  | 'green-light'
  // Neutral colors
  | 'ink'
  | 'muted'
  | 'line'
  | 'cream'
  | 'background'
  // Semantic colors
  | 'success'
  | 'warning'
  | 'error'
  // Chart colors
  | 'transport'
  | 'electricity'
  | 'food'
  | 'waste'
  | 'travel'
  // Feature backgrounds
  | 'mint'
  | 'sky'
  | 'cream-alt';

export interface ColorPalette {
  green: string;
  'green-dark': string;
  'green-light': string;
  ink: string;
  muted: string;
  line: string;
  cream: string;
  background: string;
  success: string;
  warning: string;
  error: string;
  transport: string;
  electricity: string;
  food: string;
  waste: string;
  travel: string;
  mint: string;
  sky: string;
  'cream-alt': string;
}

// ===== Typography Tokens =====

export type FontFamily = 'body' | 'display';

export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type LineHeight = 'tight' | 'snug' | 'normal' | 'relaxed';

export type LetterSpacing =
  | 'tighter'
  | 'tight'
  | 'normal'
  | 'wide'
  | 'wider'
  | 'widest';

export interface TypographyTokens {
  fontFamily: {
    body: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

// ===== Spacing Tokens =====

export type SpacingToken =
  | 'space-1'
  | 'space-2'
  | 'space-3'
  | 'space-4'
  | 'space-5'
  | 'space-6'
  | 'space-7'
  | 'space-8'
  | 'space-9'
  | 'space-10';

export type PaddingToken = 'sm' | 'md' | 'lg' | 'xl';

export type GapToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SpacingTokens {
  space: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
  };
  padding: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  gap: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// ===== Border Radius Tokens =====

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle';

export type ComponentRadiusToken = 'button' | 'card' | 'input' | 'badge';

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
  circle: string;
  button: string;
  card: string;
  input: string;
  badge: string;
}

// ===== Shadow Tokens =====

export type ShadowToken = 'sm' | 'md' | 'lg' | 'xl';

export type ComponentShadowToken =
  | 'button'
  | 'button-hover'
  | 'card'
  | 'card-hover';

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  button: string;
  'button-hover': string;
  card: string;
  'card-hover': string;
}

// ===== Transition Tokens =====

export type TransitionSpeed = 'fast' | 'base' | 'slow' | 'smooth';

export interface TransitionTokens {
  fast: string;
  base: string;
  slow: string;
  smooth: string;
}

// ===== Responsive Tokens =====

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface BreakpointTokens {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

// ===== Z-Index Tokens =====

export type ZIndexToken =
  | 'base'
  | 'dropdown'
  | 'sticky'
  | 'fixed'
  | 'overlay'
  | 'modal'
  | 'tooltip';

export interface ZIndexTokens {
  base: number;
  dropdown: number;
  sticky: number;
  fixed: number;
  overlay: number;
  modal: number;
  tooltip: number;
}

// ===== Complete Design System =====

export interface DesignSystem {
  colors: ColorPalette;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  transitions: TransitionTokens;
  breakpoints: BreakpointTokens;
  zIndex: ZIndexTokens;
}

// ===== Component Variant Types =====

export type ButtonVariant = 'primary' | 'ghost' | 'light';
export type ButtonSize = 'small' | 'medium' | 'large';

export type CardVariant = 'default' | 'feature-mint' | 'feature-sky' | 'feature-cream';
export type CardPadding = 'compact' | 'standard' | 'large';

export type InputVariant = 'default' | 'error';

// ===== Category Types =====

export type CategoryType = 'transportation' | 'electricity' | 'food' | 'waste' | 'travel';

export interface CategoryConfig {
  label: string;
  color: ColorToken;
  icon: string;
}

// ===== Animation Types =====

export interface AnimationConfig {
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay?: number;
}

// ===== Theme Types =====

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: ColorToken;
  accentColor: ColorToken;
}

// ===== Utility Types =====

/**
 * Helper type to get CSS variable name from token
 */
export type CSSVarName<T extends string> = `--${T}`;

/**
 * Helper type to create CSS variable reference
 */
export type CSSVar<T extends string> = `var(--${T})`;

/**
 * Extract token value type
 */
export type TokenValue = string | number;

/**
 * Token map structure
 */
export type TokenMap<T extends string = string> = Record<T, TokenValue>;
