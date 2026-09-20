import fs from "node:fs";
import {agentTemplates, templateDigest} from "./library.mjs";
for (const template of agentTemplates()) {
  const value = templateDigest(template), file = template.manifestPath;
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/^content_digest:\s*.*$/m, `content_digest: ${value}`));
}
