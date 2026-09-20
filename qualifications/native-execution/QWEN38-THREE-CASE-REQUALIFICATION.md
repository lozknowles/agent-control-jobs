# Qwen3.8-27B three-case requalification

Date: 20 September 2026

Status: **1536-TOKEN PLAIN COMPLETION/FORMAT GATE PASSED; SEMANTIC ACCEPTANCE 2/3**

The frozen plain-arm cases were rerun through Agent Control's native Work Parcel → Job Runtime path after raw transport evidence proved output-budget exhaustion. No prompt, fixture, verifier, acceptance criterion, tool permission, model, runtime, GPU setting, context, thread count, parallelism, or governed deadline changed.

## Budget results

| Budget | Result for insufficient-evidence case | Qualification meaning |
|---:|---|---|
| 768 | 3/3 diagnostic observations ended `length` at 768 with no assistant content | insufficient, deterministic output exhaustion |
| 1024 | isolated replay stopped naturally at 995, but all nine insufficient-evidence calls in the matched comparison later ended `length` | intermittently sufficient; not reliable |
| 1536 | plain three-case gate completed naturally and formatted 3/3 | smallest demonstrated common plain-arm envelope |

## Plain three-case gate at 1536

| Frozen case | Finish | Format | Semantic acceptance | Unsupported claims | Input / cached / output | Wall time |
|---|---|---|---|---:|---:|---:|
| `ev2-heldout-contradicted-timeout` | `stop` | pass | pass | 0 | 609 / 0 / 574 | 98.123 s |
| `ev2-heldout-insufficient-owner` | `stop` | pass | fail: `outcome-mismatch` | 0 | 615 / 42 / 995 | 167.744 s |
| `ev2-heldout-supported-disabled` | `stop` | pass | pass | 0 | 615 / 42 / 522 | 91.066 s |

Totals: 3/3 completed, 3/3 format compliant, 2/3 accepted, zero unsupported claims, 1,839 input tokens, 84 cached input tokens, 2,091 output tokens, and 356.920 seconds recorded model elapsed time. The insufficient-evidence output had every expected fact correct but used `COMPLETE` instead of the frozen expected `DEGRADED` outcome.

Evidence:

- `QWEN38-THREE-CASE-REQUALIFICATION-1024.json`
- `QWEN38-THREE-CASE-REQUALIFICATION-1536.json`

The gate to perform the matched 27-call regression comparison was satisfied by natural completion and required-format compliance. Semantic acceptance remained a separately reported measurement.
