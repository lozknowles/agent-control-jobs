# Supply Chain Risk

Identify supply-chain risks and propose supported mitigations.

Pattern: **Worker Augmentation**. Category: business. Target effect: read-only.

## Example

Supplier S1 is unavailable and supplies part P1 for product A. Supplier S2 can supply P1 in 5 days, but certification is unverified. Inventory covers 2 days. Recommend investigation, not an order.

## Check the result

Supply prompt.md and the fixture to an independent worker using the [shared runner contract](../../../docs/RUNNER.md). Keep expected/ and validators/ outside worker access. Save result.json and run `ac-jobs verify supply-chain-risk result.json`. Expected fixture outcome: **COMPLETE**. A JSON match is a fixture check, not live qualification.

Origin: [dataiku-supply](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases). Published examples are adapted workload components, not reproduced vendor agents.

[Live binding](variants/live.md).
