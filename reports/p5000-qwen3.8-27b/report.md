# Quadro P5000 × Qwen3.8-27B benchmark report

**Status:** Physical measurements complete · Governed Work Parcels succeeded · Independent verification passed

This report compares two measured configurations of the same immutable Qwen3.8-27B-Q3_K_M model on the same NVIDIA Quadro P5000. It is generated from the committed privacy-safe evidence projection in [source-data.json](source-data.json).

![Baseline versus optimised generation throughput](../../assets/benchmarks/p5000-qwen3.8-27b-generation-throughput.svg)

## Measured result

| Configuration | llama.cpp | KV cache | Draft MTP | Mean prompt tok/s | Mean generation tok/s | Mean TTFT | Input / cached / output tokens | Verification |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline | 9371-22d9bc441 | f16 | disabled | 115.99 | 6.26 | 19.22 s | 6,672 / 0 / 384 | PASS |
| Optimised configuration | 9986-91c631b21 | q4_0 | max 8 | 109.98 | 16.06 | 20.26 s | 6,672 / 0 / 876 | PASS |

The optimised configuration measured **16.06 generated tokens/s**, compared with **6.26 tokens/s** at baseline: **2.57×** or **156.60%** higher generation throughput.

## What stayed fixed

- hardware
- model SHA-256
- 32,768-token context
- 2,048-token batch
- 512-token micro-batch
- 120-row workload
- 2,224 input tokens per invocation
- three repetitions

## What changed

- llama.cpp build
- KV cache format (f16 to q4_0)
- draft-MTP (disabled to maximum 8)
- output-token ceiling (128 to 512)

This is an observed configuration-level comparison. It does not attribute the measured change to any single optimisation. Generation throughput is normalised per generated token, but the output-token ceiling changed and elapsed-time means should not be read as a like-for-like latency comparison.

## Invocation measurements

| Configuration | Invocation | Input | Cached | Output | Prompt tok/s | Generation tok/s | TTFT | Elapsed |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline | baseline-full-gpu-32k-0 | 2224 | 0 | 128 | 117.86 | 6.28 | 18.90 s | 39.28 s |
| Baseline | baseline-full-gpu-32k-1 | 2224 | 0 | 128 | 115.51 | 6.26 | 19.31 s | 39.75 s |
| Baseline | baseline-full-gpu-32k-2 | 2224 | 0 | 128 | 114.58 | 6.24 | 19.44 s | 39.97 s |
| Optimised configuration | new-runtime-q4-mtp8-0 | 2224 | 0 | 292 | 110.93 | 16.42 | 20.10 s | 37.88 s |
| Optimised configuration | new-runtime-q4-mtp8-1 | 2224 | 0 | 292 | 110.08 | 15.92 | 20.23 s | 38.58 s |
| Optimised configuration | new-runtime-q4-mtp8-2 | 2224 | 0 | 292 | 108.92 | 15.85 | 20.45 s | 38.88 s |

## Evidence chain

1. Lab qualification `full-gpu-qwen-20260915`
2. Work Parcels `parcel-social-a026f6f04594ac773d4fc12c5e08528e56f4eae2f59501e03206ec4cb0551dc4` and `parcel-social-6f157bf39f3056436cab61e13e6b1d91155d9205fb8052dc9fd26dc94062c2bb`
3. Job runs `run-150ebd09-a8cd-4679-9971-4229ac219a7f` and `run-18f3fa23-7b5d-4a45-9004-9e9e3b9d3008`
4. 6 physical invocations
5. Agent Control artefacts and source-file SHA-256 records in [source-data.json](source-data.json)
6. This generated report and chart

- Agent Control source commit: `98e0f69453182bad1bf52469a7bd34dd43218118`
- Evidence-bound source fingerprint: `d071480ba56a2d9427b14c412ddbecd82b484b0c781d6bd4f406434ab58f283b`
- Model SHA-256: `7f3b845b563888ec3abc269474cf744bf703a7ce8766dbb7f696c63975facfd7`

The development qualification associated with the evidence snapshot passed 1,598 / 1,598 tests.

> **Evidence is authoritative. Reports and charts are projections over evidence.**

No monetary saving is claimed: this local backend supplied no authoritative monetary billing record. No individual optimisation is credited with the full improvement.
