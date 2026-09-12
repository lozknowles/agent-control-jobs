# Fan Out Research

Split this research into independent questions and combine the evidence.

Pattern: **Process Automation**. Category: parallel. Target effect: read-only.

## Example

Worker A finds source S1 cost=10; worker B finds S2 latency=20. Aggregate both, retain attribution.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify fan-out-research result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [parallel-research](https://www.anthropic.com/engineering/multi-agent-research-system). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [parallel-code-investigation](variants/parallel-code-investigation.json).
