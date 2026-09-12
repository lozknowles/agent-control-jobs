# Delayed Dependency

Wait for this dependency within the declared deadline.

Pattern: **Process Automation**. Category: automation. Target effect: read-only.

## Example

Dependency D not ready at deadline 30 seconds. Persist waiting state, do not busy-loop or claim completion.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify delayed-dependency result.json`. Expected fixture outcome: **BLOCKED**. A JSON match is a fixture check, not live qualification.

Origin: [long-coding](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
