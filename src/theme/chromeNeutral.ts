export const chromeNeutral = {
  colors: {
    bg: '#0B0B0F',
    surface: '#111827',
    surface2: '#374151',
    text: '#E5E7EB',
    textMuted: '#9CA3AF',
    border: 'rgba(255,255,255,0.10)',
    accent: '#9CA3AF', // “cool silver”
    accent2: '#CBD5E1',
  },
  radius: {
    sm: '10px',
    md: '14px',
    lg: '20px',
  },
  space: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '36px',
  },
  shadow: {
    card: '0 10px 30px rgba(0,0,0,0.35)',
  },
} as const

export type AppTheme = typeof chromeNeutral
