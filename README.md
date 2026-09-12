# Agent Control Job Library

**Real jobs. Real evidence. Reproducible qualification.**

A community library of governed real-world agent jobs and reproducible qualification workloads.

Start with a simple objective: fix a failing test, diagnose a service, summarise documents, prioritise tickets or resume interrupted work. **The job definition stays simple; Agent Control supplies execution, routing, permissions, recovery and evidence.**

Version **0.1.0** includes **50 canonical jobs**, related scenario variants, **12 suites**, a generated catalogue and a reference readiness evaluator. These are reviewed definitions and bounded acceptance cases. They are **not 50 physically qualified agents**. See [current evidence and limitations](docs/QUALIFICATION.md).

> Presence in the Job Library does not grant execution authority.

## Start here

Requires Git, Node.js 22 or newer and npm. Works on Linux and Windows. No model account is needed to inspect the library or run its tests.

```sh
git clone https://github.com/lozknowles/agent-control-jobs.git
cd agent-control-jobs
npm ci --ignore-scripts
npm run check
node tools/cli.mjs list
node tools/cli.mjs search gpu
node tools/cli.mjs inspect service-health-check
node tools/cli.mjs suite AC-QUAL-CORE
node tools/cli.mjs provenance inbox-triage
node tools/cli.mjs compatibility service-health-check examples/estate.json
```

The last command deliberately reports missing or stale prerequisites. The example estate grants no authority. A successful compatibility query has exit code 0 even when its result is BLOCKED; inspect the returned state.

Optional local CLI installation:

```sh
npm link --ignore-scripts
ac-jobs search gpu
```

To check the published catalogue or regenerate it after editing:

```sh
node tools/cli.mjs catalogue --check
npm run catalogue
```

To exercise a **fixture validator**, not an agent:

```sh
node tools/cli.mjs verify csv-analysis jobs/data/csv-analysis/expected/result.json
```

That command validates a reference answer. It is a validator self-check, never qualification evidence. To test a worker, supply only its prompt and fixture input, then validate the independently produced result. Follow [the runner contract](docs/RUNNER.md).

## Find a useful job

[Browse the generated catalogue](catalogue/index.json), search with the CLI, or explore [jobs](jobs). `common_job: true` identifies useful starting points, including service and machine checks, model comparison, document extraction, research and resume.

The three high-level patterns are **Process Automation**, **Worker Augmentation** and **Enterprise Intelligence**. Domain categories and tags provide finer filtering. Operations, governance, recovery, multi-agent and qualification workloads exercise controller behaviour without turning each job into a bespoke agent graph.

Each job has a one-sentence objective, a manifest, a small acceptance fixture, expected facts and a declarative validator. More demanding execution belongs in adapters and the controller. [Create your first job](docs/CREATE-YOUR-FIRST-JOB.md) without learning Agent Control internals.

## Research and provenance

The [research inventory](research/REAL-WORLD-USE-CASES.md) contains 34 selected records from 10 sources. It includes the supplied Dataiku guide, published product workflows, customer examples and open-source capability documentation. [Methodology](research/METHODOLOGY.md) explains selection bias, overlap and the distinction between advertised architectures and observed deployments.

[Traceability](research/USE-CASE-TRACEABILITY.md) connects each researched record to workload components, requirements and suites. [Coverage](research/COVERAGE.md) reports gaps as well as representation. No industry coverage percentage or end-to-end qualification is claimed.

## Readiness and governance

The evaluator compares job requirements with an explicit estate snapshot and scoped grant:

**READY / CONFIGURATION REQUIRED / CONNECTOR REQUIRED / CREDENTIAL REQUIRED / APPROVAL REQUIRED / UNSUPPORTED**. `BLOCKED` additionally covers stale or invalid evidence and operational holds.

All unmet reasons are retained. READY is advisory, never authority. A runtime must recheck the exact job digest, input digest, target, permissions, approval expiry, budget and observation freshness immediately before dispatch. [Readiness contract](docs/COMPATIBILITY.md).

Secrets stay in the controller’s credential store. Downloads and community contributions are untrusted. Manifests declare reads, writes, deployments, service control, financial actions and communications explicitly. [Security and trust boundary](SECURITY.md).

## Qualification and integration

A refusal can pass when refusal is the expected result and the evidence proves no unauthorised effect. Missing test infrastructure is a blocked qualification attempt, not a pass. Suites retain their full denominator. [Qualification rules](docs/QUALIFICATION.md).

[The Agent Control integration proposal](docs/AGENT-CONTROL-INTEGRATION.md) is grounded in inspected implementation revisions. [Dashboard contract](docs/DASHBOARD-CONTRACT.md) supports browse, inspect, compatibility and qualification history. This repository does not install a dashboard or silently submit jobs.

## Contribute

Small useful jobs are welcome. Describe the objective, inputs, requirements, permissions and how to recognise a correct result. Start with the [simple template](templates/simple-job.yaml), then read [CONTRIBUTING.md](CONTRIBUTING.md). CI checks manifests, references, checksums, permission consistency, fixtures, tests, local links and common secret patterns. Static checks cannot prove a job safe.

Library, specification, jobs, suites and catalogue have independent versions. See [versioning](docs/VERSIONING.md). Code and original job definitions use the [MIT licence](LICENSE); external source documents retain their own rights and are not redistributed.
