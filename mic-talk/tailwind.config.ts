import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "light_background": "url('/images/lightbackground.jpg')",
        "dark_background": "url('/images/darkbackground.jpg')",
      },
      keyframes: {
        wave1: {
          '0%': { backgroundColor: 'rgba(2,0,36,1)' }, 
          '35%': { backgroundColor: 'rgba(29,139,130,1)' },
          '100%': { backgroundColor: 'rgba(0,212,255,1)' }
        },
        wave2: {
          '0%': { backgroundColor: 'rgba(2,0,36,1))' }, 
          '33%': { backgroundColor: 'rgba(29,40,139,1)' },
          '100%': { backgroundColor: 'rgba(0,212,255,1)' } 
        },
        wave3: {
          '0%': { backgroundColor: 'rgba(0,0,0,1)' }, 
          '50%': { backgroundColor: 'rgba(139,29,39,1)' }, 
          '100%': { backgroundColor: 'rgba(255,0,0,1)' }
        },
        gradientWave: {
          '0%, 100%': {
            transform: 'scaleY(0.5)',
            background: 'linear-gradient(to right, cyan, blue)'
          },
          '50%': {
            transform: 'scaleY(1)',
            background: 'linear-gradient(to right, cyan, lightblue, blue)'
          }
        },
        barWave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1.5)' }  
        }
      },
      animation: {
        'rgb-dots1': 'wave1 3s infinite ease-in-out',
        'rgb-dots2': 'wave2 3s infinite ease-in-out',
        'rgb-dots3': 'wave3 3s infinite ease-in-out',
        'gradient-wave': 'gradientWave 2s infinite ease-in-out',
        'bar-wave': 'barWave 2s ease-in-out infinite'
      },
      animationDelay: { 
        200: '200ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
