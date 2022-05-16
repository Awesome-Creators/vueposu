import parseArgs from "minimist";
import fs from "fs-extra";
import path from "path";
import clear from "clear";
import semver from "semver";
import prompts from "prompts";
import run from "./run";
import pkg from "../package.json";
import { packagesDir, packages } from "./build";
import logger from "./logger";

const args = parseArgs(process.argv.slice(2));

async function pushTag() {
  clear();

  const CURRENT_VERSION = pkg.version || "0.0.0";
  console.log(logger.info(`📌 Current version is: v${CURRENT_VERSION}\n`));

  const preId =
    args.preid ||
    (semver.prerelease(CURRENT_VERSION) &&
      semver.prerelease(CURRENT_VERSION)[0]);
  const versionIncrements = [
    "patch",
    "minor",
    "major",
    ...(preId ? ["prepatch", "preminor", "premajor", "prerelease"] : []),
  ];
  let option = process.argv[2];
  if (!option) {
    ({ option } = await prompts({
      type: "text",
      name: "option",
      message: "✏️  Enter new version:",
      validate: (v) => (!v ? "🤕 Please input the correct version!" : true),
    }));
  }

  const PUBLISH_VERSION = versionIncrements.includes(option)
    ? semver.inc(CURRENT_VERSION, option, preId)
    : option;

  const { yes } = await prompts({
    type: "confirm",
    name: "yes",
    message: logger.success(`🔫 Will push v${PUBLISH_VERSION}, are you sure?`),
  });

  if (yes) {
    for (const { name } of packages) {
      const packageJsonPath = path.join(packagesDir, `${name}/package.json`);
      const packageJson = await fs.readFile(packageJsonPath);
      packageJson.version = PUBLISH_VERSION;
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n"
      );
    }

    // WIP: generate changelog

    await run("git", ["add", "-A"]);
    await run("git", ["commit", "-m", `chore: push v${PUBLISH_VERSION}`]);

    await run("git", ["tag", `v${PUBLISH_VERSION}`]);
    await run("git", ["push"]);
    await run("git", ["push", "--tags"]);

    console.log(
      logger.success(`🌈 Successfully pushed ${pkg.name} v${PUBLISH_VERSION}`)
    );
  }
}

pushTag();
