import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RiseUp - Educational Platform',
    short_name: 'RiseUp',
    description:
      'Professional courses and educational platform for programming and technology skills',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f43b4',
    orientation: 'portrait',
    categories: ['education', 'learning', 'productivity'],
    lang: 'en',
    dir: 'auto',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      },
      {
        src: '/assets/signup/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/assets/signup/sectionImage.svg',
        sizes: '400x400',
        type: 'image/svg+xml',
        form_factor: 'wide'
      }
    ]
  };
}
