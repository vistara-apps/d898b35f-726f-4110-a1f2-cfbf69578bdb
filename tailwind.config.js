/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(0, 0%, 98%)',
        error: 'hsl(0, 72.3%, 50%)',
        accent: 'hsl(217.9, 82.9%, 56.5%)',
        primary: 'hsl(217.9, 82.9%, 36.5%)',
        success: 'hsl(158.4, 44.7%, 43.7%)',
        surface: 'hsl(0, 0%, 100%)',
        textPrimary: 'hsl(217.7, 26.9%, 23.7%)',
        textSecondary: 'hsl(218.7, 10%, 41.2%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        'modal': '0 12px 32px hsla(0, 0%, 0%, 0.12)',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  plugins: [],
}
