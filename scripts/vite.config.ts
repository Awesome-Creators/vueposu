import path from "path";
import { defineConfig } from "vite";
import { packagesDir } from "./build";
// import dts from "vite-plugin-dts";

export default defineConfig(() => {
  const { TARGET } = process.env;
  const packageDir = path.resolve(packagesDir, TARGET);
  const resolve = (p) => path.resolve(packageDir, p);

  return {
    build: {
      lib: {
        entry: resolve("index.ts"),
        name: `VUEPOSU${TARGET !== "hooks" ? `_${TARGET.toUpperCase()}` : ""}`,
        formats: ["es", "cjs", "iife"],
        fileName: (format) => {
          return `index.${
            format === "es" ? "mjs" : format === "cjs" ? "cjs" : "iife.js"
          }`;
        },
      },
      outDir: resolve("dist"),
      rollupOptions: {
        treeshake: true,
        external: ["vue-demi", "@vueposu/swr", "@vueposu/utils"],
      },
    },
    resolve: {
      alias: {
        vueposu: path.resolve(__dirname, "../packages/hooks/index.ts"),
        "@vueposu/swr": path.resolve(__dirname, "../packages/swr/index.ts"),
        "@vueposu/utils": path.resolve(__dirname, "../packages/utils/index.ts"),
      },
      dedupe: ["vue-demi"],
    },
    optimizeDeps: {
      exclude: ["vue-demi", "@vueposu/swr", "@vueposu/utils"],
    },
    // plugins: [
    //   dts({
    //     entryRoot: path.resolve(__dirname, ".."),
    //     noEmitOnError: true,
    //     insertTypesEntry: true,
    //     rollupTypes: true
    //   }),
    // ],
  };
});
