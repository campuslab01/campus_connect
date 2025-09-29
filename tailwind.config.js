/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0a0a0a',
        glass: 'rgba(255,255,255,0.06)',
        neon: {
          cyan: '#22d3ee',
          fuchsia: '#e879f9',
          blue: '#60a5fa',
          lime: '#a3e635',
          rose: '#fb7185',
        },
      },
      boxShadow: {
        neon: '0 0 25px rgba(34,211,238,0.25)',
        neonPink: '0 0 25px rgba(232,121,249,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
