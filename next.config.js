/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    OPEN_WEATHER_APIKEY: process.env.OPEN_WEATHER_APIKEY
  }
}

module.exports = nextConfig
