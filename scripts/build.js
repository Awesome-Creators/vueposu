#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { gzipSync } = require('zlib');
const { compress } = require('brotli');
const ora = require('ora');
const run = require('./run');

const packagesDir = (exports.packagesDir = path.resolve(
  __dirname,
  '../packages',
));

const packages = fs
  .readdirSync(packagesDir)
  .filter(file => fs.statSync(path.join(packagesDir, file)).isDirectory())
  .map(file => {
    const { name = '', buildOptions = {} } = require(path.join(
      packagesDir,
      `${file}/package.json`,
    ));
    return {
      ...buildOptions,
      pkgName: name,
      name: file,
    };
  })
  .sort((a, b) => a?.priority > b?.priority);

if (require.main === module) {
  async function buildAll() {
    for (let package of packages) {
      const { name, pkgName, globalName } = package;
      const spinner = ora(
        chalk.bold(`📦 Start building ${pkgName} ...`),
      ).start();

      try {
        await run(
          'webpack',
          ['--env', `TARGET=${name}`, '--env', `LIBRARY=${globalName}`],
          {
            stdio: ['pipe', null],
          },
        );
        spinner.succeed(
          chalk.bold.hex('#3eaf7c')(`🚀 Successfully build ${pkgName}`),
        );
      } catch (err) {
        spinner.fail(chalk.bold.red(err));
        process.exit(1);
      }
    }
  }

  function checkAllSize() {
    console.log('');
    const sizeInfos = [];
    const spinner = ora(
      chalk.bold(`🔍 Now checking all package sizes ...`),
    ).start();
    for (let package of packages) {
      const { name, pkgName } = package;
      const info = { pkgName, isExists: true };
      const filePath = path.join(packagesDir, `${name}/dist/index.min.js`);
      sizeInfos.push(info);

      if (!fs.existsSync(filePath)) {
        info.isExists = false;
        continue;
      }

      const file = fs.readFileSync(filePath);
      info.minSize = (file.length / 1024).toFixed(2) + 'kb';
      info.gzippedSize = (gzipSync(file).length / 1024).toFixed(2) + 'kb';
      info.compressedSize = (compress(file).length / 1024).toFixed(2) + 'kb';
    }
    spinner.succeed('🔍 Check sizes complete:');

    sizeInfos.forEach(
      ({ pkgName, isExists, minSize, gzippedSize, compressedSize }) => {
        console.log(
          isExists
            ? `${chalk.bold.hex('#3eaf7c')(pkgName)} -> min:${chalk.bold(
                minSize,
              )} / gzip:${chalk.bold(gzippedSize)} / brotli:${chalk.bold(
                compressedSize,
              )}`
            : chalk.bold.red(`Failed to check the size of ${pkgName}}`),
        );
      },
    );
    console.log('');
  }

  buildAll().then(checkAllSize);
}
