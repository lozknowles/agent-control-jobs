# Review Pull Request

Review this pull request.

Pattern: **Worker Augmentation**. Category: coding. Target effect: read-only.

## Example

Diff changes authorisation from role === admin to role !== guest. Roles include member.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify review-pull-request result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [code-research](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
