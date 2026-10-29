import { defineConfig, devices } from "@playwright/test";

// Tests run against the Jahia started by `docker compose up`
export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: process.env.JAHIA_HOST ?? "http://localhost:8080",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
