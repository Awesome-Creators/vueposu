#!/usr/bin/env node

(async () => {
  const args = require('minimist')(process.argv.slice(2));
  const fs = require('fs');
  const path = require('path');
  const clear = require('clear');
  const chalk = require('chalk');
  const semver = require('semver');
  const prompts = require('prompts');
  const execa = require('execa');
  const pkg = require('../package.json');

  const run = (bin, args, opts = {}) =>
    execa(bin, args, { stdio: 'inherit', ...opts });

  clear();

  const CURRENT = pkg.version || '0.0.0';
  console.log(chalk.bold(`📌 Current version is: v${CURRENT}\n`));

  const preId =
    args.preid || (semver.prerelease(CURRENT) && semver.prerelease(CURRENT)[0]);
  const versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
  ];
  let option = process.argv[2];
  if (!option) {
    ({ option } = await prompts({
      type: 'text',
      name: 'option',
      message: '✏️  Enter new version:',
      validate: v => (!v ? '🤕 Please input the correct version!' : true),
    }));
  }

  const RELEASE = versionIncrements.includes(option)
    ? semver.inc(CURRENT, option, preId)
    : option;

  const { yes } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: chalk.hex('#3eaf7c')(`🔫 Will release v${RELEASE}, are you sure?`),
  });
  if (yes) {
    pkg.version = RELEASE;
    fs.writeFileSync(
      path.resolve(__dirname, '../package.json'),
      JSON.stringify(pkg, null, 2) + '\n',
    );

    // generate changelog
    // await run(`yarn`, ['changelog']);

    await run('git', ['add', '-A']);
    await run('git', ['commit', '-m', `chore: release v${RELEASE}`]);

    await run('git', ['tag', `v${RELEASE}`]);
    await run('git', ['push']);
    await run('git', ['push', '--tags']);
  }
})();
