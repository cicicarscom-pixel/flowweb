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
        // Workigom Flow marka paleti — mobil uygulamayla (src/core/theme/designSystem.js)
        // birebir uyumlu. Kullanılan HER class adı (primary, secondary, on-surface vb.)
        // korunuyor, sadece hex değerleri güncellendi.
        brand: {
          primary: '#FF7A59',   // Mercan — asistanın/AI'ın kendi rengi
          secondary: '#22B573', // Zümrüt — muhasebe/finans
        },
        dark: {
          surface: '#17151A',
          card: '#201D24',
          border: 'rgba(255,247,240,0.08)',
          muted: '#A79E96',
        },
        income: '#22B573',
        expense: '#EF4444',
        sidebar: '#1A1D26',

        primary: '#FF7A59',
        secondary: '#22B573',
        tertiary: '#C2478D',
        'on-surface': '#F6F1EC',
        'on-surface-variant': '#A79E96',
        'on-background': '#F6F1EC',
        background: '#17151A',
        surface: '#17151A',
        'surface-container': '#201D24',
        'surface-container-high': '#2A2631',
        'outline-variant': 'rgba(255,247,240,0.08)',
        error: '#EF4444',
        warning: '#F59E0B',
      },
      fontSize: {
        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-sm": ["18px", { "lineHeight": "28px", "fontWeight": "600" }],
        "label-sm": ["11px", { "lineHeight": "14px", "fontWeight": "600" }],
        "label-md": ["13px", { "lineHeight": "18px", "fontWeight": "500" }],
        "body-sm": ["12px", { "lineHeight": "16px", "fontWeight": "400" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-md-mobile": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "headline-md": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "display-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      },
      spacing: {
        "element-gap": "0.75rem",
        gutter: "1rem",
        "stack-gap": "1.5rem",
        "card-internal-padding": "1.25rem",
        "container-padding": "1rem",
        "card-padding": "20px",
        "gutter-md": "16px",
        "container-margin": "24px",
        "section-gap": "32px",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'code-sm': ['"Inter"', 'monospace'],
        "body-md": ["Inter"],
        "headline-sm": ["Inter"],
        "label-sm": ["Inter"],
        "label-md": ["Inter"],
        "body-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-md-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "display-lg": ["Inter"]
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
