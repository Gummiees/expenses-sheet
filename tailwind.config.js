/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      lineHeight: {
        sm: '0.875rem'
      },
      fontSize: {
        '3xl': '2rem'
      },
      backgroundOpacity: {
        85: '0.85'
      },
      colors: {
        indigo: {
          material: '#3F51B5'
        },
        deepBlue: {
          DEFAULT: '#020033'
        }
      },
      spacing: {
        auto: 'auto'
      },
      transitionProperty: {
        padding: 'padding',
        margin: 'margin',
        'bg-color': 'background-color'
      },
      transitionDuration: {
        400: '400ms'
      }
    }
  },
  plugins: [],
  important: true
};
