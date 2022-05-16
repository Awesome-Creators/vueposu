import parseArgs from "minimist";
import fs from "fs-extra";
import path from "path";
import clear from "clear";
import semver from "semver";
import prompts from "prompts";
import run from "./run";
import pkg from "../package.json";
import logger from "./logger";

const args = parseArgs(process.argv.slice(2));

(async () => {
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
    message: logger.success(
      `🔫 Will publish v${PUBLISH_VERSION}, are you sure?`
    ),
  });
  if (yes) {
    pkg.version = PUBLISH_VERSION;
    await fs.writeFile(
      path.resolve(__dirname, "../package.json"),
      JSON.stringify(pkg, null, 2) + "\n"
    );

    // generate changelog
    // await run(`yarn`, ['changelog']);

    await run("git", ["add", "-A"]);
    await run("git", ["commit", "-m", `chore: publish v${PUBLISH_VERSION}`]);

    await run("git", ["tag", `v${PUBLISH_VERSION}`]);
    await run("git", ["push"]);
    await run("git", ["push", "--tags"]);

    console.log(
      logger.success(`🌈 Successfully published ${pkg.name}@${PUBLISH_VERSION}`)
    );
  }
})();
