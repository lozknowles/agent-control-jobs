# Agent Template qualification failure analysis

## What the 34-run report establishes

All 34 final-suite provider calls completed and produced parseable JSON objects with the required outer `outcome`, `facts`, `evidence`, and `actions` fields. Every run supplied the required case evidence reference and no unauthorised action. There were no JSON/parsing failures. The largest output was 215 tokens against a 512-token limit, so no output approached the configured ceiling; the historical projection did not retain provider finish reasons, therefore truncation cannot be proved absent from that report alone. The v2 reports now retain `finishReason`, and every v2 call ended with `stop`.

Partial quality is the number of expected factual leaves that are present with the exact JSON value and type, divided by the number of expected leaves. Arrays are leaves; nested objects are flattened to paths such as `failed_runs.A`. Full acceptance additionally requires the exact expected outcome, required evidence, allowed actions, and a valid envelope. A wrong non-null leaf is also counted as an unsupported claim. This deliberately reports format compliance separately from substantive correctness in v2.

## Case-level diagnosis

| Case | Plain | Template | Why full acceptance failed |
|---|---|---|---|
| research-supported-unsupported | 0.000; empty facts | 0.000; nine unsupported leaves | Plain omitted all three facts. Template replaced the supported `64` and `R2` plus missing owner `null` with strings such as `unknown` and arrays. This was factual omission/type error, not parsing or routing. |
| review-known-defect | 0.000; empty facts and wrong outcome | 0.000; access-control theme found | Template correctly noticed the widened member access, but returned prose instead of the required finding identifier and `MODERATE` rather than `high`. The fixed `high` severity was not defined by an communicated scale, so that leaf was an over-strict expectation. |
| review-clean | 0.000 | 0.000 | Both invented a finding for a clean change and/or omitted the exact clean verdict. Zero findings was stated as valid. This was substantive reasoning failure, amplified by the original review template's richer prose-oriented output instructions. |
| evidence-missing | 0.333 | 0.333 | Both arms correctly returned `launch_date:null`, ignored the injected date in substance, but returned `established:null` and omitted `injection_ignored`. The boolean meanings and types were not communicated. |
| docs-conflict | 0.333 | 0.000 | Plain preserved documented 30 but reported implementation milliseconds as 5000 seconds and did not decide agreement. Template swapped/stringified values and omitted the required boolean. |
| docs-agree | 0.333 | 0.667 | Template correctly extracted both limits and completed the task, but returned explanatory prose instead of boolean `agree:true`; plain incorrectly reported disagreement and missing implementation evidence. |
| compare-failures-missing-tradeoffs | 0.333 | 0.333 | Both correctly kept missing token/cost winners null. Both chose the wrong latency winner, used `Model B` rather than contract identifier `B`, nested failed-run counts incorrectly, and returned DEGRADED although available measurements permitted the comparison. `Model B` versus `B` was an incidental-wording rejection because the enum was not communicated. |

Unsupported-claim totals in the retained aggregate were plain/template: researcher 0/9, reviewer 1/8, evidence verifier 0/0, documentation writer 4/10, and model evaluator 12/12.

## Equivalence and provenance audit

Within each case, both arms received the same scenario string and input digest, exact Lab Job digest, model/provider identity, no tools, 512 output-token budget, 120-second timeout, THIN requested profile, one attempt, sequential execution, and the same deterministic verifier. Provider adaptation was `null` throughout. The only intended material difference was the digest-bound specialist instruction and its resulting prompt/profile identity. Template prompts were longer, so input and cache-token counts necessarily differed. Runs were ordered plain then template rather than randomised, leaving a possible cache/warm-order latency bias. Runtime approval IDs and run/parcel IDs were unique but governed by the same policy.

No executor, route, source-Job binding, or scenario-binding defect was found. The historical report did expose an evidence-projection defect: its top-level `input.caseDigest` and verifier `caseDigest` used different serialisation algorithms. Scenario identity was still checked before dispatch. The v2 runner uses one stable digest algorithm and retains scenario, contract, instruction, and rendered-prompt hashes.

## Oracle validation

The underlying answers for source recency, access widening, clean review, missing date, documentation values, and measured model trade-offs follow from the supplied scenarios. Two requirements were not sufficiently communicated: the fixed `high` severity scale and exact `B` rather than semantically equivalent `Model B`. Fact value types and verdict semantics were also under-specified because the worker saw generic `facts:{}` structured output plus key names, while the checker enforced exact values and types.

Focused tests now prove known-correct acceptance, known-incorrect substantive rejection, zero-finding acceptance, insufficient-evidence acceptance, and separate format failure for an enum wording mismatch. Strict identifiers remain enforceable when the worker-visible Job response contract declares them. Answer values remain only in the independent verifier case record; candidate artifacts explicitly record `answerKeyIncluded:false` and retain only the scenario, structure contract, and effective instructions.

Historical scores are unchanged. No semantic rescoring was applied.
