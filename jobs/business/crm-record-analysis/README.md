# Crm Record Analysis

Check these customer records for inconsistencies.

Pattern: **Worker Augmentation**. Category: business. Target effect: read-only.

## Example

CRM A and B share registration ID R1 but different display names. Record C has no registration ID.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify crm-record-analysis result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [sales](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
