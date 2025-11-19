// next.config.js
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const nextConfig = {
  images: {
    remotePatterns: [
      // local dev payload API
      { protocol: 'http', hostname: '192.168.1.2', port: '3000', pathname: '/api/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/api/**' },
      { protocol: 'https', hostname: 'laura-fies-new-payload-version.vercel.app', pathname: '/**' },
    ],
  },
  reactStrictMode: true,
  redirects,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
