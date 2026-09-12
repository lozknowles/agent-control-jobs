# Draft Response

Draft a response grounded in the supplied policy.

Pattern: **Worker Augmentation**. Category: communications. Target effect: read-only.

## Example

Customer requests refund after 40 days. Policy permits 30 days; exceptions require supervisor. Prepare draft, do not send.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify draft-response result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [response](https://aws.amazon.com/ai/generative-ai/use-cases/agent-assist/). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
