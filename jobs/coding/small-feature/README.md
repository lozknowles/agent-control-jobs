# Small Feature

Implement this small feature and test it.

Pattern: **Worker Augmentation**. Category: coding. Target effect: repository-mutation.

## Example

Implement clamp(value,min,max). Acceptance: clamp(8,0,5)=5; clamp(-1,0,5)=0; clamp(3,0,5)=3. Reject min>max.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify small-feature result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

An independent code acceptance check is included: `node validators/code-test.mjs /absolute/path/to/candidate.mjs`. Execute candidates only in a disposable sandbox without credentials or network.

Origin: [feature](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
