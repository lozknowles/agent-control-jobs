# Fix Failing Test

Fix this failing test.

Pattern: **Worker Augmentation**. Category: coding. Target effect: repository-mutation.

## Example

Patch sum(values) in fixture.mjs to include the final element. Preserve empty-array output 0. Run its tests.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify fix-failing-test result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

An independent code acceptance check is included: `node validators/code-test.mjs /absolute/path/to/candidate.mjs`. Execute candidates only in a disposable sandbox without credentials or network.

Origin: [bugfix](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [diagnose-failing-test](variants/diagnose-failing-test.json).
