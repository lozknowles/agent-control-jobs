import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT } from "../tools/library.mjs";

const REPORT_DIR = path.join(ROOT, "reports/p5000-qwen3.8-27b");
const read = (relativePath) =>
  fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const digest = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

test("example report is reproducible from the committed evidence projection", () => {
  const result = spawnSync(
    process.execPath,
    [path.join(ROOT, "tools/generate-example-benchmark.mjs"), "--check"],
    { cwd: ROOT, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /report is reproducible/);
});

test("example comparison is physically successful and independently verified", () => {
  const source = JSON.parse(read("reports/p5000-qwen3.8-27b/source-data.json"));
  const report = JSON.parse(read("reports/p5000-qwen3.8-27b/report.json"));
  assert.equal(source.comparison.runs.length, 2);
  assert.deepEqual(Object.keys(source.hardware).sort(), [
    "accelerator",
    "cudaVersion",
    "memoryGiB",
    "operatingSystem",
    "processor",
    "system",
    "vramMiB",
  ]);
  assert.deepEqual(source.hardware, {
    system: "HP ZBook 17 G4 workstation",
    processor: "Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz",
    memoryGiB: 64,
    accelerator: "NVIDIA Quadro P5000",
    vramMiB: 16384,
    operatingSystem: "Ubuntu 24.04.5 LTS",
    cudaVersion: "13.0 (driver-reported compatibility)",
  });
  assert.equal(source.model.identity, "Qwen3.8-27B-Q3_K_M");
  assert.ok(source.comparison.runs.every((run) => run.status === "SUCCEEDED"));
  assert.ok(
    source.comparison.runs.every(
      (run) =>
        run.workParcelStatus === "SUCCEEDED" &&
        run.independentVerification === "PASS" &&
        run.invocations.length === 3 &&
        run.invocations.every((invocation) => invocation.status === "SUCCEEDED"),
    ),
  );
  assert.ok(report.comparison.measuredResult.generationThroughputSpeedup > 2.5);
  assert.equal(report.claims.monetarySaving, "NOT_CLAIMED");
  assert.equal(
    report.claims.causalAttributionToSingleOptimisation,
    "NOT_CLAIMED",
  );
});

test("report manifest binds every generated download and chart", () => {
  const manifest = JSON.parse(read("reports/p5000-qwen3.8-27b/manifest.json"));
  const source = read(manifest.source.path);
  assert.equal(digest(source), manifest.source.sha256);
  assert.equal(Buffer.byteLength(source), manifest.source.sizeBytes);
  for (const item of manifest.files) {
    const content = read(item.path);
    assert.equal(digest(content), item.sha256, item.path);
    assert.equal(Buffer.byteLength(content), item.sizeBytes, item.path);
  }
  for (const required of ["report.md", "report.html", "report.json", "report.csv"])
    assert.ok(
      manifest.files.some((item) => item.path.endsWith(required)),
      required,
    );
});

test("public benchmark projection excludes private paths, addresses and credentials", () => {
  const publicFiles = [
    "README.md",
    "benchmarks/README.md",
    "reports/README.md",
    "reports/p5000-qwen3.8-27b/source-data.json",
    "reports/p5000-qwen3.8-27b/report.md",
    "reports/p5000-qwen3.8-27b/report.json",
    "reports/p5000-qwen3.8-27b/report.csv",
    "reports/p5000-qwen3.8-27b/report.html",
  ];
  const content = publicFiles.map(read).join("\n");
  for (const pattern of [
    /\/fast\//,
    /\/home\//,
    /[A-Za-z]:\\/,
    /100\.\d+\.\d+\.\d+/,
    /"(?:host|hostname|node|nodeId|machineId|username|networkInterfaces|ipAddress|privateAddress|endpoint)"\s*:/i,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
  ])
    assert.doesNotMatch(content, pattern);
});

test("supplied Agent Control Lab artwork remains byte-identical", () => {
  const image = fs.readFileSync(
    path.join(ROOT, "assets/branding/agent-control-lab-header.png"),
  );
  assert.equal(image.length, 1_732_041);
  assert.equal(
    digest(image),
    "62daacbad7c64145636aeea1ba5bd6047f915e4adfcf7d46f13fd6a7240c646d",
  );
});

test("landing page keeps Jobs compatibility and real navigation targets", () => {
  const readme = read("README.md");
  assert.match(readme, /# Agent Control Lab/);
  assert.match(readme, /Benchmark · Experiment · Prove · Share/);
  assert.match(readme, /agent-control-jobs/);
  assert.match(readme, /ac-jobs search gpu/);
  assert.match(
    readme,
    /https:\/\/github\.com\/lozknowles\/agent-control#agent-control-atlas/,
  );
  assert.match(readme, /reports\/p5000-qwen3\.8-27b\/report\.json/);
  assert.ok(fs.existsSync(REPORT_DIR));
});
