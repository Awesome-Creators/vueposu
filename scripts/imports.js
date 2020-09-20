const fs = require('fs');

const hooks = fs
  .readdirSync(__dirname + '/../src/hooks')
  .filter(file => file.indexOf('.ts') !== -1)
  .map(hook => hook.replace('.ts', ''));

fs.writeFileSync(
  __dirname + '/../src/index.ts',
  `
${hooks.map(hook => `import ${hook} from './hooks/${hook}';`).join('\r\n')}

export {
  ${hooks.map(hook => hook + ',').join('\r\n  ')}
}
`,
);
