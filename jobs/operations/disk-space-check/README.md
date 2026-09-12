# Disk Space Check

Check disk usage and report capacity risks.

Pattern: **Worker Augmentation**. Category: operations. Target effect: read-only.

## Example

Volume capacity 100 GiB; used 93 GiB. Warning threshold >=90%. Do not delete files.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify disk-space-check result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
