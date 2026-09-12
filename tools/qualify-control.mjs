// Opt-in read-only development-host probe through actual Agent Control classes.
// It never contacts an existing service, modifies its state or invokes a model.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { getJob, jobDigest, digest, json } from "./library.mjs";
const [acRoot, output, grant] = process.argv.slice(2);
if (!acRoot || !output || grant !== "--approved-development-read-only")
  throw Error(
    "Usage: node --import /AC/node_modules/tsx/dist/loader.mjs tools/qualify-control.mjs /AC output.json --approved-development-read-only",
  );
const revision = execFileSync("git", ["-C", acRoot, "rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
if (revision !== "7c40497e77570efe9d644b959a0b2ebe5d776127")
  throw Error("unreviewed_controller_revision");
const load = (rel) => import(pathToFileURL(path.join(acRoot, rel)).href);
const { JobCatalog } = await load("src/control/job-catalog.ts");
const {
  ActionRegistry,
  ArtifactStore,
  JobRuntime,
  ResourceLockManager,
  RunLedger,
  WorkerRegistry,
} = await load("src/control/job-runtime.ts");
const { WorkParcelCoordinator, WorkParcelStore } = await load(
  "src/control/work-parcels.ts",
);
const startedAt = new Date().toISOString(),
  state = fs.mkdtempSync(path.join(os.tmpdir(), "ac-library-readonly-"));
const actions = new ActionRegistry(),
  observations = {};
const probes = {
  "machine-health": () => {
    const v = {
      platform: os.platform(),
      cpu_count: os.cpus().length,
      total_bytes: os.totalmem(),
      free_bytes: os.freemem(),
      load: os.loadavg(),
    };
    if (
      v.cpu_count < 1 ||
      v.total_bytes <= 0 ||
      v.free_bytes < 0 ||
      v.free_bytes > v.total_bytes
    )
      throw Error("invalid_machine_observation");
    return v;
  },
  "disk-space-check": () => {
    const v = fs.statfsSync(state);
    if (v.blocks <= 0 || v.bavail < 0 || v.bavail > v.blocks)
      throw Error("invalid_filesystem_observation");
    return {
      block_bytes: v.bsize,
      total_blocks: v.blocks,
      available_blocks: v.bavail,
      used_percent: (100 * (v.blocks - v.bfree)) / v.blocks,
      scope: "isolated-run-filesystem",
    };
  },
  "gpu-inspection": () => {
    try {
      const text = execFileSync(
        "nvidia-smi",
        [
          "--query-gpu=memory.total,memory.used,utilization.gpu",
          "--format=csv,noheader,nounits",
        ],
        { encoding: "utf8", timeout: 10000, maxBuffer: 65536 },
      );
      const gpus = text
        .trim()
        .split("\n")
        .map((line) => {
          const [total_mib, used_mib, utilization_percent] = line
            .split(",")
            .map(Number);
          if (
            ![total_mib, used_mib, utilization_percent].every(
              Number.isFinite,
            ) ||
            total_mib <= 0 ||
            used_mib < 0 ||
            used_mib > total_mib
          )
            throw Error("invalid_gpu_observation");
          return { total_mib, used_mib, utilization_percent };
        });
      return { gpus, process_attribution: "NOT_TESTED" };
    } catch (e) {
      return {
        blocked: true,
        reason:
          e.code === "ENOENT"
            ? "nvidia-smi-unavailable"
            : "gpu-probe-unavailable",
      };
    }
  },
};
for (const [id, probe] of Object.entries(probes))
  actions.registerControl(`library.${id}@1.0.0`, async () => {
    const value = { ...probe(), observed_at: new Date().toISOString() };
    observations[id] = value;
    return {
      artifacts: [{ name: "result", value }],
      verification: ["observation-recorded"],
      evidence: [`sha256:${digest(json(value))}`],
    };
  });
const catalog = new JobCatalog(actions.ids());
for (const id of Object.keys(probes))
  catalog.addJob({
    apiVersion: "agent-control/v1",
    kind: "Job",
    metadata: { id, name: id, version: "1.0.0" },
    spec: {
      priority: "normal",
      concurrency: "queue",
      steps: [
        {
          id: "inspect",
          action: `library.${id}@1.0.0`,
          requires: ["development.read-only"],
          outputs: [
            {
              name: "result",
              type: "application/json",
              schema: "library-live-observation/v1",
              version: "1.0.0",
            },
          ],
          verification: ["observation-recorded"],
        },
      ],
    },
  });
const workers = new WorkerRegistry().register({
  id: "development-controller",
  capabilities: ["development.read-only"],
  health: "healthy",
  capacity: 1,
  active: 0,
  observedAt: startedAt,
});
const ledger = new RunLedger(path.join(state, "runs.json")),
  artifacts = new ArtifactStore(path.join(state, "artifacts"));
const runtime = new JobRuntime(
  catalog,
  actions,
  workers,
  ledger,
  artifacts,
  new ResourceLockManager(path.join(state, "locks.json")),
);
const plan = {
  objective:
    "Inspect development host machine, disk and GPU without altering services",
  planner: {
    kind: "deterministic",
    reason:
      "Explicit read-only development qualification scope; no model invocation",
  },
  stages: Object.keys(probes).map((id, i, ids) => ({
    id,
    name: id,
    job: `${id}@1.0.0`,
    dependsOn: i ? [ids[i - 1]] : [],
  })),
};
const coordinator = new WorkParcelCoordinator(
  runtime,
  new WorkParcelStore(path.join(state, "parcels.json")),
  { plan: () => plan },
);
const parcel = await coordinator.submit(
  plan.objective,
  "job-library-maintainer",
);
for (let i = 0; i < 20; i++) {
  await coordinator.tick();
  await runtime.tick();
  await coordinator.tick();
  if (
    ["SUCCEEDED", "FAILED", "CANCELLED"].includes(
      coordinator.get(parcel.id).status,
    )
  )
    break;
}
const final = coordinator.get(parcel.id);
const receipt = {
  schema: "agent-control-jobs.control-integration/v1",
  started_at: startedAt,
  ended_at: new Date().toISOString(),
  controller_revision: revision,
  adapter_sha256: digest(fs.readFileSync(new URL(import.meta.url))),
  scope:
    "live read-only control integration; no model, no production actions, no physical handset qualification",
  authority:
    "Explicit maintainer request plus approved-development-read-only flag; isolated runtime state",
  model: null,
  parcel_id: final.id,
  parcel_status: final.status,
  decision: final.decision?.outcome,
  jobs: final.stages.map((s) => ({
    id: s.id,
    job_version: getJob(s.id).manifest.version,
    job_digest: jobDigest(getJob(s.id)),
    run_id: s.runId,
    status: s.status,
    observations: observations[s.id],
    observation_sha256: digest(json(observations[s.id] ?? null)),
    artifacts: s.runId
      ? artifacts.list(s.runId).map((a) => ({ id: a.id, sha256: a.sha256 }))
      : [],
    qualification: observations[s.id]?.blocked
      ? "BLOCKED"
      : "CONTROL_OBSERVATION_ONLY",
  })),
  timeline: final.audit.timeline.map((e) => ({ type: e.type, at: e.at })),
  limitations: [
    "No LLM reasoning exercised",
    "No generic library importer installed",
    "No process-level GPU cause investigation",
    "No canonical live-agent qualification claimed",
  ],
  private_state_sha256: digest(
    fs.readFileSync(path.join(state, "parcels.json")),
  ),
};
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, json(receipt));
console.log(json(receipt));
if (final.status !== "SUCCEEDED") process.exitCode = 1;
// Retain isolated evidence privately for audit; never delete or mutate controller state.
