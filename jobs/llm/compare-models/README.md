# Compare Models

Compare these models on the same workload.

Pattern: **Worker Augmentation**. Category: llm. Target effect: read-only.

## Example

Same dataset: local A 2/3 correct at 100ms; API B 3/3 correct at 200ms. Cost unknown. Keep quality and latency separate.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify compare-models result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
