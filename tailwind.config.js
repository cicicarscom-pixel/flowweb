/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0F131A',
          sidebar: '#141A23',
          card: '#1A212D',
          input: '#121721',
          text: '#9BA3AF',
          textDark: '#5E6A7A',
          textLight: '#E2E8F0',
          primary: '#0F9B6E',
          primaryHover: '#0d825c',
          border: '#2C3545',
          hover: '#1F2937',
          accent: '#6366F1'
        },
        surface: "#0c1322",
        "surface-bright": "#323949",
        "surface-container": "#141b2b",
        "surface-container-highest": "#2e3545",
        "surface-container-high": "#232a3a",
        "surface-container-low": "#141b2b",
        "surface-container-lowest": "#070e1d",
        "surface-dim": "#0c1322",
        "surface-tint": "#ddb7ff",
        "surface-variant": "#2e3545",
        primary: "#a855f7",
        secondary: "#44e2cd",
        tertiary: "#fabc4e",
        "primary-container": "#b76dff",
        "secondary-container": "#03c6b2",
        "tertiary-container": "#bd871a",
        "on-primary-container": "#400071",
        "on-secondary-container": "#004d44",
        "on-tertiary-container": "#3a2600",
        "on-primary": "#ffffff",
        "on-secondary": "#003731",
        "on-tertiary": "#432c00",
        "on-surface": "#dce2f7",
        "on-surface-variant": "#cfc2d6",
        "on-background": "#dce2f7",
        background: "#0c1322",
        "outline-variant": "#4d4354",
        outline: "#988d9f",
        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "neon-purple": "#a855f7",
        "neon-cyan": "#22d3ee",
        "neon-green": "#4ade80",
        "neon-red": "#ef4444",
        "neon-pink": "#f43f5e",
        income: "#4ade80",
        expense: "#f43f5e",
        sidebar: "#1a1a1c",
      },
      spacing: {
        "element-gap": "0.75rem",
        gutter: "1rem",
        "stack-gap": "1.5rem",
        "card-internal-padding": "1.25rem",
        "container-padding": "1rem"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'label-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-md': ['"Inter"', 'sans-serif'],
        'code-sm': ['"Inter"', 'monospace'],
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.2)',
        'neon-purple': '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.2)',
        'neon-cyan': '0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(34, 211, 238, 0.2)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'ripple': {
          'from': { width: '0', height: '0', opacity: 0.5 },
          'to': { width: '400px', height: '400px', opacity: 0, transform: 'translate(-50%, -50%)' }
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'ripple': 'ripple 0.6s linear',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
  ],
};
