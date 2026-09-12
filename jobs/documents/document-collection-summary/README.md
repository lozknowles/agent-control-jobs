# Document Collection Summary

Summarise these documents using current authoritative sources.

Pattern: **Enterprise Intelligence**. Category: documents. Target effect: read-only.

## Example

Validated policy v2 says expenses cap 50. Superseded v1 says 40. Draft v3 says 60. Use only validated current policy.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify document-collection-summary result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [knowledge](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
