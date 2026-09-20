# Qwen3.8-27B GPU offload search

Status: **FULL-OFFLOAD REQUEST LOADED AND RAN STABLY**

After exact model/runtime verification, Agent Control recorded the shared P5000 state and quiesced only four allowlisted, owned user services. This released the practical GPU envelope while leaving unrelated processes untouched. Because the configured upper-bound request (`--n-gpu-layers 99`) loaded successfully, maintained 8192 context, processed the representative prompt, generated 512 tokens, and stopped cleanly, lower incremental probes would not establish a higher safe configuration and were not run.

| Probe | Outcome | Experimental VRAM | Total VRAM | Free margin | Peak RSS | Prompt rate | Generation rate |
|---|---|---:|---:|---:|---:|---:|---:|
| configured layers `99`, context 8192 | stable load and generation | 13,950 MiB | 14,199 MiB | 2,068 MiB | 1,337,004,032 bytes | 111.918 tok/s | 6.254 tok/s |

The maximum safe **configured** GPU layer value is `99`. The llama.cpp startup line containing the effective offloaded-layer count was not retained by the process result after governed cancellation; therefore the report does not substitute an assumed physical count. The VRAM/RSS observations do establish that this was a predominantly/full-GPU placement in practice.

Two earlier attempts are retained as negative operational evidence:

- The first reached the same full-GPU envelope and native call, but evidence persistence failed because volatile systemd start-time/PID text was compared as service identity.
- A subsequent reservation encountered an active realtime request; systemd's stop timeout terminated that request. Agent Control now polls `/slots` and fails with `experimental_service_busy` rather than stopping a processing llama service.
- A later run completed but restoration health was sampled before the realtime endpoint finished warming. Restoration now waits a bounded five minutes for prior healthy endpoints.

No OOM was induced, no model was downloaded, and no unidentified process was killed.
