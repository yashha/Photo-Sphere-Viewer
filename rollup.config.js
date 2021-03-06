import babel from 'rollup-plugin-babel';
import { string } from 'rollup-plugin-string';

import pkg from './package.json';

const babelConfig = {
  exclude: 'node_modules/**',
};

const banner = `/*!
* Photo Sphere Viewer ${pkg.version}
* @copyright 2014-2015 Jérémy Heleine
* @copyright 2015-${new Date().getFullYear()} Damien "Mistic" Sorel
* @licence MIT (https://opensource.org/licenses/MIT)
*/`;

export default [
  {
    input   : 'src/js/index.js',
    output  : {
      file     : 'dist/photo-sphere-viewer.js',
      name     : 'PhotoSphereViewer',
      format   : 'umd',
      sourcemap: true,
      globals  : {
        'three' : 'THREE',
        'uevent': 'uEvent'
      },
      banner   : banner
    },
    external: [
      'three',
      'uevent'
    ],
    plugins : [
      babel(babelConfig),
      string({
        include: [
          'src/icons/*.svg'
        ]
      })
    ]
  }
];
