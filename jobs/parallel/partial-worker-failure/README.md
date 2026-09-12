# Partial Worker Failure

Preserve useful results when one worker fails.

Pattern: **Process Automation**. Category: parallel. Target effect: read-only.

## Example

Worker A returned result RA; worker B lost. No approved substitute. Preserve RA and declare gap B.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify partial-worker-failure result.json`. Expected fixture outcome: **DEGRADED**. A JSON match is a fixture check, not live qualification.

Origin: [parallel-research](https://www.anthropic.com/engineering/multi-agent-research-system). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [worker-substitution](variants/worker-substitution.json).
