# Qwen3.8-27B output-budget qualification

Date: 20 September 2026

Status: **768 TOKENS RESOLVED THE TARGET OUTPUT LIMIT; THREE-CASE RELIABILITY FAILED 2/3; TEMPLATE COMPARISON NOT RUN**

This continuation preserves `QWEN38-27B-NATURAL-CALL.json` and every earlier negative result unchanged. It varied only the finite maximum output-token setting. The model, quantization, runtime, GPU configuration, context, threads, prompt, case, verifier, acceptance criteria, tools, and governed time budgets remained fixed.

## Exact identities

- Model: `/fast/models/qwen3.8-27b/Qwen3.8-27B-Q3_K_M.gguf`, 13,818,690,528 bytes, SHA-256 `7f3b845b563888ec3abc269474cf744bf703a7ce8766dbb7f696c63975facfd7`
- Runtime: `/fast/repos/llama.cpp/build-cuda/bin/llama-server`, build `9371` (`22d9bc441`), SHA-256 `3f1000482d759661cadb1dc9b59f6292f52408ee0d2906298fa001837517fb4e`
- GPU configuration: configured layers `99`, context `8192`, threads `8`, parallel `1`, Quadro P5000
- Job: `hallucination-resistance@1.0.0`, digest `dbf194964b5945cda216fadfb4783b394c83c085b2b488ef929569d2d0525d2e`
- Target case: `ev2-heldout-contradicted-timeout`, digest `258b2629ffefd821c2414c5ab06f08d3143bbe707282a40aef5a56fdd575e34e`

## Progressive output-budget search

| Limit | Actual output | Finish | JSON | Independent verifier | Unsupported claims | Prompt / generation | Wall time |
|---:|---:|---|---|---|---|---|---:|
| 512 | 512 | `length` | invalid, truncated | reject | unavailable | 111.918 / 6.254 tok/s | 87.565 s |
| 768 | 574 | `stop` | valid | pass, substantive pass | 0 | 112.306 / 6.268 tok/s | 97.283 s |
| 1024 | not run | not run | not run | not run | unavailable | unavailable | unavailable |
| 1536 | not run | not run | not run | not run | unavailable | unavailable | unavailable |

The search stopped at the first natural response as required. For the exact target scenario, the minimum tested natural-completion budget is **768 tokens**. That is an experimental qualification setting only; no production default changed.

The 768-token target output was valid JSON, correctly classified the claim as contradicted (`30` versus trusted evidence `5`), passed the independent verifier, and contained no unsupported claims. It recorded 572 meaningful progress events. VRAM peaked at 13,950 MiB for the experimental process, total GPU use at 14,199 MiB, free margin at 2,068 MiB, and RSS at 1,336,860,672 bytes.

Evidence: `QWEN38-27B-OUTPUT-BUDGET-768.json`, SHA-256 `06974407dab0b76ebbf30ecaf11d1441e1851a79a1c1ce329c156c3ed09d30e5`.

## Three-case replication at 768

| Frozen case | Natural completion | Format | Semantic acceptance | Unsupported claims | Tokens input/cached/output | Wall time | Generation rate |
|---|---|---|---|---|---|---:|---:|
| `ev2-heldout-contradicted-timeout` | pass, `stop` | pass | pass | 0 | 609 / 0 / 574 | 97.747 s | 6.240 tok/s |
| `ev2-heldout-insufficient-owner` | fail, finish unavailable | unavailable | unavailable | unavailable | unavailable | 129.659 s | unavailable |
| `ev2-heldout-supported-disabled` | pass, `stop` | pass | pass | 0 | 615 / 42 / 522 | 90.658 s | 6.161 tok/s |

The failed middle case ended as `provider_malformed_response`. No candidate, finish reason, provider timings, token counts, or verifier result were available, so none are represented as zero. The retained evidence cannot determine whether the malformed response originated in stream framing or response decoding.

Replication completion was **2/3**; format compliance and semantic acceptance were **2/3** with the failed attempt retained in the denominator. Successful outputs had zero unsupported claims. Total recorded wall time was 318.064 seconds. The experimental process retained 13,950 MiB VRAM and reached 2,450,079,744-byte RSS during the sequence.

Evidence: `QWEN38-27B-SMALL-REPLICATION-768.json`, SHA-256 `4908a9e3ba422fdab5ea2a3541bc6715cbddef6dd25ec0dfbf93c8a037e97904`.

## Gates and decision

The three-case completion reliability was inadequate, so the template-arm comparison was not run. There are no new plain-versus-EV 1.0.0-versus-EV 1.2.0 comparative results. No fresh held-out material was opened.

- Evidence Verifier 1.2.0: `HELD_OUT_FAILED_NOT_QUALIFIED`
- Fresh held-out: `SEALED`
- Route classification: `EXPERIMENTAL` for this exact model/runtime/GPU/output envelope
- Production routing: unchanged

`768` is the smallest tested budget that naturally completes the named target case, but no output budget is qualified as reliably completing the three-case set from this sample.

## Cleanup

Agent Control owned admission, service-idle checks, reservation, launch, streaming invocation, deadlines, verification, cleanup, and restoration. After both phases, the experimental process was absent, port `19528` was closed, all four reserved services were active, and ports 8080, 8081, and 19223 returned HTTP 200. Unrelated GPU processes were not stopped.

## Exact reproduction commands

Add `--maximum-output-tokens 768` to the exact command in `QWEN38-27B-FULL-GPU-GOVERNED-RUNTIME-QUALIFICATION.md` and change the output path to `QWEN38-27B-OUTPUT-BUDGET-768.json` for the target call. For the three-case replication, omit `--case-id ev2-heldout-contradicted-timeout` and use output path `QWEN38-27B-SMALL-REPLICATION-768.json`. All other arguments remain byte-for-byte identical.

## Required final summary

```text
QWEN3.8-27B OUTPUT-BUDGET QUALIFICATION

512 TOKENS: OUTPUT_LIMIT
768 TOKENS: NATURAL STOP; VALID JSON; SEMANTIC PASS
1024 TOKENS: NOT RUN
1536 TOKENS: NOT RUN

MINIMUM NATURAL-COMPLETION BUDGET: 768 FOR TARGET CASE; NOT RELIABLY QUALIFIED ACROSS THREE CASES
NATURAL FINISH: PASS FOR TARGET; 2/3 REPLICATION
VALID JSON: PASS FOR TARGET; 2/3 REPLICATION
SEMANTIC ACCEPTANCE: PASS FOR TARGET; 2/3 REPLICATION
GENERATION RATE: 6.268 TOKENS/S TARGET; 6.240 AND 6.161 TOKENS/S REPLICATION SUCCESSES
CALL DURATION: 97.283 S TARGET; 318.064 S THREE-CASE TOTAL

THREE-CASE REPLICATION: 2/3
PLAIN: 2/3 COMPLETED, FORMATTED, AND ACCEPTED; ONE PROVIDER_MALFORMED_RESPONSE
EV 1.0.0: NOT RUN
EV 1.2.0: NOT RUN

EV 1.2 STATUS: HELD_OUT_FAILED_NOT_QUALIFIED
FRESH HELD-OUT: SEALED
ROUTE CLASSIFICATION: EXPERIMENTAL
PROTECTED SERVICES: PASS
CLEANUP: PASS
```
