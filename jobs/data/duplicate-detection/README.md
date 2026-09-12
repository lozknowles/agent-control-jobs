# Duplicate Detection

Find duplicate files without deleting them.

Pattern: **Worker Augmentation**. Category: data. Target effect: read-only.

## Example

Inventory: a.txt hash X bytes 4; b.txt hash X bytes 4; c.txt hash Y bytes 4. No deletion allowed.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify duplicate-detection result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
