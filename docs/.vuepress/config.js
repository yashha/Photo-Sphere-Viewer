const path = require('path');

module.exports = {
  dest       : './public',
  title      : 'Photo Sphere Viewer',
  description: 'A JavaScript library to display Photo Sphere panoramas',
  head       : [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  themeConfig: {
    logo        : '/favicon.png',
    smoothScroll: true,
    sidebarDepth: 3,
    nav         : [
      { text: 'Guide', link: '/getting-started' },
      { text: 'API', link: 'https://photo-sphere-viewer.js.org/api/' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'GitHub', link: 'https://github.com/mistic100/Photo-Sphere-Viewer' }
    ],
    sidebar     : [
      {
        title       : 'Guide',
        sidebarDepth: 3,
        collapsable : false,
        children    : [
          'getting-started',
          'config',
          'methods-events',
          'navbar',
          'markers',
          'cropped-panorama',
          'migration-v3'
        ]
      }
    ]
  },
  plugins    : [
    ['@vuepress/google-analytics', {
      'ga': 'UA-28192323-3'
    }],
    ['@vuepress/back-to-top'],
    ['@vuepress/active-header-links']
  ],
  alias      : {
    'photo-sphere-viewer'           : path.resolve(process.cwd(), 'src/js/index.js'),
    'photo-sphere-viewer-stylesheet': path.resolve(process.cwd(), 'dist/photo-sphere-viewer.css')
  },
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(path.resolve(process.cwd(), 'src')).end();

    config.module
      .rule('rawsvg')
      .test(/\.svg(\?.*)?$/)
      .include.add(path.resolve(process.cwd(), 'src')).end()
      .use('raw-loader')
      .loader('raw-loader');
  }
};
