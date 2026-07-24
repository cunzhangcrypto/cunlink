import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    // Default `yarn test` runs unit tests only. E2e lives under tests/e2e/
    // and runs via a dedicated config (vitest.e2e.config.ts) invoked from
    // scripts/test-sdks-e2e.sh. Exclude applies to CLI filters too, so a
    // plain `yarn vitest run tests/e2e` would find zero files against this
    // config by design — use the e2e config instead.
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/e2e/**"],
  },
});
