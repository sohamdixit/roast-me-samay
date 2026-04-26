/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red:        '#CC2128',
        'red-dark': '#9E161C',
        black:      '#0E0808',
        black2:     '#160C0C',
        black3:     '#241616',
        'off-white':'#F2EAE8',
        muted:      '#9A8885',
      },
      fontFamily: {
        heading: ['Boogaloo', 'cursive'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

