# Customer Support Triage

Prioritise these support tickets and route exceptions.

Pattern: **Worker Augmentation**. Category: business. Target effect: read-only.

## Example

Ticket reports unauthorised account access and includes sensitive data. Route to security support; redact personal fields.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify customer-support-triage result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [support](https://aws.amazon.com/ai/generative-ai/use-cases/agent-assist/). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [service-request-triage](variants/service-request-triage.json).
