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

  const CURRENT = pkg.version || "0.0.0";
  console.log(logger.info(`📌 Current version is: v${CURRENT}\n`));

  const preId =
    args.preid || (semver.prerelease(CURRENT) && semver.prerelease(CURRENT)[0]);
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

  const RELEASE = versionIncrements.includes(option)
    ? semver.inc(CURRENT, option, preId)
    : option;

  const { yes } = await prompts({
    type: "confirm",
    name: "yes",
    message: logger.success(`🔫 Will release v${RELEASE}, are you sure?`),
  });
  if (yes) {
    pkg.version = RELEASE;
    await fs.writeFile(
      path.resolve(__dirname, "../package.json"),
      JSON.stringify(pkg, null, 2) + "\n"
    );

    // generate changelog
    // await run(`yarn`, ['changelog']);

    await run("git", ["add", "-A"]);
    await run("git", ["commit", "-m", `chore: release v${RELEASE}`]);

    await run("git", ["tag", `v${RELEASE}`]);
    await run("git", ["push"]);
    await run("git", ["push", "--tags"]);

    console.log(
      logger.success(`🌈 Successfully published ${pkg.name}@${RELEASE}`)
    );
  }
})();
