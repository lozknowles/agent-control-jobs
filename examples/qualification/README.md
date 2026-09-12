# Initial qualification evidence

On 2026-09-12, three real read-only development-host observations ran through the inspected Agent Control WorkParcelCoordinator and JobRuntime. The parcel and all three runtime jobs completed. [Receipt](control-integration.json) includes pinned job digests, runtime revision, run IDs, actual numeric observations, timestamps and artefact hashes.

This is **CONTROL_OBSERVATION_ONLY** evidence for machine, disk and GPU probes. No model was invoked. GPU process attribution was not tested. The run did not use the existing service's state or change production services. An isolated temporary runtime state directory was retained privately for audit; the public receipt omits private host paths and identifiers.

To reproduce on an explicitly approved development host, install dependencies in both this library and the pinned Agent Control checkout, then use:

```sh
node --import /absolute/agent-control/node_modules/tsx/dist/loader.mjs tools/qualify-control.mjs /absolute/agent-control work/control-integration.json --approved-development-read-only
```

The adapter refuses any controller revision other than the one recorded in the receipt. The approval flag is an operator assertion, not a credential or a substitute for the controller's policy boundary. This script runs a new isolated controller instance with three fixed read-only control actions; it does not install a generic importer. Model, production, physical handset, live refusal and interruption qualification remain unperformed.
