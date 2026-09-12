# Service Health Check

Check whether this service is healthy.

Pattern: **Worker Augmentation**. Category: operations. Target effect: read-only.

## Example

service sample-worker active; last probe 200; observed at run start. Report health without restarting.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify service-health-check result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
