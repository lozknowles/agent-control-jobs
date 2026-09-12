# Csv Analysis

CSV rows: month,amount
Jan,10
Feb,20
Mar,30. Report total and mean; preserve units as unspecified.

Origin: [reports](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) (workload adaptation; not a reproduction of the vendor deployment).

## Acceptance workflow

1. Bind fixtures/input.json in an isolated run and supply prompt.md to the worker.
2. Keep expected/ and validators/ outside worker access.
3. Record outcome, task facts, observations and every action in result.json.
4. Run `ac-jobs verify my-first-job result.json`. This checks this fixture only.
5. Review evidence and side effects independently before recording qualification.

Expected terminal outcome: **COMPLETE**. The declarative validator checks task-specific facts and rejects undeclared fixture actions. Mutating code workloads additionally require an independent code test; a JSON answer alone cannot qualify their implementation.

## Authority and live binding

Declared maximum effect: read-only; output writes are confined to run-output. Downloading grants no authority. See [live variant](variants/live.md) and [qualification rules](../../docs/QUALIFICATION.md).
