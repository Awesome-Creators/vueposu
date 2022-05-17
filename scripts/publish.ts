import fs from "fs-extra";
import path from "path";
import run from "./run";
import logger from "./logger";
import { version } from "../package.json";
import { root, packagesDir, packages } from "./build";

const META_FILES = ["LICENSE"];
async function copyMetaFiles(name: string) {
  if (name === "hooks") {
    await fs.copyFile(
      path.join(root, "README.md"),
      path.join(packagesDir, `${name}/dist/README.md`)
    );
  }
  await fs.copyFile(
    path.join(packagesDir, `${name}/package.json`),
    path.join(packagesDir, `${name}/dist/package.json`)
  );
  for (const file of META_FILES) {
    await fs.copyFile(
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
