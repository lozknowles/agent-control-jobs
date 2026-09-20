# Agent Template native qualification attempt, 2026-09-20

## Result

**BLOCKED before model invocation for all five templates.** No plain-prompt or templated model output was generated, so there is no quality, latency, token or cost comparison to score.

The attempt used isolated Linux checkouts of Lab commit `f8634756c0e98587c91b33e87fe212fbdf631ecc` and Agent Control commit `cfcc757718268e21747a5f76c6c2d020269151a9`. The Agent Control candidate loaded all five exact template versions and passed its native Work Parcel to Job Runtime binding tests. Its registered native Job catalogue did not contain exact-digest executors for any of the compatible Lab Job IDs below. Dispatching a substitute action would have bypassed the compatibility and evidence contract, so the attempt stopped before inference.

| Template | Realistic intended Job | Result | Blocking prerequisite |
| --- | --- | --- | --- |
| `researcher@1.0.0` | `technical-research@1.0.0` | BLOCKED | Register and independently qualify an exact-digest native executor for the Lab Job. |
| `code-reviewer@1.0.0` | `review-pull-request@1.0.0` | BLOCKED | Register and independently qualify an exact-digest native executor for the Lab Job. |
| `evidence-verifier@1.0.0` | `hallucination-resistance@1.0.0` | BLOCKED | Register and independently qualify an exact-digest native executor for the Lab Job. |
| `documentation-writer@1.0.0` | `documentation-consistency@1.0.0` | BLOCKED | Register and independently qualify an exact-digest native executor for the Lab Job. |
| `model-evaluator@1.0.0` | `compare-models@1.0.0` | BLOCKED | Register and independently qualify an exact-digest native executor for the Lab Job. |

## Evidence boundary

- Lab full gate: 85 tests passed in the isolated Linux checkout.
- Agent Control full gate: 1,904 tests passed, including five Agent Template integration tests, in the isolated Linux checkout.
- The current protected model services remained active; none was restarted, reconfigured or used through an unqualified bypass.
- No candidate was deployed, merged, tagged, released or enabled for production routing.

A future physical comparison must use the same model, runtime, tools, generation settings, budget, task inputs and acceptance criteria for the plain and templated arms. It must retain the exact template, Job and input digests plus independent output scoring, latency, tokens, authoritative cost and any uncontrolled differences.
