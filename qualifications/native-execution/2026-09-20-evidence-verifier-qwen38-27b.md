# Evidence Verifier Qwen3.8-27B regression — 20 September 2026

Status: **EXECUTED, 0/27 COMPLETED, NOT QUALIFIED**.

This is regression and cross-model evidence over the previously inspected v2 qualification cases. It is not fresh held-out evidence. The fixtures, answer keys, worker instructions, evaluator, tools, 512-token output budget and 120-second call limit were unchanged. Answer keys remained outside worker context.

## Exact identities

- Model: `/fast/models/qwen3.8-27b/Qwen3.8-27B-Q3_K_M.gguf`
- Model size: `13,818,690,528` bytes
- Model SHA-256: `7f3b845b563888ec3abc269474cf744bf703a7ce8766dbb7f696c63975facfd7`
- Quantization: `Q3_K_M` (artifact identity; not inferred as a quality result)
- Runtime: `/fast/repos/llama.cpp/build-cuda/bin/llama-server`
- Runtime SHA-256: `3f1000482d759661cadb1dc9b59f6292f52408ee0d2906298fa001837517fb4e`
- Runtime build: llama.cpp `9371` (`22d9bc441`), GNU 13.3.0, Linux x86_64
- Settings: loopback port `19527`, context `8192`, threads `8`, parallel slots `1`, configured GPU layers `0`
- Native Job: `hallucination-resistance@1.0.0`, exact digest retained per run
- Arms: plain prompt, `evidence-verifier@1.0.0`, `evidence-verifier@1.2.0`

## Host admission and protection

Before selection the host reported 62 GiB RAM, 25 GiB available RAM, fully used 8 GiB swap, and a Quadro P5000 with 3,432 MiB free VRAM. Protected llama.cpp services on ports 8080 and 8081 returned HTTP 200. Agent Control required model size plus an 8 GiB available-RAM reserve, rejected protected ports, admitted only exact files beneath the supplied roots, and launched the experimental service on loopback.

During one live observation the owned process had about 13.5 GiB RSS. Although GPU layers were configured as zero, llama.cpp held 1,716 MiB GPU memory, leaving 1,756 MiB free; the observation timestamp was not captured in the report and is therefore supporting rather than authoritative interval telemetry. No existing process was stopped.

Agent Control terminated the owned process group with confirmed cleanup. Port 19527 was closed afterward. Ports 8080 and 8081 remained HTTP 200 and returned the same health-body SHA-256 before and after. GPU allocation returned to the prior 12,835 MiB used / 3,432 MiB free state.

## Results

| Arm | Runs | Completed | Format compliant | Full acceptance | Unsupported claims | Input / cached / output tokens | Elapsed |
|---|---:|---:|---:|---:|---|---|---:|
| Plain | 9 | 0 | 0 | 0 | unavailable | unavailable | 1,085,136 ms |
| Evidence Verifier 1.0.0 | 9 | 0 | 0 | 0 | unavailable | unavailable | 1,085,018 ms |
| Evidence Verifier 1.2.0 | 9 | 0 | 0 | 0 | unavailable | unavailable | 1,085,530 ms |

All 27 native runs failed with `execute:execution:provider_timeout`. No response completed, no finish reason or provider usage was returned, and no candidate reached the independent verifier. Zero format-compliant and zero accepted runs are failure counts; unavailable quality, unsupported-claim and token fields are not measured zeros. Authoritative monetary cost was unavailable. Total recorded invocation elapsed time was 3,255,684 ms (about 54 minutes 16 seconds).

The prior Qwen2.5-3B comparison completed all 27 calls and produced format-compliant outputs, but accepted 0/9 runs in each arm. Its plain/original/revised mean fact-quality scores were 0.667/0.667/0.750 with 12/12/9 unsupported claims. Qwen3.8-27B was therefore operationally worse under the matched frozen budget; semantic quality and template improvement cannot be compared because it produced no completed output.

No fresh qualification set was opened: the regression did not justify proceeding. Evidence Verifier 1.2.0 remains `HELD_OUT_FAILED_NOT_QUALIFIED`.

## Reproduce the final candidate

From the Agent Control checkout on the authorised host:

```sh
npm run qualify:evidence-verifier -- \
  --lab ../agent-control-jobs \
  --output ../agent-control-jobs/qualifications/native-execution/2026-09-20-evidence-verifier-qwen38-27b-regression.json \
  --partition qualification \
  --arm all \
  --repetitions 3 \
  --managed-runtime /fast/repos/llama.cpp/build-cuda/bin/llama-server \
  --managed-runtime-root /fast/repos/llama.cpp \
  --managed-model /fast/models/qwen3.8-27b/Qwen3.8-27B-Q3_K_M.gguf \
  --managed-model-root /fast/models \
  --managed-port 19527 \
  --managed-context 8192 \
  --managed-gpu-layers 0 \
  --managed-threads 8 \
  --provider-model Qwen3.8-27B-Q3_K_M.gguf \
  --model-id local-qwen38-27b-q3km-template-qualification
```

Machine-readable run, provenance, lifecycle, cleanup and per-attempt evidence is in `2026-09-20-evidence-verifier-qwen38-27b-regression.json`.
