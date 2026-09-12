# Documentation Consistency

Check that these instructions match the code.

Pattern: **Worker Augmentation**. Category: coding. Target effect: read-only.

## Example

README says timeout defaults to 30 seconds; code DEFAULT_TIMEOUT_MS = 5000.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify documentation-consistency result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
