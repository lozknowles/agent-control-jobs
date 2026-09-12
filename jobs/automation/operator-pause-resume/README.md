# Operator Pause Resume

Pause this job and resume only when instructed.

Pattern: **Process Automation**. Category: automation. Target effect: read-only.

## Example

Pause received after step A committed, before B. Persist cursor B and require explicit resume event.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify operator-pause-resume result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [long-coding](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
