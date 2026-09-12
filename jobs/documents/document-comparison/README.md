# Document Comparison

Compare these documents and report meaningful differences.

Pattern: **Enterprise Intelligence**. Category: documents. Target effect: read-only.

## Example

Version A: retention 30 days. Version B: retention 90 days. Both say deletion on request.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify document-comparison result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [contracts](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [course-information-comparison](variants/course-information-comparison.json).
