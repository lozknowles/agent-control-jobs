# Checkpoint Resume

Resume this interrupted job without repeating completed work.

Pattern: **Process Automation**. Category: recovery. Target effect: read-only.

## Example

Durable checkpoint records completed A,B and pending C. Resume runs C once; do not repeat A or B.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify checkpoint-resume result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [long-coding](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [model-failover](variants/model-failover.json), [baton-handover](variants/baton-handover.json).
