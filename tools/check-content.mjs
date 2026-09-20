import fs from "node:fs";
import path from "node:path";
import { ROOT, walk, scanText } from "./library.mjs";
const roots = [
  "assets",
  "benchmarks",
  "docs",
  "examples",
  "experiments",
  "jobs",
  "reports",
  "research",
  "agent-templates",
  "qualifications",
  "suites",
  "templates",
];
const rootFiles = ["README.md", "CONTRIBUTING.md", "SECURITY.md"];
const textExtensions = new Set([
  ".css",
  ".csv",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".yaml",
  ".yml",
]);
const paths = [
  ...rootFiles.map((file) => path.join(ROOT, file)),
  ...roots.flatMap((dir) => walk(path.join(ROOT, dir))),
].filter((file) => textExtensions.has(path.extname(file).toLowerCase()));
const forbiddenPublicEvidenceKeys = new Set([
  "endpoint",
  "host",
  "hostname",
  "ipAddress",
  "machineId",
  "networkInterfaces",
  "node",
  "nodeId",
  "privateAddress",
  "username",
]);

function findForbiddenPublicEvidenceKey(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findForbiddenPublicEvidenceKey(item);
      if (found) return found;
    }
    return null;
  }
  if (!value || typeof value !== "object") return null;
  for (const [key, item] of Object.entries(value)) {
    if (forbiddenPublicEvidenceKeys.has(key)) return key;
    const found = findForbiddenPublicEvidenceKey(item);
    if (found) return found;
  }
  return null;
}

for (const p of paths) {
  const text = fs.readFileSync(p, "utf8");
  if (scanText(text).length)
    throw Error(`content_scan_failed: ${path.relative(ROOT, p)}`);
  if (
    p.startsWith(`${path.join(ROOT, "reports")}${path.sep}`) &&
    p.endsWith(".json")
  ) {
    const forbiddenKey = findForbiddenPublicEvidenceKey(JSON.parse(text));
    if (forbiddenKey)
      throw Error(
        `private_evidence_key: ${path.relative(ROOT, p)} -> ${forbiddenKey}`,
      );
  }
  if (p.endsWith(".md"))
    for (const m of text.matchAll(/\]\(([^)]+)\)/g)) {
      const ref = m[1];
      if (/^(https?:|#)/.test(ref)) continue;
      const target = ref.split("#")[0];
      if (!fs.existsSync(path.resolve(path.dirname(p), target)))
        throw Error(`broken_document_link: ${p} -> ${ref}`);
    }
  if (p.endsWith(".html"))
    for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const ref = match[1];
      if (/^(https?:|#|data:)/.test(ref)) continue;
      const target = ref.split("#")[0];
      if (!fs.existsSync(path.resolve(path.dirname(p), target)))
        throw Error(`broken_html_link: ${p} -> ${ref}`);
    }
}
console.log(
  "content scan and local document links passed; this does not prove safety",
);
