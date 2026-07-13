import containerQueries from '@tailwindcss/container-queries'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import plugin from 'tailwindcss/plugin'

const chaiBuilderTheme = {
  container: {
    center: true,
    padding: '1rem',
    screens: { '2xl': '1400px' },
  },
  fontFamily: {
    heading: 'var(--font-heading)',
    body: 'var(--font-body)',
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: 'hsl(var(--primary))',
    'primary-foreground': 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    'secondary-foreground': 'hsl(var(--secondary-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    card: 'hsl(var(--card))',
    'card-foreground': 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover))',
    'popover-foreground': 'hsl(var(--popover-foreground))',
    muted: 'hsl(var(--muted))',
    'muted-foreground': 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    'accent-foreground': 'hsl(var(--accent-foreground))',
    destructive: 'hsl(var(--destructive))',
    'destructive-foreground': 'hsl(var(--destructive-foreground))',
  },
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    
  ],
  safelist: ['max-w-full'],
  theme: {
    extend: {
      ...chaiBuilderTheme,
      colors: {
        ...chaiBuilderTheme.colors,
        surface: 'hsl(var(--surface))',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        'h1,h2,h3,h4,h5,h6': {
          fontFamily: theme('fontFamily.heading'),
        },
        body: {
          fontFamily: theme('fontFamily.body'),
          color: theme('colors.foreground'),
          backgroundColor: theme('colors.background'),
        },
      })
    }),
    containerQueries,
    forms,
    typography,
  ],
}
