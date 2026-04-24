/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Для работы с GigaChat API
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Пустой turbopack config чтобы убрать warning
  turbopack: {},
}

export default nextConfig
