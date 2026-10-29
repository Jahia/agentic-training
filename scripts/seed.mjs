// Creates the For Sure site and its content, then publishes it.
// Usage: yarn seed [--reset]   (--reset deletes the site first)

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { content, images, legalNotice, pages, site } from "../seed/content.mjs";

const host = process.env.JAHIA_HOST ?? "http://localhost:8080";
const authorization = `Basic ${btoa(process.env.JAHIA_USER ?? "root:root1234")}`;
const sitePath = `/sites/${site.key}`;

/** Sends a GraphQL request, with files as multipart parts when given. */
async function graphql(query, variables = {}, files = {}) {
  const headers = { authorization, origin: host };
  let body;
  if (Object.keys(files).length > 0) {
    body = new FormData();
    body.append("query", query);
    body.append("variables", JSON.stringify(variables));
    for (const [name, { data, type }] of Object.entries(files)) {
      body.append(name, new Blob([data], { type }), name);
    }
  } else {
    headers["content-type"] = "application/json";
    body = JSON.stringify({ query, variables });
  }
  const response = await fetch(`${host}/modules/graphql`, { method: "POST", headers, body });
  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

/** Runs a provisioning script (JSON is valid YAML). */
async function provision(script) {
  const response = await fetch(`${host}/modules/api/provisioning`, {
    method: "POST",
    headers: { authorization, "content-type": "application/yaml" },
    body: JSON.stringify(script),
  });
  if (!response.ok) throw new Error(`Provisioning failed: ${await response.text()}`);
}

/** Runs a Groovy script of the seed/ folder on Jahia. */
async function executeScript(file) {
  const body = new FormData();
  body.append(
    "script",
    new Blob([JSON.stringify([{ executeScript: file }])], { type: "application/yaml" }),
  );
  const data = await readFile(join(import.meta.dirname, "..", "seed", file));
  body.append("file", new Blob([data], { type: "text/plain" }), file);
  const response = await fetch(`${host}/modules/api/provisioning`, {
    method: "POST",
    headers: { authorization },
    body,
  });
  if (!response.ok) throw new Error(`Script ${file} failed: ${await response.text()}`);
}

async function siteExists() {
  const data = await graphql(
    `
      query ($path: String!) {
        jcr {
          nodesByPath(paths: [$path]) {
            uuid
          }
        }
      }
    `,
    { path: sitePath },
  ).catch(() => ({ jcr: { nodesByPath: [] } }));
  return data.jcr.nodesByPath.length > 0;
}

/** Converts a node spec of seed/content.mjs into a GraphQL node input. */
function toInput({ name, type, mixins, props = {}, i18n = {}, refs = {}, children = [] }, uuids) {
  const properties = [];
  for (const [key, value] of Object.entries(props)) {
    properties.push(Array.isArray(value) ? { name: key, values: value } : { name: key, value });
  }
  for (const [language, values] of Object.entries(i18n)) {
    for (const [key, value] of Object.entries(values)) {
      properties.push(
        Array.isArray(value)
          ? { name: key, values: value, language }
          : { name: key, value, language },
      );
    }
  }
  for (const [key, target] of Object.entries(refs)) {
    // An i18n reference is written as { en: "target" }: set for these languages only
    const entries = typeof target === "string" ? [[undefined, target]] : Object.entries(target);
    for (const [language, path] of entries) {
      const uuid = uuids.get(path);
      if (!uuid) throw new Error(`Unknown reference target: ${path}`);
      properties.push({ name: key, value: uuid, type: "WEAKREFERENCE", language });
    }
  }
  return {
    name,
    primaryNodeType: type,
    mixins,
    properties,
    children: children.map((child) => toInput(child, uuids)),
  };
}

async function addChildren(parentPath, nodes, uuids) {
  const data = await graphql(
    `
      mutation ($parent: String!, $nodes: [InputJCRNode]!) {
        jcr {
          mutateNode(pathOrId: $parent) {
            addChildrenBatch(nodes: $nodes) {
              node {
                path
                uuid
              }
            }
          }
        }
      }
    `,
    { parent: parentPath, nodes: nodes.map((node) => toInput(node, uuids)) },
  );
  for (const { node } of data.jcr.mutateNode.addChildrenBatch) uuids.set(node.path, node.uuid);
}

const reset = process.argv.includes("--reset");

if (await siteExists()) {
  if (!reset) {
    console.error(`Site ${site.key} already exists. Run "yarn seed --reset" to recreate it.`);
    process.exit(1);
  }
  console.log(`Deleting site ${site.key}...`);
  await provision([{ deleteSite: site.key, siteKey: site.key }]);
}

console.log(`Creating site ${site.key}...`);
await provision([
  {
    createSite: site.key,
    siteKey: site.key,
    title: site.title,
    templateSet: "forsure",
    locale: "en",
  },
]);
await graphql(
  `
    mutation ($path: String!, $languages: [String]!) {
      jcr {
        mutateNode(pathOrId: $path) {
          setPropertiesBatch(
            properties: [
              { name: "j:languages", values: $languages }
              { name: "j:mandatoryLanguages", values: ["en"] }
            ]
          ) {
            path
          }
        }
      }
    }
  `,
  { path: sitePath, languages: site.languages },
);

/** Maps a path (relative to the site, or a file name) to the UUID of its node. */
const uuids = new Map();

console.log(`Uploading ${images.length} images...`);
await addChildren(`${sitePath}/files`, [{ name: "images", type: "jnt:folder" }], uuids);
for (const { file, title } of images) {
  const data = await readFile(join(import.meta.dirname, "..", "seed", "images", file));
  const result = await graphql(
    `
      mutation ($folder: String!, $name: String!, $title: String!) {
        jcr {
          mutateNode(pathOrId: $folder) {
            addChild(
              name: $name
              primaryNodeType: "jnt:file"
              mixins: ["jmix:image"]
              properties: [{ name: "jcr:title", value: $title }]
            ) {
              uuid
              addChild(name: "jcr:content", primaryNodeType: "jnt:resource") {
                data: mutateProperty(name: "jcr:data") {
                  setValue(type: BINARY, value: "file")
                }
                mimeType: mutateProperty(name: "jcr:mimeType") {
                  setValue(value: "image/jpeg")
                }
              }
            }
          }
        }
      }
    `,
    { folder: `${sitePath}/files/images`, name: file, title },
    { file: { data, type: "image/jpeg" } },
  );
  uuids.set(file, result.jcr.mutateNode.addChild.uuid);
}

console.log("Creating pages...");
await addChildren(
  `${sitePath}/home`,
  pages.map(({ name, title }) => ({
    name,
    type: "jnt:page",
    props: { "j:templateName": "product" },
    i18n: { en: { "jcr:title": title.en }, fr: { "jcr:title": title.fr } },
  })),
  uuids,
);
for (const { name } of pages) uuids.set(name, uuids.get(`${sitePath}/home/${name}`));

console.log("Creating shared content...");
await addChildren(`${sitePath}/contents`, [legalNotice], uuids);
uuids.set("legal-notice", uuids.get(`${sitePath}/contents/${legalNotice.name}`));

console.log("Creating page content...");
for (const [path, nodes] of Object.entries(content)) {
  await addChildren(`${sitePath}/${path}`, nodes, uuids);
}

console.log("Publishing...");
await graphql(
  `
    mutation ($path: String!, $languages: [String]!) {
      jcr {
        mutateNode(pathOrId: $path) {
          publish(languages: $languages, publishSubNodes: true, includeSubTree: true)
        }
      }
    }
  `,
  { path: sitePath, languages: site.languages },
);

console.log("Creating visitor accounts...");
await executeScript("users.groovy");

console.log(`Done: ${host}/jahia/page-composer/default/en${sitePath}/home.html`);
