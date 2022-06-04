/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  images: {
    // 配置项目里的图片域名
    domains: ['xxx'],
    formats: ['image/avif', 'image/webp'],
  },
  distDir: 'output',
  swcMinify: false
}

module.exports = nextConfig