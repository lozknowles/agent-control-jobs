# Compatibility and Estate Discovery

`ac-jobs compatibility JOB estate.json context.json` is an advisory evaluator. Estate schema 1.0.0 is a small adapter-neutral projection, not the raw Agent Control discovery format.

The estate lists verified capabilities, connector IDs, credential **references**, resource counts/health, model capabilities, platform, configured job adapters and an observation timestamp. Context supplies an input SHA-256 and target ID. Grants bind those values to the job ID, version, complete payload digest and expiry. Their scoped permissions must cover every declared effect, including output writes. Consequential actions must also appear in approved_actions.

The evaluator reports every unmet requirement, choosing the first applicable primary state in this precedence:

| State | Meaning |
|---|---|
| BLOCKED | Stale/invalid snapshot, estate hold or insufficient budget |
| UNSUPPORTED | Missing verified capability, model capability, supported platform or integration |
| CONNECTOR_REQUIRED | Required connector is absent |
| CREDENTIAL_REQUIRED | Required credential reference is absent |
| CONFIGURATION_REQUIRED | Missing adapter/target binding or healthy resource capacity |
| APPROVAL_REQUIRED | Missing, expired or mismatched grant/action approval |
| READY | No declared prerequisite is missing in this snapshot |

READY does not mean installed, executed, safe or qualified. The evaluator does not verify signatures, contact credential stores, probe hosts, estimate model cost or authorise execution. The controller must authenticate estate/grant provenance and recheck state before every action. Any configured job adapter claiming readiness must supply an independent admission record; a string in user-supplied JSON is not sufficient evidence.

The default cost ceiling is zero. Overrides belong to approved run configuration and require recomputing the assessment. Unknown cost must block invocation at runtime.

Snapshots have a maximum age, additionally bounded by the job's evidence age. Future and unparsable timestamps fail closed. Full errors remain visible even when a higher-precedence error is selected. The dashboard can render underscores as spaces.

## Reference discovery projection

`node tools/cli.mjs estate discovery.json bindings.json` projects an actual `agent-control.environment-discovery/v1` scan. Bindings map capability/connector/credential/model names to discovery item IDs, plus resource IDs/counts/discovery_id, platform and configured_jobs. These bindings are operator-reviewed configuration, never inferred from labels.

Only HEALTHY items with QUALIFIED/ACTIVE lifecycle and operational state and a fresh AUTHORITATIVE observation contribute readiness. Partial scans are blocked. The projection always emits an empty grants list and zero budget. The operator/controller must bind authority separately. This is deliberately conservative: discovery alone is not qualification. No scan is fetched or initiated by the projection command.
