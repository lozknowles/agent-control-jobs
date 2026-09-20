import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import YAML from "yaml";
export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const digest = (b) =>
  crypto.createHash("sha256").update(b).digest("hex");
export const json = (x) => JSON.stringify(x, null, 2) + "\n";
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  coerceTypes: false,
  validateFormats: false,
});
export function read(p) {
  const s = fs.statSync(p);
  if (s.size > 1024 * 1024) throw Error("input_too_large");
  return YAML.parse(fs.readFileSync(p, "utf8"), {
    maxAliasCount: 0,
    uniqueKeys: true,
  });
}
export function safePath(root, rel) {
  if (
    typeof rel !== "string" ||
    !rel ||
    rel.includes("\\") ||
    rel.split("/").some((x) => !x || x === ".." || x === ".") ||
    path.isAbsolute(rel) ||
    rel.includes(":")
  )
    throw Error("unsafe_path");
  const resolved = path.resolve(root, rel);
  const realRoot = fs.realpathSync(root);
  let cursor = root;
  for (const part of rel.split("/")) {
    cursor = path.join(cursor, part);
    if (fs.existsSync(cursor) && fs.lstatSync(cursor).isSymbolicLink())
      throw Error("symlink_forbidden");
  }
  if (!resolved.startsWith(path.resolve(root) + path.sep))
    throw Error("path_escape");
  if (
    fs.existsSync(resolved) &&
    !fs.realpathSync(resolved).startsWith(realRoot + path.sep)
  )
    throw Error("realpath_escape");
  return resolved;
}
export function walk(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const ent of fs
    .readdirSync(root, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : 1))) {
    if (ent.isSymbolicLink()) throw Error("symlink_forbidden");
    const p = path.join(root, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile()) out.push(p);
    else throw Error("nonregular_file");
  }
  return out;
}
export function schema(name, value, root = ROOT) {
  const s = read(path.join(root, "spec", `${name}.schema.json`));
  const key = s.$id;
  const validate = ajv.getSchema(key) || ajv.compile(s);
  if (!validate(value))
    throw Error(`schema_${name}: ${ajv.errorsText(validate.errors)}`);
  return value;
}
export function jobs(root = ROOT) {
  return walk(path.join(root, "jobs"))
    .filter((p) => p.endsWith(`${path.sep}job.yaml`))
    .map((p) => ({
      manifest: read(p),
      dir: path.dirname(p),
      path: path.relative(root, path.dirname(p)).split(path.sep).join("/"),
    }))
    .sort((a, b) => (a.manifest.id < b.manifest.id ? -1 : 1));
}
export function agentTemplates(root = ROOT) {
  return walk(path.join(root, "agent-templates"))
    .filter((p) => p.endsWith(`${path.sep}template.yaml`))
    .map((p) => ({
      manifest: read(p),
      dir: path.dirname(p),
      path: path.relative(root, path.dirname(p)).split(path.sep).join("/"),
      manifestPath: p,
    }))
    .sort((a, b) => (a.manifest.id < b.manifest.id ? -1 : 1));
}
export function getAgentTemplate(id, root = ROOT) {
  const template = agentTemplates(root).find((item) => item.manifest.id === id);
  if (!template) throw Error(`unknown_agent_template: ${id}`);
  return template;
}
export function templateDigest(template) {
  const manifest = fs
    .readFileSync(template.manifestPath ?? path.join(template.dir, "template.yaml"), "utf8")
    .replace(/^content_digest:\s*.*$/m, `content_digest: ${"0".repeat(64)}`);
  return digest([
    `template.yaml\0${digest(Buffer.from(manifest))}`,
    ...template.manifest.files.slice().sort().map((file) => `${file}\0${digest(fs.readFileSync(safePath(template.dir, file)))}`),
  ].join("\n"));
}
export function getJob(id, root = ROOT) {
  const j = jobs(root).find((j) => j.manifest.id === id);
  if (!j) throw Error(`unknown_job: ${id}`);
  return j;
}
export function jobDigest(j) {
  const files = ["job.yaml", ...j.manifest.files].sort();
  return digest(
    files
      .map((p) => `${p}\0${digest(fs.readFileSync(safePath(j.dir, p)))}`)
      .join("\n"),
  );
}
const secretPatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
  /(?:password|api[_-]?key|access[_-]?token)\s*[:=]\s*["'](?!synthetic|example|placeholder)[^"'\s]{12,}["']/i,
];
export function scanText(text) {
  const errors = [];
  if (secretPatterns.some((p) => p.test(text))) errors.push("possible_secret");
  if (
    /(?:curl|wget)[^\n|]*\|\s*(?:ba)?sh\b|\brm\s+-rf\s+\/|Invoke-Expression|\beval\s*\(/i.test(
      text,
    )
  )
    errors.push("suspicious_command");
  return errors;
}
export function validateJob(j, root = ROOT) {
  const m = schema("job", j.manifest, root);
  if (
    path.basename(j.dir) !== m.id ||
    path.basename(path.dirname(j.dir)) !== m.category
  )
    throw Error("identity_path_mismatch");
  const actual = walk(j.dir)
    .map((p) => path.relative(j.dir, p).split(path.sep).join("/"))
    .sort();
  const declared = ["job.yaml", ...m.files].sort();
  if (json(actual) !== json(declared)) throw Error("manifest_payload_mismatch");
  for (const p of m.files) {
    const file = safePath(j.dir, p);
    if (!fs.existsSync(file)) throw Error("missing_payload");
    const findings = scanText(fs.readFileSync(file, "utf8"));
    if (findings.length) throw Error(`${m.id}/${p}: ${findings.join(",")}`);
  }
  if (scanText(json(m)).length) throw Error("unsafe_manifest");
  const consequential = m.permissions.filter(
    (p) => !["read-only", "local-mutation"].includes(p.kind),
  );
  if (consequential.length && (!m.approval.required || m.unattended_safe))
    throw Error("approval_inconsistent");
  if (
    m.mutation_level !== "read-only" &&
    !m.permissions.some((p) => p.kind === m.mutation_level)
  )
    throw Error("mutation_undeclared");
  if (
    m.permissions.some(
      (p) => p.kind === "local-mutation" && p.scope !== "run-output",
    ) &&
    m.mutation_level === "read-only"
  )
    throw Error("local_mutation_mismatch");
  for (const p of consequential)
    if (!m.approval.before.includes(p.kind))
      throw Error("approval_action_missing");
  if (
    m.credentials.length &&
    !m.permissions.some((p) => p.kind === "credential-use")
  )
    throw Error("credential_permission_missing");
  const defs = read(path.join(root, "spec/capabilities.json"));
  for (const c of m.capabilities)
    if (!defs.some((x) => x.id === c)) throw Error("unknown_capability");
  for (const v of m.validators) {
    if (!m.files.includes(v.path)) throw Error("validator_not_declared");
    const rule = read(safePath(j.dir, v.path));
    if (
      !rule.facts ||
      !Array.isArray(rule.allowed_actions) ||
      !Array.isArray(rule.required_evidence) ||
      rule.outcome !== m.qualification.expected_outcome
    )
      throw Error("invalid_validator");
  }
  const input = read(safePath(j.dir, "fixtures/input.json"));
  if (!ajv.compile(m.inputs)(input)) throw Error("fixture_input_invalid");
  const expected = read(safePath(j.dir, "expected/result.json"));
  const verdict = verify(j, expected);
  if (verdict.verdict !== "PASS")
    throw Error(`expected_result_invalid: ${verdict.errors}`);
  return true;
}
export function validateAgentTemplate(template, root = ROOT) {
  const manifest = schema("agent-template", template.manifest, root);
  if (path.basename(template.dir) !== manifest.id) throw Error("template_identity_path_mismatch");
  const actual = walk(template.dir).map((file) => path.relative(template.dir, file).split(path.sep).join("/")).sort();
  const declared = ["template.yaml", ...manifest.files].sort();
  if (json(actual) !== json(declared)) throw Error("template_manifest_payload_mismatch");
  for (const file of manifest.files) {
    const target = safePath(template.dir, file);
    if (!fs.existsSync(target)) throw Error("template_missing_payload");
    const findings = scanText(fs.readFileSync(target, "utf8"));
    if (findings.length) throw Error(`${manifest.id}/${file}: ${findings.join(",")}`);
  }
  for (const adaptation of manifest.provider_adaptations ?? []) {
    if (!manifest.files.includes(adaptation.file)) throw Error(`template_adaptation_file_undeclared:${adaptation.id}`);
    if (digest(fs.readFileSync(safePath(template.dir, adaptation.file))) !== adaptation.content_digest)
      throw Error(`template_adaptation_digest_mismatch:${adaptation.id}`);
  }
  if (templateDigest(template) !== manifest.content_digest) throw Error("template_digest_mismatch");
  const knownJobs = new Map(jobs(root).map((job) => [job.manifest.id, job.manifest]));
  for (const id of manifest.compatible_jobs) {
    const job = knownJobs.get(id);
    if (!job) throw Error(`template_job_missing:${id}`);
    for (const capability of manifest.requirements.capabilities)
      if (!job.capabilities.includes(capability)) throw Error(`template_job_capability_mismatch:${id}:${capability}`);
    for (const permission of manifest.requirements.permissions)
      if (!job.permissions.some((candidate) => candidate.kind === permission.kind && candidate.scope === permission.scope))
        throw Error(`template_job_permission_mismatch:${id}:${permission.kind}:${permission.scope}`);
  }
  return true;
}
export function verify(j, result) {
  const errors = [];
  const v = ajv.compile(j.manifest.outputs);
  if (!v(result))
    return {
      verdict: "FAIL",
      scope: "fixture-contract-only",
      errors: [ajv.errorsText(v.errors)],
    };
  for (const item of j.manifest.validators) {
    const r = read(safePath(j.dir, item.path));
    if (result.outcome !== r.outcome) errors.push("outcome");
    for (const [k, val] of Object.entries(r.facts)) {
      if (json(result.facts[k]) !== json(val)) errors.push(`fact:${k}`);
    }
    for (const k of Object.keys(result.facts))
      if (!Object.hasOwn(r.facts, k)) errors.push(`unsupported_fact:${k}`);
    for (const a of result.actions)
      if (!r.allowed_actions.includes(a)) errors.push(`action:${a}`);
    for (const ref of r.required_evidence)
      if (!result.evidence.includes(ref)) errors.push(`evidence:${ref}`);
  }
  return {
    verdict: errors.length ? "FAIL" : "PASS",
    scope: "fixture-contract-only",
    qualified: false,
    errors,
  };
}
export function validate(root = ROOT) {
  const all = jobs(root),
    ids = new Set();
  const uses = read(path.join(root, "research/use-cases.yaml"));
  const sources = read(path.join(root, "research/sources.json"));
  const sourceIds = new Set(sources.map((x) => x.id));
  const useIds = new Set();
  for (const u of uses) {
    schema("use-case", u, root);
    if (useIds.has(u.id)) throw Error("duplicate_use_case");
    useIds.add(u.id);
    if (
      !sourceIds.has(u.source) ||
      sources.find((s) => s.id === u.source).url !== u.source_url
    )
      throw Error("broken_source");
  }
  for (const j of all) {
    if (ids.has(j.manifest.id)) throw Error("duplicate_job");
    ids.add(j.manifest.id);
    validateJob(j, root);
    for (const p of j.manifest.provenance) {
      if (
        p.type === "published-use-case" &&
        (!useIds.has(p.reference) ||
          uses.find((u) => u.id === p.reference).source_url !== p.url)
      )
        throw Error("broken_provenance");
    }
  }
  const templateIds = new Set();
  for (const template of agentTemplates(root)) {
    if (templateIds.has(template.manifest.id)) throw Error("duplicate_agent_template");
    templateIds.add(template.manifest.id);
    validateAgentTemplate(template, root);
  }
  for (const u of uses)
    for (const id of u.canonical_jobs)
      if (!ids.has(id)) throw Error("broken_traceability");
  const suiteIds = new Set();
  for (const p of walk(path.join(root, "suites"))) {
    const s = schema("suite", read(p), root);
    if (suiteIds.has(s.id)) throw Error("duplicate_suite");
    suiteIds.add(s.id);
    for (const id of s.jobs) {
      if (!ids.has(id)) throw Error("broken_suite");
      if (
        s.expected_outcomes[id] !==
        all.find((j) => j.manifest.id === id).manifest.qualification
          .expected_outcome
      )
        throw Error("suite_outcome_mismatch");
    }
    if (Object.keys(s.expected_outcomes).length !== s.jobs.length)
      throw Error("suite_extra_outcome");
  }
  const full = read(path.join(root, "suites/AC-QUAL-FULL.yaml"));
  if (json([...full.jobs].sort()) !== json([...ids].sort()))
    throw Error("incomplete_full_suite");
  for (const p of walk(path.join(root, "spec")).filter((p) =>
    p.endsWith(".schema.json"),
  )) {
    const s = read(p);
    if (!ajv.getSchema(s.$id)) ajv.compile(s);
  }
  return {
    jobs: all.length,
    use_cases: uses.length,
    sources: sources.length,
    suites: suiteIds.size,
    agent_templates: templateIds.size,
  };
}
export function compatibility(j, estate, context = {}, clock = new Date()) {
  schema("estate", estate);
  const m = j.manifest,
    reasons = [];
  const add = (state, reason) => reasons.push({ state, reason });
  const age = (clock - Date.parse(estate.observed_at)) / 1000;
  if (
    !Number.isFinite(age) ||
    age < 0 ||
    age > Math.min(estate.max_age_seconds, m.evidence.max_age_seconds)
  )
    add("BLOCKED", "stale-or-invalid-estate");
  if (estate.blocked) add("BLOCKED", "estate-blocked");
  if (m.agent_control.integration_status === "UNSUPPORTED")
    add("UNSUPPORTED", "job-integration-unsupported");
  if (!m.platforms.includes("any") && !m.platforms.includes(estate.platform))
    add("UNSUPPORTED", "platform");
  for (const c of m.capabilities)
    if (!estate.capabilities.includes(c)) add("UNSUPPORTED", `capability:${c}`);
  for (const c of m.connectors)
    if (!estate.connectors.includes(c)) add("CONNECTOR_REQUIRED", c);
  for (const c of m.credentials)
    if (!estate.credentials.includes(c)) add("CREDENTIAL_REQUIRED", c);
  for (const c of m.models.required)
    if (!estate.models.includes(c)) add("UNSUPPORTED", `model-capability:${c}`);
  if (!estate.configured_jobs.includes(m.id))
    add("CONFIGURATION_REQUIRED", "qualified-adapter-binding");
  for (const r of m.resources) {
    if (
      r.required &&
      !estate.resources.some(
        (v) => v.id === r.id && v.healthy && v.count >= r.count,
      )
    )
      add("CONFIGURATION_REQUIRED", `resource:${r.id}`);
  }
  const grant = estate.grants.find(
    (g) =>
      g.job_id === m.id &&
      g.job_version === m.version &&
      g.job_digest === jobDigest(j) &&
      g.input_digest === context.input_digest &&
      g.target === context.target &&
      Number.isFinite(Date.parse(g.expires_at)) &&
      Date.parse(g.expires_at) > clock.getTime(),
  );
  if (!grant) add("APPROVAL_REQUIRED", "bound-run-grant");
  else {
    for (const p of m.permissions)
      if (
        !grant.permissions.some((g) => g.kind === p.kind && g.scope === p.scope)
      )
        add("APPROVAL_REQUIRED", `permission:${p.kind}:${p.scope}`);
    for (const action of m.approval.before)
      if (!grant.approved_actions.includes(action))
        add("APPROVAL_REQUIRED", `action:${action}`);
  }
  if (
    estate.budget.currency !== m.cost_ceiling.currency ||
    estate.budget.amount < m.cost_ceiling.amount
  )
    add("BLOCKED", "budget");
  const priority = [
    "BLOCKED",
    "UNSUPPORTED",
    "CONNECTOR_REQUIRED",
    "CREDENTIAL_REQUIRED",
    "CONFIGURATION_REQUIRED",
    "APPROVAL_REQUIRED",
  ];
  return {
    job: m.id,
    job_digest: jobDigest(j),
    state: priority.find((s) => reasons.some((r) => r.state === s)) ?? "READY",
    reasons,
    authority_granted: false,
    note: "Advisory compatibility only. Runtime must recheck authority, target, cost and freshness.",
  };
}
export function templateReadiness(template, job, estate, context = {}, clock = new Date()) {
  validateAgentTemplate(template);
  if (!template.manifest.compatible_jobs.includes(job.manifest.id)) throw Error("template_job_incompatible");
  const base = compatibility(job, estate, context, clock), reasons = [...base.reasons];
  for (const capability of template.manifest.requirements.capabilities)
    if (!estate.capabilities.includes(capability)) reasons.push({state: "UNSUPPORTED", reason: `template-capability:${capability}`});
  for (const tool of template.manifest.requirements.tools)
    if (!estate.capabilities.includes(tool)) reasons.push({state: "CONFIGURATION_REQUIRED", reason: `template-tool:${tool}`});
  const priority = ["BLOCKED", "UNSUPPORTED", "CONNECTOR_REQUIRED", "CREDENTIAL_REQUIRED", "CONFIGURATION_REQUIRED", "APPROVAL_REQUIRED"];
  return {
    schema: "agent-control.template-readiness/v1",
    template: `${template.manifest.id}@${template.manifest.version}`,
    template_digest: template.manifest.content_digest,
    job: `${job.manifest.id}@${job.manifest.version}`,
    job_digest: base.job_digest,
    state: priority.find((state) => reasons.some((reason) => reason.state === state)) ?? "READY",
    reasons,
    authority_granted: false,
    note: "Advisory readiness only. Agent Control must revalidate the digest, permissions, target, budget and evidence freshness before dispatch.",
  };
}
export function templateSelection(template, job, estate, context = {}, clock = new Date()) {
  const readiness = templateReadiness(template, job, estate, context, clock);
  return {
    schema: "agent-control.template-selection/v1",
    template: {id: template.manifest.id, version: template.manifest.version, digest: template.manifest.content_digest},
    job: {id: job.manifest.id, version: job.manifest.version, digest: readiness.job_digest},
    inputs_digest: context.input_digest ?? null,
    target: context.target ?? null,
    readiness,
    execution: "SUBMIT_TO_AGENT_CONTROL",
  };
}
export function catalogue(root = ROOT) {
  validate(root);
  const all = jobs(root);
  return {
    schema_version: "1.0.0",
    library_version: read(path.join(root, "package.json")).version,
    jobs: all.map((j) => ({
      ...j.manifest,
      path: j.path,
      sha256: jobDigest(j),
      payload: Object.fromEntries(
        ["job.yaml", ...j.manifest.files]
          .sort()
          .map((p) => [p, digest(fs.readFileSync(safePath(j.dir, p)))]),
      ),
    })),
    agent_templates: agentTemplates(root).map((template) => ({
      ...template.manifest,
      path: template.path,
      sha256: templateDigest(template),
      payload: Object.fromEntries(["template.yaml", ...template.manifest.files].sort().map((file) => [file, digest(fs.readFileSync(safePath(template.dir, file)))])),
    })),
  };
}
export function generated(root = ROOT) {
  const cat = catalogue(root);
  const uses = read(path.join(root, "research/use-cases.yaml"));
  const suites = walk(path.join(root, "suites")).map(read);
  const matrix = uses.map((u) => ({
    use_case: u.id,
    normalised_workload: u.normalised_workload,
    canonical_jobs: u.canonical_jobs,
    representation: u.canonical_jobs.length
      ? "COMPONENT_ONLY"
      : "UNREPRESENTED",
    capabilities: u.required_capabilities,
    governance_challenge: u.human_approval_requirement,
    evidence: [
      "source references",
      "fresh observations",
      "authority audit",
      "independent validator",
    ],
    qualification_suites: suites
      .filter((s) => s.jobs.some((id) => u.canonical_jobs.includes(id)))
      .map((s) => s.id),
    implementation_status: u.agent_control_support,
    qualification: "NOT_YET_QUALIFIED",
  }));
  const represented = matrix.filter((x) => x.canonical_jobs.length).length;
  const coverage = `# Coverage\n\nGenerated from the checked-in research sample; this is not a census or an industry market-share estimate.\n\n- External records: ${uses.length} (including API capability examples and illustrative vendor architectures).\n- Sources: ${read(path.join(root, "research/sources.json")).length}.\n- Normalised workload classes: ${uses.length}; one deliberately bounded class per selected record, no prevalence weighting.\n- Canonical jobs: ${cat.jobs.length}.\n- Classes with component representation: ${represented}.\n- Unrepresented classes: ${uses.length - represented}.\n- Fully reproduced external workflows: 0.\n- End-to-end qualified classes: 0.\n- Unqualified classes: ${uses.length}.\n\nComponent representation is not end-to-end support. Generic synthetic examples omit enterprise connectors, domain reviewers, operational scale and real effect verification. No percentage is claimed. Multiple records can describe overlapping workload families; counts describe this sample only. Requirements-derived jobs are excluded from the external denominator.\n\n## Unrepresented workflows\n\n${uses
    .filter((u) => !u.canonical_jobs.length)
    .map((u) => `- ${u.id}: ${u.normalised_workload}.`)
    .join(
      "\n",
    )}\n\n## Gaps\n\nNo generic installed library adapter, credential broker, enterprise CRM/ERP connectors, independent domain evaluators, live approval receipt verifier or automatic dashboard installation is implemented here. Parallel fixtures do not qualify concurrent runtime execution. Durable-state examples do not prove process interruption recovery. Physical safety, clinical decisions and automated security isolation require specialist integration and separate qualification.\n`;
  return {
    "catalogue/index.json": json(cat),
    "research/traceability.json": json(matrix),
    "research/COVERAGE.md": coverage,
    "research/REAL-WORLD-USE-CASES.md": `# Real-world use cases\n\nAccessed 2026-09-12. See [methodology](METHODOLOGY.md), [source registry](sources.json), [Dataiku guide review](DATAIKU-GUIDE.md) and [coverage](COVERAGE.md). Original descriptions below are short paraphrases.\n\n| Record | Source | Normalised workload | Category | Mapping |\n|---|---|---|---|---|\n${uses.map((u) => `| ${u.id} | [${u.organisation}${u.source_page ? ` p.${u.source_page}` : ""}](${u.source_url}) | ${u.normalised_workload} | ${u.category} | ${u.canonical_jobs.join(", ") || "UNSUPPORTED"} |`).join("\n")}\n`,
    "research/USE-CASE-TRACEABILITY.md": `# Use-case traceability\n\nEvery mapped job below is component representation and NOT_YET_QUALIFIED. [Machine-readable detail](traceability.json) includes capabilities, governance, evidence and suites.\n\n| Published record | Canonical jobs | Integration | Suites |\n|---|---|---|---|\n${matrix.map((r) => `| ${r.use_case} | ${r.canonical_jobs.join(", ") || "none"} | ${r.implementation_status} | ${r.qualification_suites.join(", ")} |`).join("\n")}\n`,
  };
}
