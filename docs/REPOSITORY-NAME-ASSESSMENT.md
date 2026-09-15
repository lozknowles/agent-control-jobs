# Agent Control Lab repository-name assessment

This assessment was prepared before any public rename. No repository setting, clone URL, package identity, schema identifier or release reference was changed.

## Current public identity

- Repository: `lozknowles/agent-control-jobs`
- Package: `agent-control-jobs`
- CLI: `ac-jobs`
- Default branch: `main`
- Published version/tag: `0.1.0` / `v0.1.0`
- Public presentation proposed by this branch: **Agent Control Lab**

## Observed rename dependencies

| Surface | Current dependency | Consequence of changing the slug now |
|---|---|---|
| Clone/install instructions | `github.com/lozknowles/agent-control-jobs.git` | Documentation and downstream automation would need a coordinated update. |
| npm/package metadata | `agent-control-jobs` and `ac-jobs` | A repository rename does not rename the package or CLI; changing either would be a separate compatibility event. |
| Public schema IDs | `lozknowles.github.io/agent-control-jobs/spec/...` | These are durable identifiers and should not be changed casually, even if hosting moves. |
| Qualification evidence | GitHub Actions and receipt URLs contain the current slug | Historical records should remain immutable and resolvable. |
| CI | Repository-local workflow uses relative paths | No current workflow logic depends on a different proposed slug, but a post-rename run would still be required. |
| Agent Control source tree | No current literal `agent-control-jobs` reference was found | There is no observed product-code migration dependency in the inspected checkout. |
| Public indexed code | GitHub code search returned no external literal reference at inspection time | Search coverage is not proof that no private or unindexed consumer exists. |

## Recommendation

Keep the public slug **`agent-control-jobs`** for the initial Agent Control Lab presentation. This preserves clone URLs, package identity, schema IDs, historical release/evidence links and existing Jobs consumers while making Jobs one first-class capability within Lab.

Consider a separate repository rename only after publishing a migration note, inventorying downstream clones and automation, deciding whether durable schema IDs remain unchanged, verifying redirects, and running clean-clone plus CI checks against the proposed URL. Do not couple that later decision to the branding change.

## Prepared GitHub metadata

Proposed description:

> Reproducible AI benchmarks, experiments, reusable jobs, API examples and evidence-backed reports for Agent Control.

Proposed topics:

`agent-control`, `ai-benchmarking`, `gpu-benchmark`, `llm`, `llama-cpp`, `local-ai`, `model-evaluation`

These settings are proposals only. This branch does not modify GitHub repository metadata.
