# Technical Research

Research this question and provide evidence.

Pattern: **Enterprise Intelligence**. Category: research. Target effect: read-only.

## Example

Source A v1 states protocol max=10. Source B v2 states max=20. Question asks current documented maximum. Cite B, retain version distinction.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify technical-research result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [papers](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [product-comparison](variants/product-comparison.json).
