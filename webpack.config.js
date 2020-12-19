const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, 'vueposu');
const name = path.basename(packageDir);
const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`));

module.exports = {
  entry: resolve('src/index.ts'),
  output: {
    path: resolve('dist'),
    filename: 'index.js',
    library: name,
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /__test__/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/,
      }),
    ],
  },
  // cache: {
  //   // 1. Set cache type to filesystem
  //   type: 'filesystem',

  //   buildDependencies: {
  //     // 2. Add your config as buildDependency to get cache invalidation on config change
  //     config: [__filename],

  //     // 3. If you have other things the build depends on you can add them here
  //     // Note that webpack, loaders and all modules referenced from your config are automatically added
  //   },
  // },
};
