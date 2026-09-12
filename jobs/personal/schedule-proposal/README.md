# Schedule Proposal

Propose a time that meets these scheduling constraints.

Pattern: **Worker Augmentation**. Category: personal. Target effect: read-only.

## Example

Availability Monday 09:00-10:00 and 09:30-11:00 UTC. Need 30-minute meeting. Prepare proposal only.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify schedule-proposal result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [leave](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [leave-request-review](variants/leave-request-review.json).
