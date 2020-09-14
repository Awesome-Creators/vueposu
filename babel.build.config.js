module.exports = {
  compact: false,
  retainLines: true,
  minified: false,
  inputSourceMap: false,
  sourceMaps: false,
  plugins: [
    [
      'module-resolver',
      {
        root: ['./dist'],
        alias: {
          '@libs': './dist/libs',
          '@hooks': './dist/hooks',
        },
      },
    ],
  ],
};
