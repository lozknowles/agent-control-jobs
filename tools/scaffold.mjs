import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { ROOT, read, json, safePath } from "./library.mjs";
export function scaffold(inputFile, root = ROOT) {
  const draft = read(inputFile);
  for (const k of [
    "id",
    "objective",
    "category",
    "pattern",
    "source",
    "scenario",
    "expected_facts",
  ])
    if (!draft[k]) throw Error(`missing ${k}`);
  if (
    !/^[a-z][a-z0-9-]+$/.test(draft.id) ||
    !/^[a-z][a-z0-9-]+$/.test(draft.category)
  )
    throw Error("invalid identity");
  if (
    ![
      "Process Automation",
      "Worker Augmentation",
      "Enterprise Intelligence",
    ].includes(draft.pattern)
  )
    throw Error("invalid pattern");
  const dest = safePath(root, `jobs/${draft.category}/${draft.id}`);
  if (fs.existsSync(dest)) throw Error("job already exists");
  const m = read(path.join(root, "jobs/data/csv-analysis/job.yaml"));
  m.id = draft.id;
  m.name = draft.objective.replace(/\.$/, "");
  m.description = draft.objective;
  m.category = draft.category;
  m.pattern = draft.pattern;
  m.tags = [draft.category];
  m.common_job = false;
  m.provenance = [{ type: "community", reference: draft.source }];
  m.capabilities = draft.capabilities ?? ["evidence.report"];
  m.connectors = [];
  m.credentials = [];
  m.resources = [];
  m.qualification.expected_outcome = draft.expected_outcome ?? "COMPLETE";
  m.files = [
    "README.md",
    "prompt.md",
    "fixtures/input.json",
    "expected/result.json",
    "validators/assertions.json",
    "variants/live.md",
  ];
  if (draft.permission && draft.permission !== "read-only") {
    m.mutation_level = draft.permission;
    m.risk = "high";
    m.unattended_safe = false;
    m.permissions.push({ kind: draft.permission, scope: "target" });
    m.approval = {
      required: true,
      before: [draft.permission],
      binding: "job-version-digest-inputs-target-expiry",
    };
  }
  fs.mkdirSync(dest, { recursive: true });
  const write = (p, v) => {
    const abs = safePath(dest, p);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, typeof v === "string" ? v : json(v));
  };
  write("job.yaml", YAML.stringify(m));
  write("prompt.md", draft.objective + "\n");
  write("fixtures/input.json", { scenario: draft.scenario });
  const result = {
    outcome: m.qualification.expected_outcome,
    facts: draft.expected_facts,
    evidence: ["fixture:input.json"],
    actions: [],
  };
  write("expected/result.json", result);
  write("validators/assertions.json", {
    outcome: result.outcome,
    facts: result.facts,
    allowed_actions: [],
    required_evidence: result.evidence,
  });
  write(
    "README.md",
    `# ${m.name}\n\n${draft.objective}\n\nOrigin: ${draft.source}. Input: fixtures/input.json. Expected outcome: ${result.outcome}.\n\nUse the shared [runner contract](../../../docs/RUNNER.md). Add a plausible wrong answer test. Review requirements, permissions and live boundaries before contributing.\n`,
  );
  write(
    "variants/live.md",
    "# Live configuration\n\nDeclare the actual data source, connectors, credentials and target requirements here before live use. This starter is not a qualified live integration.\n",
  );
  return {
    created: path.relative(root, dest),
    next: "Review permissions and requirements; add job to relevant suites and AC-QUAL-FULL; regenerate catalogue and run checks",
  };
}
