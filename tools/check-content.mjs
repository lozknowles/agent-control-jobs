import fs from "node:fs";
import path from "node:path";
import { ROOT, walk, scanText } from "./library.mjs";
const roots = ["jobs", "suites", "research", "docs", "examples", "templates"];
for (const dir of roots)
  for (const p of walk(path.join(ROOT, dir))) {
    const text = fs.readFileSync(p, "utf8");
    if (scanText(text).length)
      throw Error(`content_scan_failed: ${path.relative(ROOT, p)}`);
    if (p.endsWith(".md"))
      for (const m of text.matchAll(/\]\(([^)]+)\)/g)) {
        const ref = m[1];
        if (/^(https?:|#)/.test(ref)) continue;
        const target = ref.split("#")[0];
        if (!fs.existsSync(path.resolve(path.dirname(p), target)))
          throw Error(`broken_document_link: ${p} -> ${ref}`);
      }
  }
console.log(
  "content scan and local document links passed; this does not prove safety",
);
