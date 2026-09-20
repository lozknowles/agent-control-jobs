# Evidence Verifier Qwen3.8 GPU regression

Status: **NOT RUN — NO TEMPLATE COMPARISON RESULT**

Only the predeclared plain-arm representative call ran. It failed the natural-completion gate because the 512-token response ended for length before valid JSON was complete. Evidence Verifier 1.0.0 and 1.2.0 were not invoked under this GPU/governed-runtime envelope.

| Arm | Runs | Naturally completed | Format compliant | Accepted | Unsupported claims |
|---|---:|---:|---:|---:|---|
| Plain | 1 | 0 | 0 | 0 | unavailable |
| Evidence Verifier 1.0.0 | not run | unavailable | unavailable | unavailable | unavailable |
| Evidence Verifier 1.2.0 | not run | unavailable | unavailable | unavailable | unavailable |

No template-improvement conclusion is available. No fresh held-out data was opened. Evidence Verifier 1.2.0 remains `HELD_OUT_FAILED_NOT_QUALIFIED`.

Historical comparison remains separate:

- CPU-dominant Qwen3.8-27B: 27/27 provider timeouts at 120 seconds; no output reached verification.
- Qwen2.5-3B: 27/27 completed and formatted, but each arm accepted 0/9.
- Full-GPU Qwen3.8-27B gate: generated 512 tokens at 6.254 tokens/s and reached the independent verifier, but its length-truncated output was not format compliant.

The GPU result proves improved execution viability relative to the prior CPU envelope, not semantic or template quality.
