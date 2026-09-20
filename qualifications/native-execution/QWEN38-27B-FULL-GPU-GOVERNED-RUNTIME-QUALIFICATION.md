# Qwen3.8-27B full-GPU governed-runtime qualification

Date: 20 September 2026
Status: **STOPPED AT ONE-CALL GATE — OPERATIONALLY_UNSUITABLE FOR THIS FROZEN WORKLOAD**

This is controlled regression evidence, not fresh held-out qualification. The exact model/runtime/hardware combination loaded stably and produced tokens through Agent Control's native Work Parcel -> Job Runtime path, but the representative frozen call did not reach a natural terminal response. It exhausted the unchanged 512-token output allowance with `finishReason: length`, leaving truncated JSON. Per the predeclared stop gate, the three-case replication, 27-call arm comparison, and fresh held-out set were not run.

## Exact identity

- Model: `/fast/models/qwen3.8-27b/Qwen3.8-27B-Q3_K_M.gguf`
- Size: `13,818,690,528` bytes
- SHA-256: `7f3b845b563888ec3abc269474cf744bf703a7ce8766dbb7f696c63975facfd7`
- Quantization: `Q3_K_M`
- Runtime: `/fast/repos/llama.cpp/build-cuda/bin/llama-server`
- Runtime build: `9371` (`22d9bc441`), SHA-256 `3f1000482d759661cadb1dc9b59f6292f52408ee0d2906298fa001837517fb4e`
- Hardware: NVIDIA Quadro P5000, 16,384 MiB
- Settings: context `8192`, threads `8`, parallel `1`, configured GPU layers `99`, loopback port `19528`
- Job: `hallucination-resistance@1.0.0`, digest `dbf194964b5945cda216fadfb4783b394c83c085b2b488ef929569d2d0525d2e`
- Frozen case: `ev2-heldout-contradicted-timeout`, case digest `258b2629ffefd821c2414c5ab06f08d3143bbe707282a40aef5a56fdd575e34e`
- Evidence: `QWEN38-27B-NATURAL-CALL.json`, SHA-256 `f885107e7f2a32342120245b18e412d0a3bb8e7d0d66280ddf0eec2936269b9a`

## Result by question

1. **GPU offload:** configured `--n-gpu-layers 99` loaded and ran stably. The experimental process used 13,950 MiB VRAM at the recorded peak; total GPU use was 14,199 MiB, leaving 2,068 MiB. The exact effective layer count was not emitted into retained evidence, so `99` is reported as the maximum safe configured value, not an invented physical layer count.
2. **Performance:** prompt processing was 111.918 tokens/s and generation was 6.254 tokens/s. Exact CPU-vs-GPU speedup is unavailable because the retained CPU-dominant attempts timed out without provider timings.
3. **Natural completion:** no. The provider returned 512 output tokens after 81.867 seconds generation and 87.565 seconds total, then stopped for length. The partial output began with the correct `contradicted` verdict but was not valid JSON and could not receive semantic credit.
4. **Template quality:** not tested. The gate used the plain arm. EV 1.0.0 and EV 1.2.0 were not run, so no improvement claim is possible.

The route classification applies only to this exact frozen workload and envelope: **OPERATIONALLY_UNSUITABLE**. It is not a general judgment on the model.

## Governance and cleanup

Agent Control performed exact-path/hash/build admission, idle checks, allowlisted service reservation, runtime launch, streaming model invocation, deadlines, independent verification, owned-process cleanup, service restoration, and evidence capture. Four identified user services were restored with matching stable command, unit-file hash, ports, and HTTP 200 health where applicable. Port `19528` was closed and no experimental process remained. Unrelated GPU processes were observed but not stopped.

The prior CPU-dominant `27/27 provider_timeout` result remains unchanged. Evidence Verifier 1.2.0 remains `HELD_OUT_FAILED_NOT_QUALIFIED`.

## Reproduce the stopped gate

From the Agent Control candidate checkout on `hpubuntu`:

```sh
node --import tsx scripts/qualify-evidence-verifier.ts \
  --lab /fast/work/agent-templates-20260920-8nbbuC/agent-control-jobs \
  --output /fast/work/qwen38-full-gpu-evidence-20260920/QWEN38-27B-NATURAL-CALL.json \
  --partition qualification --case-id ev2-heldout-contradicted-timeout \
  --arm plain --repetitions 1 --governed-runtime \
  --absolute-job-deadline-ms 1200000 --model-call-deadline-ms 900000 \
  --tool-call-deadline-ms 60000 --no-progress-deadline-ms 300000 \
  --verification-reserve-ms 120000 --cleanup-reserve-ms 60000 \
  --managed-runtime /fast/repos/llama.cpp/build-cuda/bin/llama-server \
  --managed-runtime-root /fast/repos/llama.cpp/build-cuda \
  --managed-model /fast/models/qwen3.8-27b/Qwen3.8-27B-Q3_K_M.gguf \
  --managed-model-root /fast/models/qwen3.8-27b \
  --managed-port 19528 --managed-context 8192 --managed-gpu-layers 99 --managed-threads 8 \
  --expected-runtime-sha256 3f1000482d759661cadb1dc9b59f6292f52408ee0d2906298fa001837517fb4e \
  --expected-model-sha256 7f3b845b563888ec3abc269474cf744bf703a7ce8766dbb7f696c63975facfd7 \
  --expected-runtime-build 9371 \
  --provider-model Qwen3.8-27B-Q3_K_M.gguf --model-id local-qwen38-27b-full-gpu \
  --reserve-services llm-fight-club-csm-capability.service,agent-control-realtime-model.service,llama-coder.service,llama-server.service
```

This command is intentionally expected to reproduce the recorded stopped gate, not a successful semantic qualification.
