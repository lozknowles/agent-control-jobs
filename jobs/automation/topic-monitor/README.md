# Topic Monitor

Monitor this source and report meaningful changes.

Pattern: **Process Automation**. Category: automation. Target effect: read-only.

## Example

Checkpoint hash h1; fresh source hash h1. Notify only on meaningful changes.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify topic-monitor result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [parallel-research](https://www.anthropic.com/engineering/multi-agent-research-system). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
