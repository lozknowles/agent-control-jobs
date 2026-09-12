# Source Comparison

Compare these sources and explain disagreements.

Pattern: **Enterprise Intelligence**. Category: research. Target effect: read-only.

## Example

Source A says sample=100; source B says sample=120 for same study/date. No primary dataset available.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify source-comparison result.json`. Expected fixture outcome: **ESCALATED**. A JSON match is a fixture check, not live qualification.

Origin: [papers](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
