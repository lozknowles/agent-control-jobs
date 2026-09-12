# Dependency Graph

Run these dependent tasks in the correct order.

Pattern: **Process Automation**. Category: parallel. Target effect: read-only.

## Example

DAG A and B independent; C depends on both. B fails. C must not start.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify dependency-graph result.json`. Expected fixture outcome: **BLOCKED**. A JSON match is a fixture check, not live qualification.

Origin: [parallel-research](https://www.anthropic.com/engineering/multi-agent-research-system). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
