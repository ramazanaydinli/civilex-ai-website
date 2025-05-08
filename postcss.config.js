module.exports = {
  plugins: [
    require('postcss-import'),
    require('@tailwindcss/postcss'),  // Changed from require('tailwindcss')
    require('autoprefixer')
  ]
}