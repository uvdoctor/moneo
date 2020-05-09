const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
      './pages/**/*.jsx',
      './pages/**/*.js',
      './public/index.html'
    ],
    css: ['./styles/tailwind.css'],
    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  })
  module.exports = {
    plugins: [
      'tailwindcss',
      'autoprefixer',
      ...process.env.NODE_ENV === 'production' ? [purgecss] : []
    ],
  };