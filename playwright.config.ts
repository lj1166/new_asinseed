import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // This suite validates one local Next dev server. Serial execution avoids
  // dev-only streaming metadata/route-compilation races across workers.
  workers: 1,
  webServer: {
    command: "pnpm --filter web dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
