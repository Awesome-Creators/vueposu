import fs from "fs-extra";
import path from "path";
// import { gzipSync } from "zlib";
// import { compress } from "brotli";
import ora from "ora";
import run from "./run";
import {
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
} from "@microsoft/api-extractor";
import logger from "./logger";

export const root = path.resolve(__dirname, "..");
export const packagesDir = path.join(root, "packages");

export const packages = fs
  .readdirSync(packagesDir)
  .filter(
    (file) =>
      file[0] !== "." && fs.statSync(path.join(packagesDir, file)).isDirectory()
  )
  .map((file) => {
    const { name, version } = require(path.join(
      packagesDir,
      `${file}/package.json`
    ));
    return {
      pkgName: name,
      name: file,
      version,
    };
  });

async function buildAllPackages() {
  console.log(logger.info(`🧹 Clean up`));
  await run("npm", ["run", "clean"]);
  console.log(logger.info(`📄 Build types`));
  await run("npm", ["run", "build:types"]);
  for (const { name, pkgName } of packages) {
    const spinner = ora(
      logger.info(`📦 Start building ${pkgName} ...`)
    ).start();

    try {
      await run("cross-env", [`TARGET=${name}`, "vite", "build"], {
        stdio: ["pipe", null],
      });
      await buildTypes(name);
      spinner.succeed(logger.success(`🚀 Successfully build ${pkgName}`));
    } catch (err) {
      spinner.fail(logger.error(err));
      process.exit(1);
    }
  }
  console.log("");
  console.log(logger.info(`🗑️  Finally clean temp`));
  await run("rimraf", ["types"]);
  console.log("");
  console.log(logger.info(`😎 Build is done !`));
}

async function buildTypes(name: string) {
  const logLevel = "none" as ExtractorLogLevel.None;
  const extractorConfig = ExtractorConfig.prepare({
    configObject: {
      projectFolder: root,
      mainEntryPointFilePath: path.join(
        root,
        `types/packages/${name}/index.d.ts`
      ),
      compiler: {
        tsconfigFilePath: path.join(root, "tsconfig.json"),
        overrideTsconfig: {
          paths: {
            vueposu: [path.join(packagesDir, "hooks/index.ts")],
          },
        },
      },
      apiReport: {
        enabled: false,
        reportFileName: "<unscopedPackageName>.api.md",
      },
      docModel: {
        enabled: false,
      },
      dtsRollup: {
        enabled: true,
        publicTrimmedFilePath: path.join(
          packagesDir,
          `${name}/dist/index.d.ts`
        ),
      },
      tsdocMetadata: {
        enabled: false,
      },
      messages: {
        compilerMessageReporting: {
          default: {
            logLevel,
          },
        },
        extractorMessageReporting: {
          default: {
            logLevel,
          },
        },
      },
    },
    configObjectFullPath: path.join(root, "api-extractor.json"),
    packageJsonFullPath: path.join(root, `package.json`),
  });
  await Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: false,
  });
}

// async function checkAllSize() {
// console.log("");
// const sizeInfos = [];
// const spinner = ora(
//   logger.info(`🔍 Now checking all packages size ...`)
// ).start();
// for (const { name, pkgName } of packages) {
//   const info: any = { pkgName, isExists: true };
//   const filePath = path.join(packagesDir, `${name}/dist/index.cjs.js`);
//   sizeInfos.push(info);
//   if (!(await fs.exists(filePath))) {
//     info.isExists = false;
//     continue;
//   }
//   const file = await fs.readFile(filePath);
//   info.minSize = (file.length / 1024).toFixed(2) + "kb";
//   info.gzippedSize = (gzipSync(file).length / 1024).toFixed(2) + "kb";
//   info.compressedSize = (compress(file).length / 1024).toFixed(2) + "kb";
// }
// spinner.succeed("🔍 Check sizes complete:");
// sizeInfos.forEach(
//   ({ pkgName, isExists, minSize, gzippedSize, compressedSize }) => {
//     console.log(
//       isExists
//         ? `${logger.success(pkgName)} -> min: ${logger.info(
//             minSize
//           )} / gzip: ${logger.info(gzippedSize)} / brotli: ${logger.info(
//             compressedSize
//           )}`
//         : logger.error(`Failed to check the size of ${pkgName}}`)
//     );
//   }
// );
// console.log("");
// }

if (require.main === module) {
  try {
    buildAllPackages();
    // buildAllPackages().then(checkAllSize);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
