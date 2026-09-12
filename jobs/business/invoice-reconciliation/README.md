# Invoice Reconciliation

Reconcile these records and report mismatches.

Pattern: **Worker Augmentation**. Category: business. Target effect: read-only.

## Example

Invoice INV-1 total 120; purchase order PO-1 authorised 100. Same supplier. No payment authority.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify invoice-reconciliation result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [tariffs](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md). Related scenarios: [asset-reconciliation](variants/asset-reconciliation.json), [timetable-reconciliation](variants/timetable-reconciliation.json).
