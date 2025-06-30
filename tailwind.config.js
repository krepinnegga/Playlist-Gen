/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        spotify: {
          // Primary colors
          brand: '#1DB954', // Spotify Green
          black: '#191414', // Spotify Black
          white: '#FFFFFF',

          // Extended color palette
          green: {
            light: '#1ED760', // Light Green
            dark: '#1AA34A', // Dark Green
          },

          // Grayscale
          gray: {
            100: '#F8F8F8',
            200: '#E8E8E8',
            300: '#D8D8D8',
            400: '#B3B3B3', // Light Gray
            500: '#A0A0A0',
            600: '#535353', // Medium Gray
            700: '#404040',
            800: '#282828', // Dark Gray
            900: '#181818', // Almost Black
          },

          // Functional colors
          error: '#EB1E32',
          warning: '#FFA42B',
          success: '#1DB954',
          info: '#0D72EA',

          // Additional colors from Spotify design
          indigo: '#509BF5',
          navy: '#2D46B9',
          pink: '#FF0066',
          yellow: '#FFC864',
        },
      },
      fontFamily: {
        sans: [
          'Circular',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ], // Spotify's primary font
        mono: ['monospace'],
      },
      fontSize: {
        // Spotify's typography scale
        'display-lg': ['3.5rem', { lineHeight: '1.1' }],
        'display-md': ['2.5rem', { lineHeight: '1.2' }],
        'display-sm': ['2rem', { lineHeight: '1.3' }],
        'heading-lg': ['1.75rem', { lineHeight: '1.4' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.5' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        'body-md': ['1rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        // Spotify's spacing system (4px base)
        4.5: '1.125rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
      boxShadow: {
        'spotify-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'spotify-md': '0 4px 6px rgba(0, 0, 0, 0.15)',
        'spotify-lg': '0 10px 25px rgba(0, 0, 0, 0.2)',
        'spotify-xl': '0 20px 40px rgba(0, 0, 0, 0.25)',
        'spotify-green': '0 4px 14px 0 rgba(29, 185, 84, 0.39)',
      },
      zIndex: {
        dropdown: '100',
        sticky: '200',
        fixed: '300',
        modal: '400',
        popover: '500',
        toast: '600',
        tooltip: '700',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
