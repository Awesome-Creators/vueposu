#!/usr/bin/env node

(async () => {
  const clear = require('clear');
  const chalk = require('chalk');
  const prompts = require('prompts');
  const ora = require('ora');
  const semver = require('semver');
  const _spawn = require('child_process').spawn;
  const path = require('path');

  const log = content => console.log(chalk.bold(content));

  const CURRENT = process.env.npm_package_version || '0.0.0';
  let option = process.argv[2];
  if (!option) {
    ({ option } = await prompts({
      type: 'text',
      name: 'option',
      message: '✏️  Enter new version:',
      validate: v => (!v ? '🤕 Please input the correct version!' : true),
    }));
  }

  const RELEASE =
    option === 'major' || option === 'minor' || option === 'patch'
      ? semver.inc(CURRENT, option)
      : option;

  const spawn = async (...args) =>
    new Promise(resolve => {
      const process = _spawn(...args, {
        cwd: path.resolve(__dirname, '..'),
      });

      process.on('close', () => {
        resolve();
      });
    });

  clear();

  log(`📌 Current version is: v${CURRENT}\n`);

  const { reply } = await prompts({
    type: 'text',
    name: 'reply',
    message: chalk.hex('#3eaf7c')(
      `🔫 Will release v${RELEASE}, are you sure? (y/n)`,
    ),
  });
  if (reply === 'y' || reply === 'Y') {
    const process = ora(`release v${RELEASE} and publishing......`);
    process.start();

    await spawn('git', ['add', '-A']);
    await spawn('npm', ['version', `"${RELEASE}"`, '-m', `chore: release ${RELEASE}`]);
    // git tag $VERSION
    await spawn('git', ['push']);
    await spawn('git', ['push', '--tags']);
    process.succeed();
  }
})();
