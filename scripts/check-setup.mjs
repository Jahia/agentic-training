// Checks that everything is ready for the training. Send us its output.
// Usage: yarn check-setup

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const host = process.env.JAHIA_HOST ?? "http://localhost:8080";
const authorization = `Basic ${btoa(process.env.JAHIA_USER ?? "root:root1234")}`;
const root = join(import.meta.dirname, "..");

const results = [];

/** Runs one check: `run` returns a detail string on success, and throws an Error with a hint on failure. */
async function check(name, run) {
  try {
    const detail = await run();
    results.push(true);
    console.log(`✅ ${name}${detail ? `: ${detail}` : ""}`);
  } catch (error) {
    results.push(false);
    console.log(`❌ ${name}: ${error.message}`);
  }
}

async function graphql(query) {
  const response = await fetch(`${host}/modules/graphql`, {
    method: "POST",
    headers: { authorization, "origin": host, "content-type": "application/json" },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(10_000),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

const atLeast = (version, major) => Number(version.split(".")[0]) >= major;

await check("Node.js 22 or later", () => {
  const version = process.versions.node;
  if (!atLeast(version, 22)) throw new Error(`found ${version}, install Node.js 22`);
  return version;
});

await check("Yarn 4", () => {
  const version = execFileSync("yarn", ["--version"], { cwd: root, encoding: "utf8" }).trim();
  if (!atLeast(version, 4)) throw new Error(`found ${version}, run "corepack enable"`);
  return version;
});

await check("Docker", () => {
  try {
    return execFileSync("docker", ["version", "--format", "{{.Server.Version}}"], {
      encoding: "utf8",
    }).trim();
  } catch {
    throw new Error("Docker is not running: start Docker Desktop");
  }
});

await check("Jahia 8.2", async () => {
  const data = await graphql(`
    {
      admin {
        jahia {
          version {
            release
          }
        }
      }
    }
  `).catch(() => {
    throw new Error(`no answer at ${host}: run "docker compose up --wait"`);
  });
  const { release } = data.admin.jahia.version;
  if (!release.startsWith("8.2")) throw new Error(`found ${release}, expected 8.2`);
  return release;
});

const modules = await graphql(`
  {
    dashboard {
      modules {
        id
        version
      }
    }
  }
`)
  .then((data) => new Map(data.dashboard.modules.map(({ id, version }) => [id, version])))
  .catch(() => new Map());

await check("JavaScript Modules engine 1.3", () => {
  const version = modules.get("javascript-modules-engine");
  if (!version?.startsWith("1.3")) throw new Error(`found ${version ?? "nothing"}, expected 1.3`);
  return version;
});

await check("For Sure module deployed", () => {
  const version = modules.get("forsure");
  if (!version) throw new Error('run "yarn build && yarn deploy"');
  return version;
});

await check("For Sure site published in English and French", async () => {
  for (const language of ["en", "fr"]) {
    for (const page of [
      "home",
      "home/car-insurance",
      "home/health-insurance",
      "home/home-insurance",
    ]) {
      const url = `${host}/cms/render/live/${language}/sites/forsure/${page}.html`;
      const { status } = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (status !== 200) throw new Error(`${url} answered ${status}: run "yarn seed --reset"`);
    }
  }
  return "8 pages";
});

await check("Jahia MCP server", async () => {
  if (!modules.has("mcp-server")) {
    throw new Error('not installed: run "docker compose down && docker compose up --wait"');
  }
  const response = await fetch(`${host}/modules/mcp`, {
    method: "POST",
    headers: {
      authorization,
      "content-type": "application/json",
      "accept": "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    signal: AbortSignal.timeout(10_000),
  });
  const { result } = await response.json();
  return `${result.tools.length} tools (connect your agent with "yarn mcp-token")`;
});

await check("Jahia agentic harness installed", () => {
  // Every agent gets the definition checker of the harness, in its own folder
  const found = new Set();
  const search = (dir, depth) => {
    if (depth > 5) return;
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name === ".git") continue;
      const path = join(dir, name);
      if (name === "check-cnd.mjs") found.add(path.slice(root.length + 1).split("/")[0]);
      else if (statSync(path).isDirectory()) search(path, depth + 1);
    }
  };
  for (const name of readdirSync(root)) {
    if (name.startsWith(".") && statSync(join(root, name)).isDirectory())
      search(join(root, name), 1);
  }
  if (found.size === 0) throw new Error('run "npx @jahia/agentic@latest", then restart your agent');
  return [...found].join(", ");
});

await check("Test browser", async () => {
  const { chromium } = await import("@playwright/test");
  if (!existsSync(chromium.executablePath()))
    throw new Error('run "yarn playwright install chromium"');
  return "Chromium for Playwright";
});

const failed = results.filter((ok) => !ok).length;
console.log(
  failed === 0
    ? "\nAll checks passed. Last step: ask your agent to list the pages of the forsure site with the Jahia MCP server."
    : `\n${failed} check(s) failed. Fix them, or send us this output.`,
);
process.exitCode = failed === 0 ? 0 : 1;
