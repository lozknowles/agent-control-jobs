# Job specification 1.0.0

JSON Schema draft-07 defines jobs, suites, capabilities, use cases and estate projections. Manifests use YAML 1.2; JSON is a valid subset. Unknown top-level fields are rejected. Alias expansion, duplicate YAML keys, path traversal and undeclared payloads are rejected by tooling.

Identity is id plus semantic version. Every job includes a one-sentence description, pattern, category and provenance; requirements describe capabilities, resources, connectors, credential references, platforms and model capabilities. Null minimum_version means no controller release compatibility claim has been established.

Permissions describe effect kind and binding scope. `bound-inputs`, `run-output` and `target` are logical scopes resolved by the operator/controller, never broad filesystem grants. The mutation level describes the target effect; local report writes are declared separately. Approval binds job version/digest, inputs, target and expiry. Consequential effects require approval and cannot be unattended_safe. Cost is a maximum with currency, not an estimate; unknown cost blocks paid execution.

Inputs/outputs are JSON Schema objects. Success and failure criteria are human-readable checks; declarative validator files contain expected outcome, task-specific facts, allowed actions and required evidence for a synthetic scenario. Validators are evaluator-only. The controller is responsible for action auditing, budget enforcement, sandboxing and live validation.

Integration states: IMPLEMENTED means a definition/tool exists; RUNNABLE requires a configured executor and authorised inputs; REQUIRES_CONFIGURATION, REQUIRES_CONNECTOR and REQUIRES_CREDENTIAL describe missing setup; UNSUPPORTED means a required capability/workflow is unavailable. NOT_YET_QUALIFIED is a separate evidence state and may coexist with implementation or readiness. This release keeps all canonical integration statuses at REQUIRES_CONFIGURATION and qualification at NOT_YET_QUALIFIED.
