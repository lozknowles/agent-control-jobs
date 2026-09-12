# Discover Models

Find available models and their runtime readiness.

Pattern: **Worker Augmentation**. Category: llm. Target effect: read-only.

## Example

Ollama /api/tags contains model alpha digest a1 and beta digest b2. Do not infer context length.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify discover-models result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [inventory](https://docs.ollama.com/api/tags). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [discover-runtimes](variants/discover-runtimes.json).
