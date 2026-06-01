/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['VT323', 'monospace'],
      },
      colors: {
        retro: {
          black: '#1a1a3e',
          dark: '#252550',
          border: '#3d3d7b',
          red: '#ff6b6b',
          cyan: '#48dbfb',
          yellow: '#feca57',
          green: '#5fcf80',
          text: '#fffffe',
          mute: '#c4c6d8',
        }
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #0f0e17',
        'pixel-hover': '6px 6px 0px 0px #0f0e17',
        'glow-red': '0 0 10px #ff6b6b, 0 0 20px #ff6b6b66',
        'glow-cyan': '0 0 10px #48dbfb, 0 0 20px #48dbfb66',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'avatar-idle': 'avatarIdle 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(72, 219, 251, 0.3)' },
          '100%': { boxShadow: '0 0 15px rgba(72, 219, 251, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        avatarIdle: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-4px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(0deg)' },
          '75%': { transform: 'translateY(-4px) rotate(1deg)' },
        },
      },
    },
  },
  plugins: [],
}
