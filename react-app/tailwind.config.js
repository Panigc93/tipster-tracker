/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        background: '#0F172A',
        surface: '#1E293B',
        'surface-secondary': '#1A202C',
        border: '#2D3748',
        'border-inner': '#334155',
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          active: '#1D4ED8',
        },
        text: {
          DEFAULT: '#E0E0E0',
          secondary: '#A0A0A0',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#6B7280',
      },
      fontFamily: {
        sans: ['FKGroteskNeue', 'Geist', 'Inter', 'sans-serif'],
        mono: ['Berkeley Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: '11px',
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '30px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '550',
        bold: '600',
      },
      spacing: {
        '1': '1px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        'slide-down': 'slide-down 200ms ease-out',
        'slide-up': 'slide-up 200ms ease-out',
      },
    },
  },
  plugins: [],
}
