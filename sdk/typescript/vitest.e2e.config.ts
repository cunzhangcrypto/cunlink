import { defineConfig } from "vitest/config";

// Dedicated e2e config. The default vitest.config.ts excludes
// **/tests/e2e/** so plain `yarn test` runs unit tests only. The
// scripts/test-sdks-e2e.sh harness loads this config explicitly, which
// includes tests/e2e/ instead of excluding it.
//
// Two configs keeps each side's include/exclude clean — a single config
// can't simultaneously exclude tests/e2e for default runs and include
// them for harness runs, because CLI positional filters are an AND on
// top of the config's exclude, not an override.
export default defineConfig({
  test: {
    globals: true,
    include: ["tests/e2e/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
