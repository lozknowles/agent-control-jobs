# Endpoint Health

Check this endpoint and report failures.

Pattern: **Worker Augmentation**. Category: operations. Target effect: read-only.

## Example

Three HTTP attempts: 503,503,200. Maximum attempts 3. Preserve each observation.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify endpoint-health result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
