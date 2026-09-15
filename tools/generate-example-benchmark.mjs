#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORT_DIR = path.join(ROOT, "reports/p5000-qwen3.8-27b");
const SOURCE_PATH = path.join(REPORT_DIR, "source-data.json");
const README_PATH = path.join(ROOT, "README.md");
const CHART_PATH = path.join(
  ROOT,
  "assets/benchmarks/p5000-qwen3.8-27b-generation-throughput.svg",
);
const CHECK = process.argv.includes("--check");

function fail(message) {
  throw new Error(`benchmark_generation_failed: ${message}`);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function mean(values) {
  if (!values.length || !values.every(Number.isFinite)) fail("invalid_metric");
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function format(value, digits = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function csv(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function summarise(run) {
  const invocations = run.invocations;
  return {
    ...run,
    summary: {
      invocations: invocations.length,
      inputTokens: invocations.reduce((sum, item) => sum + item.inputTokens, 0),
      cachedInputTokens: invocations.reduce(
        (sum, item) => sum + item.cachedInputTokens,
        0,
      ),
      outputTokens: invocations.reduce((sum, item) => sum + item.outputTokens, 0),
      totalTokens: invocations.reduce((sum, item) => sum + item.totalTokens, 0),
      meanPromptTokensPerSecond: mean(
        invocations.map((item) => item.promptTokensPerSecond),
      ),
      meanGenerationTokensPerSecond: mean(
        invocations.map((item) => item.generationTokensPerSecond),
      ),
      meanTimeToFirstTokenSeconds: mean(
        invocations.map((item) => item.timeToFirstTokenSeconds),
      ),
      meanElapsedSeconds: mean(invocations.map((item) => item.elapsedSeconds)),
    },
  };
}

function assertSource(source) {
  if (source.schema !== "agent-control-lab.example-benchmark-source/v1")
    fail("unsupported_source_schema");
  if (source.comparison?.runs?.length !== 2) fail("expected_two_runs");
  for (const run of source.comparison.runs) {
    if (
      run.status !== "SUCCEEDED" ||
      run.workParcelStatus !== "SUCCEEDED" ||
      run.independentVerification !== "PASS" ||
      run.invocations.length !== 3
    )
      fail(`unqualified_run: ${run.id}`);
  }
  if (source.comparison.runs[0].runtime.sha256 === source.comparison.runs[1].runtime.sha256)
    fail("comparison_runtime_not_changed");
  if (!/^[a-f0-9]{64}$/.test(source.model.sha256)) fail("invalid_model_hash");
  const serialised = JSON.stringify(source);
  if (
    /(?:\/fast\/|\/home\/|[A-Za-z]:\\|100\.\d+\.\d+\.\d+|-----BEGIN|ghp_|sk-)/.test(
      serialised,
    )
  )
    fail("private_or_secret_source_value");
}

const sourceText = fs.readFileSync(SOURCE_PATH, "utf8");
const source = JSON.parse(sourceText);
assertSource(source);
const runs = source.comparison.runs.map(summarise);
const [baseline, optimised] = runs;
const speedup =
  optimised.summary.meanGenerationTokensPerSecond /
  baseline.summary.meanGenerationTokensPerSecond;
const improvementPercent = (speedup - 1) * 100;
const readmeStart = "<!-- BEGIN GENERATED EXAMPLE BENCHMARK -->";
const readmeEnd = "<!-- END GENERATED EXAMPLE BENCHMARK -->";
const readmeSummary = `${readmeStart}
This first worked example is a real physical qualification on **${source.hardware.node}**, using an **${source.hardware.accelerator} (${source.hardware.vramMiB / 1024} GiB)**, **${optimised.runtime.identity}**, and the immutable **${source.model.identity}** model at **${optimised.configuration.contextTokens / 1024}K context**. Both configurations ran ${baseline.summary.invocations} times through successful Agent Control Work Parcels and passed independent verification.

![Measured baseline versus optimised Qwen3.8-27B generation throughput on a Quadro P5000](assets/benchmarks/p5000-qwen3.8-27b-generation-throughput.svg)

| Measurement | Baseline | Optimised configuration |
|---|---:|---:|
| Mean prompt throughput | ${format(baseline.summary.meanPromptTokensPerSecond)} tok/s | ${format(optimised.summary.meanPromptTokensPerSecond)} tok/s |
| Mean generation throughput | ${format(baseline.summary.meanGenerationTokensPerSecond)} tok/s | ${format(optimised.summary.meanGenerationTokensPerSecond)} tok/s |
| Mean time to first token | ${format(baseline.summary.meanTimeToFirstTokenSeconds)} s | ${format(optimised.summary.meanTimeToFirstTokenSeconds)} s |
| Physical invocations | ${baseline.summary.invocations} | ${optimised.summary.invocations} |
| Independent verification | ${baseline.independentVerification} | ${optimised.independentVerification} |

The measured configuration-level generation-throughput result is **${format(speedup)}× baseline**. The comparison keeps the GPU, model SHA-256, prompt, context, batch and repetitions fixed. Runtime build, KV format, draft-MTP and output ceiling changed, so Lab does **not** attribute the result to one optimisation or treat elapsed time as a like-for-like latency comparison.
${readmeEnd}`;
const readmeBefore = fs.readFileSync(README_PATH, "utf8");
const readmePattern = new RegExp(
  `${readmeStart}[\\s\\S]*?${readmeEnd}`,
  "u",
);
if (!readmePattern.test(readmeBefore)) fail("readme_summary_markers_missing");
const renderedReadme = readmeBefore.replace(readmePattern, readmeSummary);
const report = {
  schema: "agent-control-lab.benchmark-report/v1",
  generatedAt: source.qualification.completedAt,
  title: "Quadro P5000 × Qwen3.8-27B — 32K configuration comparison",
  qualification: source.qualification,
  hardware: source.hardware,
  model: source.model,
  comparison: {
    fixedFields: source.comparison.fixedFields,
    changedFields: source.comparison.changedFields,
    interpretation: source.comparison.interpretation,
    runs,
    measuredResult: {
      baselineGenerationTokensPerSecond:
        baseline.summary.meanGenerationTokensPerSecond,
      optimisedGenerationTokensPerSecond:
        optimised.summary.meanGenerationTokensPerSecond,
      generationThroughputSpeedup: speedup,
      generationThroughputIncreasePercent: improvementPercent,
    },
  },
  evidence: source.evidence,
  claims: {
    physicalHardware: true,
    governedWorkParcels: true,
    independentVerification: true,
    monetarySaving: "NOT_CLAIMED",
    causalAttributionToSingleOptimisation: "NOT_CLAIMED",
  },
};

const chartMax = Math.max(
  baseline.summary.meanGenerationTokensPerSecond,
  optimised.summary.meanGenerationTokensPerSecond,
);
const barWidth = (value) => Math.round((value / chartMax) * 650);
const chart = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">Baseline versus optimised Qwen3.8-27B generation throughput on an NVIDIA Quadro P5000</title>
  <desc id="desc">The baseline averaged ${format(baseline.summary.meanGenerationTokensPerSecond)} generated tokens per second. The optimised configuration averaged ${format(optimised.summary.meanGenerationTokensPerSecond)} generated tokens per second, a measured ${format(speedup)} times speedup.</desc>
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#081522"/>
      <stop offset="1" stop-color="#102b3e"/>
    </linearGradient>
    <linearGradient id="fast" x1="0" x2="1">
      <stop offset="0" stop-color="#30e3a2"/>
      <stop offset="1" stop-color="#56c8ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" rx="28" fill="url(#bg)"/>
  <text x="70" y="82" fill="#eef8ff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="38" font-weight="700">Real P5000 × Qwen3.8-27B qualification</text>
  <text x="70" y="124" fill="#98b6ca" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="22">Mean generation throughput · 3 physical invocations per configuration · 32K context</text>
  <text x="70" y="212" fill="#d6e7f2" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24" font-weight="600">Baseline</text>
  <rect x="320" y="177" width="${barWidth(baseline.summary.meanGenerationTokensPerSecond)}" height="52" rx="12" fill="#f3b64c"/>
  <text x="${340 + barWidth(baseline.summary.meanGenerationTokensPerSecond)}" y="212" fill="#eef8ff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="25" font-weight="700">${format(baseline.summary.meanGenerationTokensPerSecond)} tok/s</text>
  <text x="70" y="312" fill="#d6e7f2" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24" font-weight="600">Optimised</text>
  <rect x="320" y="277" width="${barWidth(optimised.summary.meanGenerationTokensPerSecond)}" height="52" rx="12" fill="url(#fast)"/>
  <text x="${340 + barWidth(optimised.summary.meanGenerationTokensPerSecond)}" y="312" fill="#eef8ff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="25" font-weight="700">${format(optimised.summary.meanGenerationTokensPerSecond)} tok/s</text>
  <rect x="70" y="379" width="1060" height="120" rx="18" fill="#0d2030" stroke="#28506a"/>
  <text x="103" y="428" fill="#30e3a2" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="34" font-weight="800">${format(speedup)}× measured speedup</text>
  <text x="103" y="468" fill="#b7ccd9" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="19">Same GPU, model SHA, prompt, 32K context, batch and repetitions.</text>
  <text x="70" y="551" fill="#88a8bb" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="17">Configuration-level result: runtime build, KV format, draft-MTP and output ceiling changed. No single-change or monetary-saving claim.</text>
  <text x="70" y="588" fill="#56c8ff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18" font-weight="600">Agent Control Lab · Evidence-backed, independently verified</text>
</svg>
`;

const markdown = `# Quadro P5000 × Qwen3.8-27B benchmark report

**Status:** Physical measurements complete · Governed Work Parcels succeeded · Independent verification passed

This report compares two measured configurations of the same immutable Qwen3.8-27B-Q3_K_M model on the same NVIDIA Quadro P5000. It is generated from the committed privacy-safe evidence projection in [source-data.json](source-data.json).

![Baseline versus optimised generation throughput](../../assets/benchmarks/p5000-qwen3.8-27b-generation-throughput.svg)

## Measured result

| Configuration | llama.cpp | KV cache | Draft MTP | Mean prompt tok/s | Mean generation tok/s | Mean TTFT | Input / cached / output tokens | Verification |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline | ${baseline.runtime.version} | ${baseline.configuration.kvCache} | disabled | ${format(baseline.summary.meanPromptTokensPerSecond)} | ${format(baseline.summary.meanGenerationTokensPerSecond)} | ${format(baseline.summary.meanTimeToFirstTokenSeconds)} s | ${baseline.summary.inputTokens.toLocaleString("en-US")} / ${baseline.summary.cachedInputTokens.toLocaleString("en-US")} / ${baseline.summary.outputTokens.toLocaleString("en-US")} | ${baseline.independentVerification} |
| Optimised configuration | ${optimised.runtime.version} | ${optimised.configuration.kvCache} | max ${optimised.configuration.speculativeDraftMaximum} | ${format(optimised.summary.meanPromptTokensPerSecond)} | ${format(optimised.summary.meanGenerationTokensPerSecond)} | ${format(optimised.summary.meanTimeToFirstTokenSeconds)} s | ${optimised.summary.inputTokens.toLocaleString("en-US")} / ${optimised.summary.cachedInputTokens.toLocaleString("en-US")} / ${optimised.summary.outputTokens.toLocaleString("en-US")} | ${optimised.independentVerification} |

The optimised configuration measured **${format(optimised.summary.meanGenerationTokensPerSecond)} generated tokens/s**, compared with **${format(baseline.summary.meanGenerationTokensPerSecond)} tokens/s** at baseline: **${format(speedup)}×** or **${format(improvementPercent)}%** higher generation throughput.

## What stayed fixed

${source.comparison.fixedFields.map((item) => `- ${item}`).join("\n")}

## What changed

${source.comparison.changedFields.map((item) => `- ${item}`).join("\n")}

${source.comparison.interpretation} Generation throughput is normalised per generated token, but the output-token ceiling changed and elapsed-time means should not be read as a like-for-like latency comparison.

## Invocation measurements

| Configuration | Invocation | Input | Cached | Output | Prompt tok/s | Generation tok/s | TTFT | Elapsed |
|---|---|---:|---:|---:|---:|---:|---:|---:|
${runs
  .flatMap((run) =>
    run.invocations.map(
      (item) => `| ${run.label} | ${item.id} | ${item.inputTokens} | ${item.cachedInputTokens} | ${item.outputTokens} | ${format(item.promptTokensPerSecond)} | ${format(item.generationTokensPerSecond)} | ${format(item.timeToFirstTokenSeconds)} s | ${format(item.elapsedSeconds)} s |`,
    ),
  )
  .join("\n")}

## Evidence chain

1. Lab qualification \`${source.qualification.id}\`
2. Work Parcels \`${baseline.workParcelId}\` and \`${optimised.workParcelId}\`
3. Job runs \`${baseline.jobRunId}\` and \`${optimised.jobRunId}\`
4. ${baseline.summary.invocations + optimised.summary.invocations} physical invocations
5. Agent Control artefacts and source-file SHA-256 records in [source-data.json](source-data.json)
6. This generated report and chart

- Agent Control source commit: \`${source.qualification.agentControlSourceCommit}\`
- Evidence-bound source fingerprint: \`${source.qualification.agentControlSourceFingerprint}\`
- Model SHA-256: \`${source.model.sha256}\`

The development qualification associated with the evidence snapshot passed ${source.qualification.developmentValidation.passed.toLocaleString("en-US")} / ${source.qualification.developmentValidation.tests.toLocaleString("en-US")} tests.

> **Evidence is authoritative. Reports and charts are projections over evidence.**

No monetary saving is claimed: this local backend supplied no authoritative monetary billing record. No individual optimisation is credited with the full improvement.
`;

const csvHeader = [
  "configuration",
  "work_parcel_id",
  "job_run_id",
  "invocation_id",
  "runtime_version",
  "runtime_sha256",
  "model_sha256",
  "context_tokens",
  "kv_cache",
  "draft_mtp_maximum",
  "input_tokens",
  "cached_input_tokens",
  "output_tokens",
  "total_tokens",
  "prompt_tokens_per_second",
  "generation_tokens_per_second",
  "time_to_first_token_seconds",
  "elapsed_seconds",
  "verification",
];
const csvRows = runs.flatMap((run) =>
  run.invocations.map((item) => [
    run.label,
    run.workParcelId,
    run.jobRunId,
    item.id,
    run.runtime.version,
    run.runtime.sha256,
    source.model.sha256,
    run.configuration.contextTokens,
    run.configuration.kvCache,
    run.configuration.speculativeDraftMaximum,
    item.inputTokens,
    item.cachedInputTokens,
    item.outputTokens,
    item.totalTokens,
    item.promptTokensPerSecond,
    item.generationTokensPerSecond,
    item.timeToFirstTokenSeconds,
    item.elapsedSeconds,
    run.independentVerification,
  ]),
);
const csvText = `${[csvHeader, ...csvRows]
  .map((row) => row.map(csv).join(","))
  .join("\n")}\n`;

const htmlRows = runs
  .map(
    (run) => `<tr>
      <th scope="row">${escapeHtml(run.label)}</th>
      <td>${escapeHtml(run.runtime.version)}</td>
      <td>${escapeHtml(run.configuration.kvCache)}</td>
      <td>${format(run.summary.meanPromptTokensPerSecond)}</td>
      <td><strong>${format(run.summary.meanGenerationTokensPerSecond)}</strong></td>
      <td>${format(run.summary.meanTimeToFirstTokenSeconds)} s</td>
      <td>${escapeHtml(run.independentVerification)}</td>
    </tr>`,
  )
  .join("\n");
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Agent Control Lab — P5000 × Qwen3.8-27B report</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #07131f; color: #eaf5fb; }
    * { box-sizing: border-box; }
    body { margin: 0; background: radial-gradient(circle at top, #123049, #07131f 54rem); }
    main { width: min(1120px, calc(100% - 2rem)); margin: 0 auto; padding: 4rem 0 6rem; }
    .eyebrow { color: #48e0a4; letter-spacing: .12em; text-transform: uppercase; font-weight: 800; }
    h1 { font-size: clamp(2.25rem, 6vw, 4.8rem); line-height: 1; margin: .5rem 0 1rem; }
    .lead { color: #b2c9d8; font-size: 1.2rem; max-width: 72ch; }
    .result { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
    .card, section { background: rgba(9, 29, 44, .88); border: 1px solid #24465d; border-radius: 18px; padding: 1.25rem; }
    .value { color: #4ee3a5; display: block; font-size: 2rem; font-weight: 850; }
    section { margin-top: 1.25rem; }
    img { display: block; width: 100%; height: auto; border-radius: 18px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: .8rem; border-bottom: 1px solid #29475a; text-align: left; }
    th { color: #c7dce8; }
    code { overflow-wrap: anywhere; color: #80d5ff; }
    .note { border-left: 4px solid #f2b64c; }
    a { color: #70d4ff; }
    @media (max-width: 720px) { main { padding-top: 2rem; } .table-wrap { overflow-x: auto; } }
  </style>
</head>
<body>
<main>
  <p class="eyebrow">Agent Control Lab · Physical benchmark</p>
  <h1>Quadro P5000 × Qwen3.8-27B</h1>
  <p class="lead">Two real, governed 32K configurations on the same hardware and immutable model. Every invocation completed and the Work Parcels passed independent verification.</p>
  <div class="result">
    <div class="card"><span class="value">${format(baseline.summary.meanGenerationTokensPerSecond)}</span>baseline generated tok/s</div>
    <div class="card"><span class="value">${format(optimised.summary.meanGenerationTokensPerSecond)}</span>optimised generated tok/s</div>
    <div class="card"><span class="value">${format(speedup)}×</span>measured throughput speedup</div>
  </div>
  <img src="../../assets/benchmarks/p5000-qwen3.8-27b-generation-throughput.svg" alt="Bar chart comparing baseline and optimised generation throughput">
  <section>
    <h2>Measured comparison</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Configuration</th><th>llama.cpp</th><th>KV</th><th>Prompt tok/s</th><th>Generation tok/s</th><th>TTFT</th><th>Verification</th></tr></thead>
      <tbody>${htmlRows}</tbody>
    </table></div>
  </section>
  <section class="note">
    <h2>Interpretation boundary</h2>
    <p>${escapeHtml(source.comparison.interpretation)} Runtime build, KV format, draft-MTP and output ceiling changed. No single-change or monetary-saving claim is made.</p>
  </section>
  <section>
    <h2>Evidence</h2>
    <p><strong>Qualification:</strong> <code>${escapeHtml(source.qualification.id)}</code><br>
       <strong>Agent Control commit:</strong> <code>${escapeHtml(source.qualification.agentControlSourceCommit)}</code><br>
       <strong>Model SHA-256:</strong> <code>${escapeHtml(source.model.sha256)}</code></p>
    <p><a href="report.md">Markdown</a> · <a href="report.json">JSON</a> · <a href="report.csv">CSV</a> · <a href="source-data.json">privacy-safe source projection</a> · <a href="manifest.json">manifest</a></p>
    <p><strong>Evidence is authoritative. Reports and charts are projections over evidence.</strong></p>
  </section>
</main>
</body>
</html>
`;

const outputs = new Map([
  [README_PATH, renderedReadme],
  [CHART_PATH, chart],
  [path.join(REPORT_DIR, "report.md"), markdown],
  [path.join(REPORT_DIR, "report.json"), `${JSON.stringify(report, null, 2)}\n`],
  [path.join(REPORT_DIR, "report.csv"), csvText],
  [path.join(REPORT_DIR, "report.html"), html],
]);

const sourceRelative = path.relative(ROOT, SOURCE_PATH).split(path.sep).join("/");
const manifest = {
  schema: "agent-control-lab.report-manifest/v1",
  generatedAt: source.qualification.completedAt,
  source: {
    path: sourceRelative,
    sha256: sha256(sourceText),
    sizeBytes: Buffer.byteLength(sourceText),
  },
  files: [...outputs].map(([target, content]) => ({
    path: path.relative(ROOT, target).split(path.sep).join("/"),
    sha256: sha256(content),
    sizeBytes: Buffer.byteLength(content),
  })),
};
outputs.set(
  path.join(REPORT_DIR, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

let mismatches = 0;
for (const [target, content] of outputs) {
  if (CHECK) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== content) {
      console.error(`generated_file_mismatch: ${path.relative(ROOT, target)}`);
      mismatches += 1;
    }
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
    console.log(`wrote ${path.relative(ROOT, target)}`);
  }
}
if (mismatches) process.exit(1);
if (CHECK) console.log("example benchmark report is reproducible");
