# For Sure: Jahia Agentic Development Training

This repository is the starting point of the Jahia Agentic Development Training (front-end program). It holds
**For Sure**, a fictional insurance company website built as a Jahia JavaScript module.

The site works, but it was built quickly by an AI coding agent: during the training, you will find what is
wrong with it, fix it with your own agent and the [Jahia agentic harness](https://github.com/Jahia/agentic),
and prove that each fix works.

## Prerequisites

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Node.js 22](https://nodejs.org/en/download) and Yarn 4 (`corepack enable`)
- An AI coding agent: Claude Code, Codex, GitHub Copilot, Cursor, Gemini, Windsurf, Kiro, OpenCode or
  Antigravity
- An IDE ([VS Code](https://code.visualstudio.com/) recommended)

## Setup

```bash
# Install dependencies, and the browser used by the tests
yarn install
yarn playwright install chromium

# Start Jahia in Docker (the first start takes a few minutes)
docker compose up --wait

# Build the module and deploy it to Jahia
yarn build && yarn deploy

# Create the For Sure site and its content
yarn seed

# Install the Jahia agentic harness for your agent, then restart your agent
npx @jahia/agentic@latest

# Check that everything is ready
yarn check-setup
```

The harness connects Claude Code, Codex, Cursor, Gemini and OpenCode to the Jahia MCP server. GitHub
Copilot in VS Code uses `.vscode/mcp.json`. For other agents, run `yarn mcp-token` and add the configuration
it prints.

Then open the site:

- Live site: <http://localhost:8080/sites/forsure/home.html>
- Page Builder: <http://localhost:8080/jahia/page-composer/default/en/sites/forsure/home.html>
  (log in with `root` / `root1234`)

## Commands

| Command            | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `yarn build`       | Builds the module into `dist/package.tgz`                        |
| `yarn deploy`      | Deploys the build to Jahia                                       |
| `yarn seed`        | Creates the For Sure site (`yarn seed --reset` recreates it)     |
| `yarn mcp-token`   | Creates an API token and prints how to connect an agent over MCP |
| `yarn check-setup` | Checks that your environment is ready for the training           |
| `yarn test`        | Runs the end-to-end tests of `tests/`                            |
| `yarn lint`        | Runs ESLint                                                      |
| `yarn format`      | Runs Prettier                                                    |

The default credentials and URL are `root:root1234` and `http://localhost:8080`. Change them in a `.env`
file (`JAHIA_USER`, `JAHIA_HOST`) if your setup differs.

## Images

Photos from [Lorem Picsum](https://picsum.photos/) (Unsplash license).
