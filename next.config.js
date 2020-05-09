const withPWA = require('next-pwa')
const withTypescript = require('@zeit/next-typescript')
const isProd = process.env.NODE_ENV === "production"

module.exports = withTypescript()
module.exports = withPWA({
    pwa: {
        disable: !isProd,
        dest: 'public'
    }
});