const withPWA = require('next-pwa')
const withCss = require('@zeit/next-css')
const withPurgeCss = require('next-purgecss')

const isProd = process.env.NODE_ENV === "production"

module.exports = withCss(withPurgeCss())

module.exports = withPWA({
    pwa: {
        disable: !isProd,
        dest: 'public'
    }
});