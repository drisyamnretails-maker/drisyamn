// lib/theme.ts - LOCKED THEME - Do not change
export const THEME = {
  // Drisyamn Logo - Welcome page exact gradient
  drisyamn: {
    gradient: 'linear-gradient(90deg, #2D2415 0%, #5A4A32 30%, #8C6F3A 65%, #B89B5E 100%)',
    solid: '#2D2415',
  },
  // Button - Welcome page exact
  button: {
    bg: '#F3EBD9',
    bgPress: '#FFFFFF',
    border: '#C8A86A',
    text: '#2D2415',
    height: '60px',
    radius: '14px',
    shadow: '0 10px 30px rgba(200,168,106,0.22), 0 2px 8px rgba(0,0,0,0.07)',
    shadowPress: 'inset 0 1px 4px rgba(0,0,0,0.08)',
    font: 'Georgia, serif',
    fontSize: '18px',
    fontWeight: '500',
  },
  // Global colors
  colors: {
    background: '#F6F1E8',
    cardBg: '#FFFFFF',
    cardBorder: '#D9C9A8',
    textMain: '#0A0A0A',
    textBody: '#5C4A32',
    textLabel: '#5C4A32',
    icon: '#8A7D6B',
    divider: 'linear-gradient(90deg, transparent 0%, #D4B483 20%, #B89B5E 50%, #D4B483 80%, transparent 100%)',
  }
} as const;