# Diagnose Unavailable Service

Diagnose why this service is down.

Pattern: **Worker Augmentation**. Category: operations. Target effect: read-only.

## Example

Frontend returns 502; upstream log connection refused on port 8080; upstream stopped.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify diagnose-unavailable-service result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [service](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
