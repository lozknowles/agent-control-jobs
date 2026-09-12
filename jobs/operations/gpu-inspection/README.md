# Gpu Inspection

Find the cause of this machine’s high GPU usage.

Pattern: **Worker Augmentation**. Category: operations. Target effect: read-only.

## Example

GPU total 8192 MiB, allocated 7168 MiB. Process renderer-worker uses 6144 MiB and background-worker uses 1024 MiB. Requested additional allocation 2048 MiB. Explain the main contributor without stopping processes.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify gpu-inspection result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
