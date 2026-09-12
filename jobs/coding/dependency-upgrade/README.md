# Dependency Upgrade

Upgrade this dependency and verify compatibility.

Pattern: **Worker Augmentation**. Category: coding. Target effect: repository-mutation.

## Example

Dependency v1 uses connect(url); v2 requires connect({url}). Two call sites remain positional.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify dependency-upgrade result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [debt](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
