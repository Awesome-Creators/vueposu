const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { packagesDir } = require('./scripts/build');

module.exports = env => {
  const packageDir = path.resolve(packagesDir, env.TARGET);
  const name = path.basename(packageDir);
  const resolve = p => path.resolve(packageDir, p);
  const pkg = require(resolve(`package.json`));

  return {
    entry: {
      index: resolve('src/index.ts'),
      'index.min': resolve('src/index.ts'),
    },
    output: {
      path: resolve('dist'),
      filename: '[name].js',
      library: name,
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, 'tsconfig.json'),
              },
            },
          ],
          exclude: [/node_modules/, /__tests__/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@vueposu/test-utils': path.resolve(
          __dirname,
          'packages/shared/__tests__/utils.ts',
        ),
        '@vueposu/*': path.resolve(__dirname, 'packages/*/src'),
        vueposu: path.resolve(__dirname, 'packages/vueposu/src'),
      },
    },
    mode: 'none',
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
};
