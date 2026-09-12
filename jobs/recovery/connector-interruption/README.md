# Connector Interruption

Preserve progress when this connector becomes unavailable.

Pattern: **Process Automation**. Category: recovery. Target effect: read-only.

## Example

Connector times out twice. Retry budget 2 exhausted. Preserve pending operation K1 without claiming success.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify connector-interruption result.json`. Expected fixture outcome: **BLOCKED**. A JSON match is a fixture check, not live qualification.

Origin: [service](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
