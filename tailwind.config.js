/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        reel: {
          bg: '#08080d',
          bg2: '#0f0f16',
          bg3: '#14141c',
          surface: '#1a1a24',
          surface2: '#20202e',
          border: 'rgba(255,255,255,0.06)',
          border2: 'rgba(255,255,255,0.11)',
          text: '#ede9e3',
          text2: '#928ea0',
          text3: '#4d4a58',
          gold: '#c8a76b',
          gold2: '#e2c87a',
          teal: '#45bea0',
          red: '#e05050',
          accent: '#7b69ee',
          blue: '#5b9cf6',
          green: '#3db87a',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
