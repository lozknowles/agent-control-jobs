# Agent Control integration proposal

Inspected on 2026-09-12. No Agent Control implementation was changed.

Two actual code snapshots were examined: canonical checkout `a6d35253bb40c2da049945430ebc1960cde4468b` on its cache-aware expert branch (package version still 3.7.0), and Environment Discovery worktree `7c40497e77570efe9d644b959a0b2ebe5d776127` on `feature/4.5-environment-discovery`. Directory names and release plans are not deployment evidence. The following links pin the latter implementation.

| Concern | Observed implementation | Proposed library mapping |
|---|---|---|
| Lifecycle | [work-parcels.ts](https://github.com/lozknowles/agent-control/blob/7c40497e77570efe9d644b959a0b2ebe5d776127/src/control/work-parcels.ts): PLANNING, QUEUED, RUNNING, WAITING, SUCCEEDED, FAILED, CANCELLED; stages carry jobs, parameters, dependencies, requiredCapabilities and outputs | Compile approved job input into a registered runtime job and WorkParcelPlan; never submit arbitrary downloaded actions |
| Baton | [parcel-context.ts](https://github.com/lozknowles/agent-control/blob/7c40497e77570efe9d644b959a0b2ebe5d776127/src/control/parcel-context.ts): v2 bounded baton includes objective, constraints, criteria, completed stages, next action, artefact IDs, approvals and hash-linked events | Preserve immutable job/input digests in context and artefacts; a baton carries evidence, never new authority |
| Estate | [environment-discovery.ts](https://github.com/lozknowles/agent-control/blob/7c40497e77570efe9d644b959a0b2ebe5d776127/src/control/environment-discovery.ts): DiscoveryItem records kind, nodeId, health, lifecycle, operationalState, fingerprint, attributes and provenance | Project qualified capabilities and explicit bindings into estate.schema.json; DISCOVERED must not automatically become READY |
| Governance | [runtime-safety-supervisor.ts](https://github.com/lozknowles/agent-control/blob/7c40497e77570efe9d644b959a0b2ebe5d776127/src/control/runtime-safety-supervisor.ts): action categories, assessment, approval, denial, pause and escalation | Map permission categories to runtime decisions; financial actions and service-control refinements require adapter policy, not assumed native support |
| Routing | WorkParcelPlanStage.requestedRoute includes provider, model, modelRole, allowFallback, purpose and profile; actualRoute records selected execution | Select on capabilities and qualification, keep provider optional and budget/credential residency in controller |
| Evidence | WorkParcel audit has invocation records, verifier results, route changes, timestamps, usage and provenance | Add library receipt references; preserve null/unavailable cost, never fabricate usage |
| Runtime map | [runtime-map.ts](https://github.com/lozknowles/agent-control/blob/7c40497e77570efe9d644b959a0b2ebe5d776127/src/control/runtime-map.ts) projects nodes, edges, events and evidence | Correlate library job ID with parcel/run/stage IDs and qualification receipt |
| HTTP/dashboard | [web-server.ts](https://github.com/lozknowles/agent-control/blob/7c40497e77570efe9d644b959a0b2ebe5d776127/src/control/web-server.ts) exposes operator-protected GET /api/environment-discovery, /api/estate-map and /api/runtime-map; POST /api/environment-discovery/scans | Add catalogue browsing separately; install/run requests use existing operator authority, not public GET endpoints |

## Intended flow

Estate Discovery → Estate Map → Job Compatibility → Job Library selection → approved Work Parcel → Runtime Process Map → Evidence → Qualification History.

The arrows are an integration proposal. No automatic importer or dashboard Job Library has been installed by this project. Existing stage dependency fields do not prove all parallel/failover scenarios qualified. Discovery health is not a model acceptance test.

Implement a small controller adapter that pins catalogue/job digests, resolves selected variants and validates input. It should map only reviewed job IDs to existing registered actions, bind operator-selected targets and credential references, assess readiness, request outstanding authority, then submit a plan. Runtime permission enforcement remains authoritative at each effect. Live outcomes must be mapped carefully: SUCCEEDED is not automatically COMPLETE, and FAILED/WAITING may represent the expected safe refusal only with supporting evidence.

Keep installation (cache immutable data), configuration (bind resources), approval (grant authority), execution and qualification separate. The CLI intentionally has no generic run or install command. Extending the existing control plane is separate work; this companion does not replace it.
