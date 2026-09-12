# Machine Health

Check this machine and report health problems.

Pattern: **Worker Augmentation**. Category: operations. Target effect: read-only.

## Example

Host sample: CPU 20%, memory 8/16 GiB, load 0.6 on 4 cores; disk 40%.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify machine-health result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: agent-control-job-library-requirements-2026-09-12. Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [configuration-drift](variants/configuration-drift.json), [remote-health-report](variants/remote-health-report.json).
