# Qwen3.8-27B resource profile

The machine-readable snapshots are in `QWEN38-27B-NATURAL-CALL.json`.

| Point | GPU used/free | Experimental process | Host memory evidence |
|---|---|---|---|
| Before reservation | 12,211 / 4,056 MiB | absent | 50,087,104,512 bytes available |
| After reservation | 249 / 16,018 MiB | absent | 52,773,830,656 bytes available before launch |
| After load | 14,165 / 2,102 MiB | 13,916 MiB VRAM; 987,660,288-byte RSS | recorded by exact PID `2646816` |
| After generation | 14,199 / 2,068 MiB | 13,950 MiB VRAM; 1,337,004,032-byte RSS | stable through cleanup request |
| After experimental stop | 249 / 16,018 MiB | absent | 53,724,733,440 bytes available |
| After restoration | 8,951 / 7,316 MiB | absent | three restored llama services visible; CSM worker remained lazily unloaded |

Observed unrelated processes used 144 MiB and 100 MiB VRAM. They were not stopped. The four reserved services were `llama-server.service`, `llama-coder.service`, `agent-control-realtime-model.service`, and `llm-fight-club-csm-capability.service`; their unit hashes and stable commands matched after restoration, and ports 8080, 8081, and 19223 returned HTTP 200.

Historical CPU-dominant evidence reported approximately 13.5 GiB RSS and 1,716 MiB VRAM, but no timestamped provider timing. The GPU run reduced observed model-process RSS to about 1.245 GiB while increasing its VRAM to 13,950 MiB. Exact CPU prompt/generation speed and therefore numeric speedup remain unavailable.
