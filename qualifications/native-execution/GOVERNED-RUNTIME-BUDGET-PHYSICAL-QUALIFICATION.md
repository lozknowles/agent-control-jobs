# Governed runtime-budget qualification

Status: **IMPLEMENTED AND TESTED; PARTIAL PHYSICAL COVERAGE**

The reconciled runtime distinguishes absolute job, model-call, tool-call, no-progress, turn, verification reserve, cleanup reserve, and terminal-completion budgets. The model cannot extend these values. The experimental native run used 1,200,000 / 900,000 / 60,000 / 300,000 / 120,000 / 60,000 ms respectively and a finite ten-turn budget; terminal completion allowance was zero for this run.

| Required behavior | Evidence | Result |
|---|---|---|
| Slow streaming progress is retained | real Qwen call streamed 512 tokens for 81.867 s | PASS within observed interval |
| Harmless no progress terminates | Linux focused test `stream without useful activity terminates as MODEL_NO_PROGRESS` | PASS |
| Absolute job deadline | `work deadline exhaustion is distinct from the longer model call deadline` | PASS |
| Model-call deadline | `fixed model deadline remains a hard ceiling despite progress` | PASS |
| Turn budget finite | runtime-budget admission and structured-loop tests | PASS |
| Tool-call deadline | `governed tool deadline aborts a stalled tool independently` in full suite | PASS |
| Verification reserve | independent verifier ran after the 87.565 s invocation and rejected malformed output | PASS for observed run |
| Cleanup reserve/cleanup | experimental PID received SIGTERM; cleanup confirmed; port closed; services restored | PASS |
| Terminal allowance terminal-only | full-suite completion-allowance rejection and one-use tests | PASS |
| Transport cannot silently override policy | per-call Undici header/body deadlines equal governed call deadline; native header timeout classified `TRANSPORT_TIMEOUT`; streaming call completed without the historical 120 s harness timeout | PASS in code/tests; >300 s physical crossing not observed |

The real model call did not exceed 120 or 300 seconds, so this run does not physically demonstrate survival beyond either historical wall. That specific long-duration boundary remains untested, rather than inferred. Linux focused tests passed 79/79, full Agent Control passed 1,975/1,975, and Agent Control Lab passed 86/86.
