# Qwen3.8-27B provider malformed response root cause

Date: 20 September 2026

Status: **ROOT CAUSE PROVEN — MODEL OUTPUT TRUNCATED AT THE FINITE OUTPUT LIMIT; TRANSPORT AND DECODER VALID**

This continuation preserves every earlier positive and negative qualification record unchanged. The failed case was the exact frozen `ev2-heldout-insufficient-owner` plain arm at 768 maximum output tokens.

## Exact identities

- Model: `/fast/models/qwen3.8-27b/Qwen3.8-27B-Q3_K_M.gguf`, 13,818,690,528 bytes, SHA-256 `7f3b845b563888ec3abc269474cf744bf703a7ce8766dbb7f696c63975facfd7`
- Runtime: `/fast/repos/llama.cpp/build-cuda/bin/llama-server`, build `9371` (`22d9bc441`), SHA-256 `3f1000482d759661cadb1dc9b59f6292f52408ee0d2906298fa001837517fb4e`
- Configuration: GPU layers `99`, context `8192`, threads `8`, parallel `1`, port `19528`
- Job: `hallucination-resistance@1.0.0`, digest `dbf194964b5945cda216fadfb4783b394c83c085b2b488ef929569d2d0525d2e`
- Case: `ev2-heldout-insufficient-owner`, digest `53b96df2204e0645bbc008625ca13ac601579d41feaf56d70050ac543e36c42c`

## First diagnostic replay

The replay returned HTTP 200 with `text/event-stream` and chunked transfer encoding. Agent Control retained 207,121 transport bytes in 768 chunks, reconstructed 772 SSE records, parsed 771 provider JSON objects, observed `[DONE]`, and recorded a clean connection termination. There were zero UTF-8 replacement characters and no framing, JSON-object, or stream-decoder error.

All 768 generated tokens were delivered as `reasoning_content`. The terminal provider object then reported `finish_reason: length`; the authoritative usage object reported 615 prompt tokens, 768 completion tokens, and 1,383 total tokens. No assistant `content` had been emitted, so the assembled assistant output contained zero characters. The native provider consequently surfaced the pre-existing generic `provider_malformed_response` error for an empty assistant output.

The first invalid layer is therefore **Layer 5 — assembled assistant output**. Layers 1 through 4 were valid. Layers 6 and 7 were not reached.

## Classification

- Root cause: `MODEL_OUTPUT_TRUNCATED`
- Reproducibility: `DETERMINISTIC` at 768; the diagnostic replay plus two permitted identical repetitions were 3/3 `length` with exactly 768 completion tokens and no assistant content.
- Agent Control stream-decoder defect: **no**
- llama.cpp framing/response defect: **no**
- Transport failure: **no**
- Verifier-input defect: **no**
- Observability gap: corrected generically by the opt-in, bounded, redacted provider transport diagnostic. Normal execution remains fail-closed.

The original `provider_malformed_response` record is not rewritten. It accurately records the old error surface, while the new raw evidence explains its cause.

## Output-budget continuation

At 1024, one isolated replay naturally stopped at 995 tokens and produced valid JSON, but the later 27-call comparison demonstrated that 1024 was not reliable: every insufficient-evidence arm/repetition reached `length`. At 1536, the plain three-case gate reached 3/3 natural finishes and 3/3 valid formats. Evidence Verifier 1.0.0 still reached `length` on all three insufficient-evidence repetitions at 1536, so 1536 is not a universal natural-completion envelope for every historical template arm.

Evidence:

- `QWEN38-RAW-STREAM-DIAGNOSTIC.json`
- `QWEN38-RAW-STREAM-DIAGNOSTIC-REPRODUCIBILITY.json`
- `QWEN38-INSUFFICIENT-1024.json`
- `QWEN38-INSUFFICIENT-1536.json`

## Governance and cleanup

Agent Control owned admission, exact path/hash/build validation, service idle checks and reservation, isolated launch, deadlines, progress tracking, termination, evidence capture, and service restoration. The experimental process was removed, port `19528` closed, all four reserved services returned active, ports 8080, 8081, and 19223 returned HTTP 200, and GPU memory returned to the protected-service baseline.
