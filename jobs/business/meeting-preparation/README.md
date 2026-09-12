# Meeting Preparation

Prepare a meeting brief from these records.

Pattern: **Worker Augmentation**. Category: business. Target effect: read-only.

## Example

Agenda: budget. Previous minutes: approval pending, owner team-finance. Latest message: figures still provisional.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify meeting-preparation result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [mail](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
