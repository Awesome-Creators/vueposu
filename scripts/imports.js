const fs = require('fs');

const hooks = fs
  .readdirSync(__dirname + '/../src/hooks')
  .filter(file => file.indexOf('.ts') !== -1)
  .map(hook => hook.replace('.ts', ''));

fs.writeFileSync(
  __dirname + '/../src/index.ts',
  hooks.map(hook => `export * from './hooks/${hook}';`).join('\r\n'),
);
