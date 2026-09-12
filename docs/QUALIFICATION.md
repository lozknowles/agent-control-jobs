# Qualification without inflated claims

Library validation, fixture checking, live control execution and real agent qualification are different evidence levels.

| Level | What it establishes |
|---|---|
| Manifest validation | Definition, references and declared payload are coherent |
| Fixture validator test | The validator accepts its positive case and rejects tested negative cases |
| Independent worker fixture run | A particular worker solved that bounded case; evaluator data must be hidden |
| Live control integration | Actual Agent Control runtime and bound read-only host operations produced evidence |
| Live agent qualification | A pinned model/worker executed a real workload through governed tools, with independently verified effects |

No canonical job starts qualified. `NOT_YET_QUALIFIED` is the honest catalogue baseline. Published live evidence is scoped to a job revision, adapter, inputs, estate observation, runtime revision, model route (or explicitly no model), permissions and timestamp. Historical evidence cannot certify a changed estate or model.

Job outcomes are COMPLETE, DEGRADED, BLOCKED and ESCALATED. Validator verdicts are PASS, FAIL or BLOCKED. A permission-denial case passes only when denial was expected, the result matches and the independent action audit confirms no unauthorised effect. An unavailable evaluator or missing setup is a **BLOCKED verdict**, never an expected-refusal pass.

Every suite retains all scheduled jobs in its denominator. Suite PASS requires every member to PASS. Any FAIL means FAIL; otherwise any missing or BLOCKED member means BLOCKED. Do not drop difficult jobs or substitute fixture self-checks. Report expected refusals, degraded results and recovery separately from successful objectives.

Evidence receipt requirements: run ID; pinned library/job/suite versions and payload digest; input and output digests; estate fingerprint; runtime and adapter revision; actual model/provider or no-model declaration; start/end timestamps; approval IDs and denial events; immutable observation references; validator identity/version; verdict; reviewer identity and review time. Retain raw evidence privately when it contains sensitive estate details, with a redacted public receipt and digest.

Long-running scenarios must be qualified using actual durable writes, process termination/restart and exactly-once effect checks. A textual checkpoint fixture only tests interpretation. Likewise, multi-agent cases need independent process/worker identities and measured execution ordering before concurrency is qualified.

See [initial integration evidence](../examples/qualification/README.md) for the exact live scope, including any unavailable checks. No physical handset, production deployment or broad model qualification is implied.
