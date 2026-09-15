/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#FAF7F2',
          dark: '#F3ECE2',
          light: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#FFFFFF',
          dark: '#F7F3EC',
          light: '#E8DFD1',
          lighter: '#F0E7DA',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          50: '#FFFDF9',
          100: '#FBF7F0',
          200: '#F5EFEB',
          300: '#EAE1D4',
          400: '#DDD0BF',
        },
        sand: {
          DEFAULT: '#E8DFD1',
          dark: '#D4C6B2',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#059669',
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
          glow: 'rgba(5, 150, 105, 0.25)',
        },
        amber: {
          DEFAULT: '#D97706',
          glow: 'rgba(217, 119, 6, 0.25)',
        },
        coral: {
          DEFAULT: '#DC2626',
          glow: 'rgba(220, 38, 38, 0.25)',
        },
        violet: {
          DEFAULT: '#7C3AED',
          glow: 'rgba(124, 58, 237, 0.25)',
        },
        border: '#E8DFD1',
        textPrimary: '#1C1917',
        textMuted: '#6B6358',
      },
      animation: {
        'laser-scan': 'laserScan 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'subtleFloat 3s ease-in-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        laserScan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.9' },
          '50%': { transform: 'translateY(100%)', opacity: '0.4' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.4))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 3px rgba(124, 58, 237, 0.2))' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'glow-emerald': '0 4px 16px -2px rgba(5, 150, 105, 0.25)',
        'glow-violet': '0 4px 18px -2px rgba(124, 58, 237, 0.25)',
        'glow-amber': '0 4px 16px -2px rgba(217, 119, 6, 0.25)',
        'glow-coral': '0 4px 16px -2px rgba(220, 38, 38, 0.25)',
        'glass': '0 4px 24px -2px rgba(90, 70, 40, 0.06)',
      }
    },
  },
  plugins: [],
}
