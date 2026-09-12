# Csv Analysis

Analyse this dataset and explain the findings.

Pattern: **Worker Augmentation**. Category: data. Target effect: read-only.

## Example

CSV rows: month,amount
Jan,10
Feb,20
Mar,30. Report total and mean; preserve units as unspecified.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify csv-analysis result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [reports](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [anomaly-detection](variants/anomaly-detection.json), [campaign-report](variants/campaign-report.json).
