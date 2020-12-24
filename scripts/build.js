#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');

const packagesDir = path.resolve(__dirname, '../packages');

const targets = fs
  .readdirSync(packagesDir)
  .filter(file => fs.statSync(path.join(packagesDir, file)).isDirectory());

console.log(targets);

exports.packagesDir = packagesDir;