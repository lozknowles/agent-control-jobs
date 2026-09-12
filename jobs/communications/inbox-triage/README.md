# Inbox Triage

Prioritise these messages and identify outstanding actions.

Pattern: **Worker Augmentation**. Category: communications. Target effect: read-only.

## Example

Messages: M1 asks for password; M2 asks opening hours (FAQ 09:00); M3 says thanks. Draft classifications only.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify inbox-triage result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [mail](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [thread-summary](variants/thread-summary.json).
