/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    allowedDevOrigins: ['192.168.0.117'],
  },
}

module.exports = nextConfig
