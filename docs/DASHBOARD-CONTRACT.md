# Dashboard data contract v1

The checked-in `catalogue/index.json` is a deterministic public data contract. It contains schema/library versions and jobs with identity, individual version, one-sentence description, pattern, category, tags, common-job flag, provenance, requirements, permissions, risk, fixture status, relative path, SHA-256 and per-file hashes.

Browse and search operate locally over that catalogue. Inspect presents objective, required inputs, prerequisites, side effects, approvals and provenance before offering any action. Compare with an authenticated estate projection using COMPATIBILITY.md. Display all readiness reasons, not just the primary state.

Proposed controller operations (not implemented HTTP endpoints here):

| Operation | Request | Response / authority |
|---|---|---|
| inspect | job ID + version | Immutable catalogue record |
| dry run | job digest, inputs digest, target, optional variant | Compatibility and permission summary; no action |
| install | pinned catalogue/job digest | Validated local data cache; no authority |
| configure | installed digest + resource/connector bindings | Reviewed adapter configuration |
| run | digest, bound inputs/target, grant references, idempotency key | Existing Work Parcel ID after controller policy checks |
| fork | source digest + new identity | Editable local job; provenance retained; unqualified |
| history | job ID + version/digest | Qualification receipts, including failures and unavailable setup |

Never expose secrets in catalogue or history. Fetch/install must reject path traversal, symlinks, oversized files, digest mismatches and unreviewed executable payloads. Release hashes establish integrity relative to a trusted commit, not publisher trust by themselves. A dashboard must never turn the public catalogue into a shell-command API.
