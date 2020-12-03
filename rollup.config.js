const typescript = require('rollup-plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const { default: dts } = require('rollup-plugin-dts');

const { compilerOptions } = require('./tsconfig.json');
compilerOptions.declaration = false;

const umdName = 'Vueposu';
const umdGlobals = {
  'vue-demi': 'VueDemi',
  'lodash-es': '_',
  mathjs: 'mathjs',
};

module.exports = [
  {
    input: `src/index.ts`,
    output: [
      {
        file: `dist/index.cjs.js`,
        format: 'cjs',
      },
      {
        file: `dist/index.esm.js`,
        format: 'esm',
      },
      {
        file: `dist/index.umd.js`,
        format: 'umd',
        name: umdName,
        globals: umdGlobals,
      },
      {
        file: `dist/index.umd.min.js`,
        format: 'umd',
        name: umdName,
        globals: umdGlobals,
        plugins: [
          terser({
            format: {
              comments: false,
            },
          }),
        ],
      },
    ],
    plugins: [typescript(compilerOptions)],
    external: ['vue-demi', 'lodash-es', 'mathjs'],
  },
  {
    input: `src/index.ts`,
    output: {
      file: `dist/index.d.ts`,
      format: 'esm',
    },
    plugins: [dts()],
  },
];
