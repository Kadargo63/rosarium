import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rosarium',
    short_name: 'Rosarium',
    description: 'Precision rose intelligence system',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#be185d',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}