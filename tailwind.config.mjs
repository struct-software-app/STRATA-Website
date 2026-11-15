/** @type {import('tailwindcss').Config} */
import animate from 'tailwindcss-animate';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EBEBEB',
            300: '#E0E0E0',
            400: '#B0B0B0',
            500: '#757575',
            600: '#424242',
            700: '#212121',
            800: '#141414',
            900: '#0A0A0A'
          }
        }
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 0 0 rgb(0 0 0 / 0.05)',
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'hard': '4px 4px 0px 0px #000000',
        'hard-sm': '2px 2px 0px 0px #000000',
      },
      backdropBlur: {
        xs: '2px',
      },
      dropShadow: {
        xs: '0 1px 1px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [animate],
}
