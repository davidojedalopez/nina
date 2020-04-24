module.exports = {
  theme: {
    extend: {
      colors: {
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',

        accent: 'var(--color-accent)',
        'accent-warning': 'var(--color-accent-warning)',
        divider: 'var(--color-divider)',

        'primary-dark': 'var(--color-primary-dark)',
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',

        'surface-primary': 'var(--color-surface-primary)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'surface-tertiary': 'var(--color-surface-tertiary)',
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'hover', 'focus'],
  },
  plugins: [

  ],
};