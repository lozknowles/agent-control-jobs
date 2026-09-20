#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
  read,
  json,
  jobs,
  getJob,
  validate,
  validateJob,
  compatibility,
  verify,
  generated,
  safePath,
  agentTemplates,
  getAgentTemplate,
  validateAgentTemplate,
  templateReadiness,
  templateSelection,
} from "./library.mjs";
import { scaffold } from "./scaffold.mjs";
import { projectDiscovery } from "./discovery.mjs";
const [cmd = "help", arg, ...rest] = process.argv.slice(2);
const print = (x) =>
  console.log(typeof x === "string" ? x : JSON.stringify(x, null, 2));
try {
  switch (cmd) {
    case "help":
      print(
        "ac-jobs list | search TERM | inspect ID | validate [JOB-DIR] | catalogue [--check] | suite ID | compatibility ID ESTATE [CONTEXT] | provenance ID | verify ID RESULT | new DRAFT | template-list | template-search TERM | template-inspect ID | template-readiness ID JOB ESTATE [CONTEXT] | template-qualifications ID | select-template ID JOB ESTATE [CONTEXT]",
      );
      break;
    case "new":
      print(scaffold(arg));
      break;
    case "estate":
      print(projectDiscovery(read(arg), read(rest[0])));
      break;
    case "list":
      print(
        jobs().map((j) => ({
          id: j.manifest.id,
          category: j.manifest.category,
          common_job: j.manifest.common_job,
          status: j.manifest.qualification.status,
        })),
      );
      break;
    case "search":
      if (!arg) throw Error("search_term_required");
      print(
        jobs()
          .filter((j) =>
            JSON.stringify(j.manifest)
              .toLowerCase()
              .includes(arg.toLowerCase()),
          )
          .map((j) => j.manifest),
      );
      break;
    case "inspect":
      print(getJob(arg).manifest);
      break;
    case "template-list":
      print(agentTemplates().map((template) => ({id: template.manifest.id, version: template.manifest.version, description: template.manifest.description, compatible_jobs: template.manifest.compatible_jobs})));
      break;
    case "template-search":
      if (!arg) throw Error("search_term_required");
      print(agentTemplates().filter((template) => JSON.stringify(template.manifest).toLowerCase().includes(arg.toLowerCase())).map((template) => template.manifest));
      break;
    case "template-inspect": {
      const template = getAgentTemplate(arg); validateAgentTemplate(template); print(template.manifest); break;
    }
    case "template-readiness": {
      const [jobId, estate, context] = rest; print(templateReadiness(getAgentTemplate(arg), getJob(jobId), read(estate), context ? read(context) : {})); break;
    }
    case "select-template": {
      const [jobId, estate, context] = rest; print(templateSelection(getAgentTemplate(arg), getJob(jobId), read(estate), context ? read(context) : {})); break;
    }
    case "template-qualifications": {
      const records = read(path.join(ROOT, "qualifications/templates/index.json")); print(records.filter((record) => record.template_id === arg)); break;
    }
    case "provenance":
      print(getJob(arg).manifest.provenance);
      break;
    case "validate":
      if (arg) {
        const dir = path.resolve(arg);
        const j = jobs().find((j) => j.dir === dir);
        if (!j) throw Error("job_directory_not_in_library");
        validateJob(j);
        print({ valid: true, id: j.manifest.id });
      } else print(validate());
      break;
    case "catalogue": {
      const files = generated();
      for (const [p, v] of Object.entries(files)) {
        const target = path.join(ROOT, p);
        if (arg === "--check") {
          if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== v)
            throw Error(`generated_file_stale: ${p}`);
        } else {
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, v);
        }
      }
      print({ generated: Object.keys(files), check: arg === "--check" });
      break;
    }
    case "suite":
      if (!/^AC-QUAL-[A-Z-]+$/.test(arg ?? "")) throw Error("invalid_suite_id");
      print(read(safePath(ROOT, `suites/${arg}.yaml`)));
      break;
    case "compatibility":
      print(
        compatibility(getJob(arg), read(rest[0]), rest[1] ? read(rest[1]) : {}),
      );
      break;
    case "verify": {
      const v = verify(getJob(arg), read(rest[0]));
      print(v);
      if (v.verdict !== "PASS") process.exitCode = 1;
      break;
    }
    default:
      throw Error("unknown_command");
  }
} catch (e) {
  console.error(JSON.stringify({ error: e.message }));
  process.exitCode = 1;
}
