# Repository Health Audit

Inspect this repository and report actionable problems.

Pattern: **Worker Augmentation**. Category: coding. Target effect: read-only.

## Example

Repository inventory: README.md, src/app.mjs, package.json. No test script or lockfile.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify repository-health-audit result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [code-research](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [architecture-review](variants/architecture-review.json).
