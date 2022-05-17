import { copyFile, writeFile } from "fs-extra";
import path from "path";
import run from "./run";
import logger from "./logger";
import { version } from "../package.json";
import { root, packagesDir, packages } from "./build";

const META_FILES = ["LICENSE"];

const packagesNameMap = new Map();
for (const { name, pkgName } of packages) {
  packagesNameMap.set(pkgName, name);
}
const packagesName = Array.from(packagesNameMap.keys());

async function copyMetaFiles(name: string) {
  if (name === "hooks") {
    await copyFile(
      path.join(root, "README.md"),
      path.join(packagesDir, `${name}/dist/README.md`)
    );
  }
  const pkg = require(path.join(packagesDir, `${name}/package.json`));
  const { dependencies } = pkg;
  for (const pkgName in dependencies) {
    if (
      !packagesName.includes(pkgName) &&
      dependencies[pkgName] !== "workspace:*"
    ) {
      continue;
    }
    dependencies[pkgName] = require(path.join(
      packagesDir,
      `${packagesNameMap.get(pkgName)}/package.json`
    )).version;
  }
  await writeFile(
    path.join(packagesDir, `${name}/dist/package.json`),
    JSON.stringify(pkg, null, 2) + "\n"
  );
  for (const file of META_FILES) {
    await copyFile(
      path.join(root, `${file}`),
      path.join(packagesDir, `${name}/dist/${file}`)
    );
  }
}

async function publishPackages() {
  for (const { name, pkgName } of packages) {
    await copyMetaFiles(name);
    await run("npm", ["publish", "--access", "public"], {
      cwd: path.join(packagesDir, `${name}/dist`),
    });

    console.log(
      logger.success(`🌈 Successfully published ${pkgName} v${version}`)
    );
  }
}

try {
  publishPackages();
} catch (err) {
  console.log(logger.error(err));
}
