# Invalid Input

Reject this invalid input before taking action.

Pattern: **Process Automation**. Category: governance. Target effect: read-only.

## Example

Input amount is NaN text but schema requires finite number. Stop before processing.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify invalid-input result.json`. Expected fixture outcome: **BLOCKED**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
