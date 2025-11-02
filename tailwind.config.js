/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out 0.5s forwards',
        'fade-in-up-text': 'fadeInUp 1s ease-out 1s forwards',
        'fade-in-up-subtext': 'fadeInUp 1s ease-out 1.5s forwards',
        'float-bee': 'floatBee 8s ease-in-out infinite',
        'float-leaf': 'floatLeaf 10s ease-in-out infinite',
        'float-particle': 'floatParticle 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatBee: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) translateX(15px) rotate(10deg)' },
          '50%': { transform: 'translateY(-40px) translateX(30px) rotate(0deg)' },
          '75%': { transform: 'translateY(-20px) translateX(15px) rotate(-10deg)' },
          '100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
        },
        floatLeaf: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-15px) translateX(-10px) rotate(15deg)' },
          '50%': { transform: 'translateY(-30px) translateX(-20px) rotate(0deg)' },
          '75%': { transform: 'translateY(-15px) translateX(-10px) rotate(-15deg)' },
          '100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
        },
        floatParticle: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-25px) translateX(10px)' },
          '50%': { transform: 'translateY(-50px) translateX(20px)' },
          '75%': { transform: 'translateY(-25px) translateX(10px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}