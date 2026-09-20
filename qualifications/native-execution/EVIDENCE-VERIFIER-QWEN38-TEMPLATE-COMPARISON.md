# Evidence Verifier Qwen3.8 template comparison

Date: 20 September 2026

Status: **REGRESSION IMPROVEMENT DEMONSTRATED; FRESH HELD-OUT REMAINS SEALED**

The definitive comparison used the exact Qwen3.8-27B Q3_K_M model and llama.cpp build identified in `QWEN38-PROVIDER-MALFORMED-ROOT-CAUSE.md`, with GPU layers 99, context 8192, threads 8, parallelism 1, and a common 1536-token finite output envelope. It executed three frozen regression cases, three repetitions, and three arms through Agent Control's governed native path: 27 calls total.

## Aggregate results at 1536

| Arm | Runs | Completed | Format compliant | Accepted | Unsupported claims | Input | Cached | Fresh | Output | Total | Cache reuse | Finish reasons | Median wall | Total wall | Provider failures |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|---:|
| Plain | 9 | 9 | 9 | 6 | 0 | 5,517 | 4,300 | 1,217 | 6,849 | 12,366 | 77.94% | 9 stop | 95.142 s | 1,140.677 s | 0 |
| Evidence Verifier 1.0.0 | 9 | 6 | 6 | 6 | 0 | 6,741 | 5,158 | 1,583 | 8,499 | 15,240 | 76.52% | 6 stop, 3 length | 124.865 s | 1,417.476 s | 3 |
| Evidence Verifier 1.2.0 | 9 | 9 | 9 | 9 | 0 | 7,587 | 5,722 | 1,865 | 5,673 | 13,260 | 75.42% | 9 stop | 84.485 s | 957.057 s | 0 |

Provider-reported monetary cost was unavailable for every arm; no cost is invented. Median generation rates were 6.130, 6.120, and 6.118 tokens/s for plain, 1.0.0, and 1.2.0 respectively.

## Case-level quality

- Contradicted: all three arms accepted 3/3 with zero unsupported claims.
- Supported: all three arms accepted 3/3 with zero unsupported claims.
- Insufficient evidence: plain completed and formatted 3/3 but accepted 0/3 because it chose `COMPLETE` instead of `DEGRADED`; Evidence Verifier 1.0.0 completed 0/3 because all output tokens remained reasoning and ended `length`; Evidence Verifier 1.2.0 completed, formatted, and accepted 3/3.

Every completed output had all expected facts correct (`meanQualityScore = 1`) and zero unsupported claims. Evidence Verifier 1.2.0 therefore improved full acceptance from 6/9 to 9/9 on this frozen regression set and also reduced total wall time and output tokens relative to both comparison arms. Evidence Verifier 1.0.0 did not improve on plain and was operationally worse on the insufficient-evidence case.

This is regression evidence, not fresh held-out qualification. The same three cases had already been inspected in earlier work, repetitions are deterministic rather than nine independent cases, and the sample is too small for a broad reliability claim.

## Qwen2.5-3B historical comparison

The existing held-out Qwen2.5-3B result remains unchanged:

| Arm | Accepted | Format | Mean quality | Unsupported claims |
|---|---:|---:|---:|---:|
| Plain | 0/9 | 9/9 | 0.667 | 12 |
| Evidence Verifier 1.0.0 | 0/9 | 9/9 | 0.667 | 12 |
| Evidence Verifier 1.2.0 | 0/9 | 9/9 | 0.750 | 9 |

On the equivalent recorded dimensions, Qwen3.8 with Evidence Verifier 1.2.0 was materially stronger: 9/9 accepted, mean completed-output quality 1.0, and zero unsupported claims. This does not erase the Qwen2.5 failures or prove cross-task generality.

## Decision

- Evidence Verifier 1.2.0 status: `READY_FOR_FRESH_HELD_OUT_QUALIFICATION`
- Fresh held-out: `SEALED`
- Qwen3.8 route: `EXPERIMENTAL`

Fresh held-out material was not opened. A separate qualification is required before any claim of held-out effectiveness or supported production routing.

Evidence:

- `EVIDENCE-VERIFIER-QWEN38-TEMPLATE-COMPARISON-1024.json` — retained negative output-boundary comparison
- `EVIDENCE-VERIFIER-QWEN38-TEMPLATE-COMPARISON-1536.json` — definitive common-envelope regression comparison

The 1536 comparison reached 14,199 MiB total GPU use, 13,950 MiB experimental-process VRAM, 2,068 MiB minimum free VRAM, and 7,025,999,872-byte experimental RSS. Agent Control confirmed owned-process cleanup and restored all reserved services.
