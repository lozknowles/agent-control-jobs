# Investigate Regression

Find what caused this regression.

Pattern: **Worker Augmentation**. Category: coding. Target effect: read-only.

## Example

Release A latency 90 ms; B 95 ms; C 900 ms. C adds a serial fetch per record.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify investigate-regression result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [code-research](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [reproduce-defect](variants/reproduce-defect.json).
