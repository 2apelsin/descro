/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Для работы с GigaChat API
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Отключаем проверку SSL для GigaChat (только для разработки)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'node:tls': 'commonjs node:tls',
        'node:https': 'commonjs node:https',
      })
    }
    return config
  },

  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
  },
}

export default nextConfig
