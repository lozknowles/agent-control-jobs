#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(
  ROOT,
  "reports/p5000-qwen3.8-27b/source-data.json",
);
const MAX_SOURCE_BYTES = 64 * 1024 * 1024;

function fail(message) {
  throw new Error(`benchmark_import_failed: ${message}`);
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function load(root, relativePath) {
  const target = path.resolve(root, relativePath);
  if (!target.startsWith(`${root}${path.sep}`)) fail("source_path_escape");
  const stat = fs.statSync(target);
  if (!stat.isFile() || stat.size > MAX_SOURCE_BYTES)
    fail(`invalid_source_file: ${relativePath}`);
  const buffer = fs.readFileSync(target);
  return {
    value: JSON.parse(buffer.toString("utf8")),
    source: {
      path: relativePath.split(path.sep).join("/"),
      sha256: sha256(buffer),
      sizeBytes: stat.size,
    },
  };
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function successfulParcel(parcels, objective) {
  const matches = parcels.parcels.filter(
    (parcel) => parcel.objective === objective && parcel.status === "SUCCEEDED",
  );
  assert(matches.length === 1, `expected_one_successful_parcel: ${objective}`);
  return matches[0];
}

function artifactsFor(parcel, registry) {
  const ids = parcel.stages.flatMap((stage) => stage.baton?.artifactIds ?? []);
  const records = ids.map((id) => registry.artifacts.find((item) => item.id === id));
  assert(records.every(Boolean), `missing_artifact_record: ${parcel.id}`);
  return records.map(
    ({ id, name, runId, stepId, type, schema, version, sha256, size, createdAt }) => ({
      id,
      name,
      runId,
      stepId,
      type,
      schema,
      version,
      sha256,
      sizeBytes: size,
      createdAt,
    }),
  );
}

function verification(parcel) {
  return parcel.audit?.timeline?.some(
    (event) => event.type === "verification.completed",
  )
    ? "PASS"
    : "UNAVAILABLE";
}

function sanitiseInvocation(invocation) {
  const usage = invocation.usage ?? {};
  const timings = invocation.timings ?? {};
  const values = [
    usage.prompt_tokens,
    usage.completion_tokens,
    usage.total_tokens,
    usage.prompt_tokens_details?.cached_tokens,
    timings.prompt_per_second,
    timings.predicted_per_second,
    invocation.ttftSeconds,
    invocation.elapsedSeconds,
  ];
  assert(
    invocation.status === "SUCCEEDED" && values.every(Number.isFinite),
    `invalid_invocation: ${invocation.id}`,
  );
  return {
    id: invocation.id,
    status: invocation.status,
    inputTokens: usage.prompt_tokens,
    cachedInputTokens: usage.prompt_tokens_details.cached_tokens,
    outputTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    promptTokensPerSecond: timings.prompt_per_second,
    generationTokensPerSecond: timings.predicted_per_second,
    timeToFirstTokenSeconds: invocation.ttftSeconds,
    elapsedSeconds: invocation.elapsedSeconds,
    draftTokens: Number.isFinite(timings.draft_n) ? timings.draft_n : null,
    acceptedDraftTokens: Number.isFinite(timings.draft_n_accepted)
      ? timings.draft_n_accepted
      : null,
  };
}

function sanitiseRun(result, parcel, runtimeIdentity, label) {
  const stage = parcel.stages[0];
  assert(result.status === "SUCCEEDED", `result_not_successful: ${label}`);
  assert(stage?.status === "SUCCEEDED", `stage_not_successful: ${label}`);
  return {
    id: result.config.id,
    label,
    status: result.status,
    workParcelId: parcel.id,
    jobRunId: stage.runId,
    workParcelStatus: parcel.status,
    independentVerification: verification(parcel),
    startedAt: result.startedAt,
    endedAt: result.endedAt,
    bootSeconds: result.bootSeconds,
    runtime: {
      identity: runtimeIdentity.identity,
      version: runtimeIdentity.version,
      sha256: result.runtimeSha256,
    },
    configuration: {
      contextTokens: result.config.context,
      batchTokens: result.config.batch,
      microBatchTokens: result.config.ubatch,
      flashAttention: result.config.fa,
      kvCache: result.config.kv,
      repetitions: result.config.repeats,
      outputTokenLimit: result.config.output,
      workloadRows: result.config.rows,
      speculativeMode: result.config.extra?.includes("draft-mtp")
        ? "draft-mtp"
        : "disabled",
      speculativeDraftMaximum: result.config.extra?.includes("draft-mtp")
        ? Number(
            result.config.extra[
              result.config.extra.indexOf("--spec-draft-n-max") + 1
            ],
          )
        : null,
    },
    invocations: result.invocations.map(sanitiseInvocation),
  };
}

const sourceArgument = process.argv[2];
if (!sourceArgument) {
  console.error(
    "usage: node tools/import-example-benchmark.mjs /path/to/qualification-evidence",
  );
  process.exit(2);
}

const evidenceRoot = fs.realpathSync(path.resolve(sourceArgument));
const baseline = load(
  evidenceRoot,
  "experiments/baseline-full-gpu-32k/result.json",
);
const baselineMetadata = load(
  evidenceRoot,
  "experiments/baseline-canonical-32k/result.json",
);
const optimised = load(
  evidenceRoot,
  "experiments/new-runtime-q4-mtp8/result.json",
);
const parcels = load(evidenceRoot, "parcels.json");
const artifactRegistry = load(evidenceRoot, "artifacts/artifacts.json");
const discovery = load(evidenceRoot, "discovery.json");
const development = load(evidenceRoot, "development-qualification.json");

assert(
  baseline.value.modelSha256 === optimised.value.modelSha256,
  "model_hash_mismatch",
);
assert(
  baseline.value.runtimeSha256 === baselineMetadata.value.runtimeSha256,
  "baseline_runtime_hash_mismatch",
);
assert(
  baseline.value.config.context === optimised.value.config.context &&
    baseline.value.config.batch === optimised.value.config.batch &&
    baseline.value.config.ubatch === optimised.value.config.ubatch &&
    baseline.value.config.rows === optimised.value.config.rows &&
    baseline.value.config.repeats === optimised.value.config.repeats,
  "comparison_fixed_fields_mismatch",
);
assert(
  optimised.value.model === "Qwen3.8-27B-Q3_K_M",
  "unexpected_model_identity",
);

const baselineParcel = successfulParcel(
  parcels.value,
  "Measure fresh full-P5000 Qwen3.8-27B baseline with three repetitions",
);
const optimisedParcel = successfulParcel(
  parcels.value,
  "Qualify new-runtime-q4-mtp8 with retained physical evidence",
);

const optimisedArtifacts = artifactsFor(optimisedParcel, artifactRegistry.value);
const provenanceRecord = optimisedArtifacts.find(
  (item) => item.name === "experiment-provenance",
);
assert(provenanceRecord, "missing_experiment_provenance");
const provenance = load(
  evidenceRoot,
  `artifacts/objects/${provenanceRecord.id}.json`,
);
assert(
  provenance.source.sha256 === provenanceRecord.sha256,
  "experiment_provenance_hash_mismatch",
);

const scans = discovery.value.scans.filter((scan) => scan.status === "COMPLETED");
const latestScan = scans.at(-1);
const gpu = latestScan?.items.find(
  (item) => item.kind === "GPU" && item.label === "Quadro P5000",
);
const machine = latestScan?.items.find(
  (item) => item.kind === "MACHINE" && item.label === "hpubuntu",
);
assert(gpu?.health === "HEALTHY" && machine?.health === "HEALTHY", "hardware_missing");
assert(
  development.value.exitCode === 0 &&
    development.value.fullSuiteExecuted === true &&
    development.value.counts?.fail === 0,
  "development_validation_failed",
);

const baselineRun = sanitiseRun(
  baseline.value,
  baselineParcel,
  {
    identity: baselineMetadata.value.runtime,
    version: baselineMetadata.value.runtimeVersion,
  },
  "Baseline",
);
const optimisedRun = sanitiseRun(
  optimised.value,
  optimisedParcel,
  {
    identity: optimised.value.runtime,
    version: optimised.value.runtimeVersion,
  },
  "Optimised configuration",
);

assert(
  [baselineRun, optimisedRun].every(
    (run) =>
      run.independentVerification === "PASS" &&
      run.invocations.length === 3 &&
      run.invocations.every((invocation) => invocation.status === "SUCCEEDED"),
  ),
  "physical_verification_incomplete",
);

const output = {
  schema: "agent-control-lab.example-benchmark-source/v1",
  qualification: {
    id: path.basename(evidenceRoot),
    completedAt: optimised.value.endedAt,
    agentControlSourceCommit: provenance.value.sourceCommit,
    agentControlSourceFingerprint: provenance.value.implementationSha256,
    controllerSha256: provenance.value.controllerSha256,
    developmentValidation: {
      tests: development.value.counts.tests,
      passed: development.value.counts.pass,
      failed: development.value.counts.fail,
      skipped: development.value.counts.skipped,
      logSha256: development.value.logSha256,
      startedAt: development.value.startedAt,
      endedAt: development.value.endedAt,
    },
    sourceFiles: [
      baseline.source,
      baselineMetadata.source,
      optimised.source,
      parcels.source,
      artifactRegistry.source,
      discovery.source,
      development.source,
      provenance.source,
    ],
  },
  hardware: {
    node: machine.label,
    accelerator: `NVIDIA ${gpu.label}`,
    vramMiB: gpu.attributes.vramMiB,
    driver: gpu.attributes.driver,
    health: gpu.health,
    discoveryId: latestScan.id,
    discoveredAt: latestScan.completedAt,
  },
  model: {
    identity: optimised.value.model,
    sha256: optimised.value.modelSha256,
    baselineIdentityAuthority:
      "Resolved from the matching immutable model SHA-256 in the optimised result",
  },
  comparison: {
    fixedFields: [
      "hardware",
      "model SHA-256",
      "32,768-token context",
      "2,048-token batch",
      "512-token micro-batch",
      "120-row workload",
      "2,224 input tokens per invocation",
      "three repetitions",
    ],
    changedFields: [
      "llama.cpp build",
      "KV cache format (f16 to q4_0)",
      "draft-MTP (disabled to maximum 8)",
      "output-token ceiling (128 to 512)",
    ],
    interpretation:
      "This is an observed configuration-level comparison. It does not attribute the measured change to any single optimisation.",
    runs: [baselineRun, optimisedRun],
  },
  evidence: {
    baselineArtifacts: artifactsFor(baselineParcel, artifactRegistry.value),
    optimisedArtifacts,
  },
};

const outputText = `${JSON.stringify(output, null, 2)}\n`;
if (
  /(?:\/fast\/|\/home\/|[A-Za-z]:\\|100\.\d+\.\d+\.\d+|-----BEGIN|ghp_|sk-)/.test(
    outputText,
  )
)
  fail("private_or_secret_output_value");
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, outputText);
console.log(`wrote ${path.relative(ROOT, OUTPUT)}`);
