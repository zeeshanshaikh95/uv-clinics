/**
 * UV Clinics design system — "porcelain & champagne".
 *
 * A light, clinical-luxe system: warm porcelain paper, white raised cards,
 * champagne-gold foil and a muted ultraviolet accent borrowed from the
 * clinic's own name. Deliberately the opposite of the dark obsidian/gold house
 * builds: here the page breathes, the gold is a hairline rather than a surface,
 * and soft rounded frames replace hard editorial rules.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#FBF8F2', // page ground (light)
        obsidian: '#F4EDE2', // section ground
        onyx: '#FFFFFF', // raised surfaces, cards
        graphite: '#EDE4D6', // fills, inert blocks
        'graphite-light': '#F7F1E7',

        gold: {
          50: '#FDF9EE',
          100: '#F8F0DA',
          200: '#EFE0B6',
          300: '#E0C88A',
          400: '#C6A15B', // the champagne foil
          500: '#AE8944',
          600: '#8B6C32',
          700: '#654E23',
        },

        // The "UV" in the name — a muted violet used sparingly for accents,
        // focus states and clinical touchpoints.
        uv: {
          50: '#F4F1FB',
          100: '#E9E3F7',
          200: '#D3C8EE',
          300: '#B0A0DD',
          400: '#8B78C6',
          500: '#6E5BA8',
          600: '#54447F',
          700: '#3C305C',
        },

        plum: '#3A2A3F', // dark brand ground for contrast sections
        cream: '#251D27', // primary text (dark on light)
        muted: '#6F6270', // secondary text
        faint: '#9A8D93', // tertiary text

        wine: {
          500: '#9B3341',
          600: '#7C2733',
          700: '#5C1B25',
        },

        // Aliases kept so every inherited surface still resolves to the light
        // system instead of rendering white-on-white.
        bone: '#FBF8F2',
        ivory: '#FFFFFF',
        sand: '#EFE6D8',
        clay: '#E4D8C7',
        ink: '#251D27',
        'ink-soft': '#6F6270',
        'ink-faint': '#9A8D93',
        sage: {
          50: '#F4F1FB',
          100: '#E9E3F7',
          200: '#D3C8EE',
          400: '#8B78C6',
          500: '#6E5BA8',
          600: '#EFE0B6',
          700: '#C6A15B',
          900: '#FDF9EE',
        },
        taupe: {
          100: '#F4EDE2',
          300: '#EDE4D6',
          500: '#AE8944',
          700: '#C6A15B',
        },
      },
      fontFamily: {
        display: ['Marcellus', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Manrope', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        micro: '0.32em',
        wide2: '0.16em',
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '6px',
        DEFAULT: '10px',
        md: '14px',
        lg: '22px',
        xl: '32px',
        arch: '999px 999px 18px 18px',
      },
      backgroundImage: {
        'gold-foil':
          'linear-gradient(112deg, #8B6C32 0%, #C6A15B 16%, #FBF4E1 32%, #D9BB80 48%, #AE8944 62%, #EFE0B6 78%, #C6A15B 92%, #8B6C32 100%)',
        'gold-sheen':
          'linear-gradient(180deg, rgba(198,161,91,0.14) 0%, rgba(198,161,91,0) 60%)',
        'paper-glow':
          'radial-gradient(120% 80% at 50% 0%, rgba(198,161,91,0.16) 0%, rgba(251,248,242,0) 62%)',
        'uv-glow':
          'radial-gradient(80% 70% at 70% 30%, rgba(139,120,198,0.18) 0%, rgba(251,248,242,0) 70%)',
      },
      boxShadow: {
        lift: '0 28px 60px -38px rgba(58,42,63,0.35)',
        panel: '0 40px 90px -60px rgba(58,42,63,0.45)',
        gold: '0 0 0 1px rgba(198,161,91,0.35), 0 26px 60px -38px rgba(198,161,91,0.55)',
        'gold-lift': '0 18px 50px -26px rgba(198,161,91,0.55)',
        soft: '0 18px 44px -30px rgba(58,42,63,0.32)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        silk: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.07) translate3d(0,-1.2%,0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-slow': {
          '0%': { transform: 'rotateY(0deg) rotateX(8deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(8deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(0,-16px,0) rotate(2deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,18px,0)' },
        },
        'sheen-sweep': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.5' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(26px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-18deg)' },
          '100%': { transform: 'translateX(220%) skewX(-18deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-in-right': 'slide-in-right 0.32s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'ken-burns': 'ken-burns 9s ease-out both',
        'spin-slow': 'spin-slow 26s linear infinite',
        'orbit-slow': 'orbit-slow 22s linear infinite',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 11s ease-in-out infinite',
        sheen: 'sheen-sweep 6s linear infinite',
        'pulse-ring': 'pulse-ring 4.5s ease-out infinite',
        'reveal-up': 'reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 3.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
