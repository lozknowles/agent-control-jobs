# Maintenance Plan

Propose a maintenance schedule using the available evidence.

Pattern: **Worker Augmentation**. Category: business. Target effect: read-only.

## Example

Machine A vibration above threshold; maintenance window Sunday; machine B normal. Draft A inspection schedule without actuating machinery.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify maintenance-plan result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [maintenance](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
