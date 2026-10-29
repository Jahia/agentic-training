// Creates a personal API token for root, and prints how to connect an AI agent to the Jahia MCP server.
// Usage: yarn mcp-token

const host = process.env.JAHIA_HOST ?? "http://localhost:8080";
const authorization = `Basic ${btoa(process.env.JAHIA_USER ?? "root:root1234")}`;

const response = await fetch(`${host}/modules/graphql`, {
  method: "POST",
  headers: { authorization, "origin": host, "content-type": "application/json" },
  body: JSON.stringify({
    query: `mutation ($name: String!) {
      admin { personalApiTokens { createToken(name: $name, state: ACTIVE) } }
    }`,
    variables: { name: `mcp-${Date.now()}` },
  }),
});
const { data, errors } = await response.json();
if (errors) throw new Error(JSON.stringify(errors, null, 2));
const token = data.admin.personalApiTokens.createToken;

console.log(`MCP endpoint: ${host}/modules/mcp
Header:       Authorization: APIToken ${token}

Claude Code:
  claude mcp add --transport http jahia ${host}/modules/mcp --header "Authorization: APIToken ${token}"

Other agents (JSON configuration):
${JSON.stringify(
  {
    jahia: {
      type: "http",
      url: `${host}/modules/mcp`,
      headers: { Authorization: `APIToken ${token}` },
    },
  },
  null,
  2,
)}`);
