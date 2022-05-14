import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      vueposu: resolve(__dirname, "packages/hooks/index.ts"),
      "@vueposu/swr": resolve(__dirname, "packages/swr/index.ts"),
      "@vueposu/utils": resolve(__dirname, "packages/utils/index.ts"),
      "@vueposu/test-utils": resolve(__dirname, "packages/.test/index.ts"),
    },
    dedupe: ["vue-demi"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ["vue-demi"],
    },
    clearMocks: true,
  },
});
