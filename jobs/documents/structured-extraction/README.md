# Structured Extraction

Extract the requested information with document references.

Pattern: **Enterprise Intelligence**. Category: documents. Target effect: read-only.

## Example

Document page 1: Supplier SAMPLE-01. Page 2: Total GBP 120.00. Delivery date not stated. Preserve page references.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify structured-extraction result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [contracts](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
