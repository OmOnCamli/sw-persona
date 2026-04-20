/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3A5C',
          dark: '#0D1F33',
          light: '#2A5A8C',
        },
        secondary: {
          DEFAULT: '#2A7B9B',
          dark: '#1D5F7A',
          light: '#3A9BBF',
        },
        accent: {
          DEFAULT: '#3DADD8',
          light: '#6DC4E8',
          dark: '#2A8AB0',
        },
        surface: {
          DEFAULT: '#E8F4F8',
          dark: '#C5DDE8',
        },
        status: {
          pending: '#F59E0B',
          accepted: '#10B981',
          rejected: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
