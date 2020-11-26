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

  clear();

  log(`📌 Current version is: v${CURRENT}\n`);

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
      const child_process = _spawn(...args, {
        cwd: path.resolve(__dirname, '..'),
      });

      child_process.on('close', () => {
        resolve();
      });
    });

  const { reply } = await prompts({
    type: 'text',
    name: 'reply',
    message: chalk.hex('#3eaf7c')(
      `🔫 Will release v${RELEASE}, are you sure? (y/n)`,
    ),
  });
  if (reply === 'y' || reply === 'Y') {
    const spinner = ora(`release v${RELEASE} and publishing......`);
    spinner.start();

    await spawn('git', ['add', '-A']);
    await spawn('npm', ['version', `"v${RELEASE}"`, '-m', `"chore: release v${RELEASE}"`]);
    // git tag $VERSION
    await spawn('git', ['push']);
    await spawn('git', ['push', '--tags']);
    
    spinner.succeed();
  }
})();
