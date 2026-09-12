# Benchmark Model

Measure this model against a fixed workload.

Pattern: **Worker Augmentation**. Category: llm. Target effect: read-only.

## Example

Fixed task results: latencies 100,200,300 ms; passed 2 of 3; tokens and monetary cost not reported.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify benchmark-model result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [context-qualification](variants/context-qualification.json), [structured-output](variants/structured-output.json), [tool-use](variants/tool-use.json).
