# API examples

These examples show the current data boundaries for integrating the Lab's reusable Jobs with Agent Control.

- [context.json](context.json) is an example compatibility context.
- [estate.json](estate.json) is an intentionally insufficient estate snapshot used to demonstrate fail-closed readiness evaluation.
- [Initial qualification evidence](qualification/README.md) documents a bounded Agent Control control-observation integration and links its public receipt.

The current CLI can inspect Jobs, suites, provenance and compatibility. It intentionally does not provide an ungoverned generic run command. Material execution must pass through Agent Control's registered Jobs, Work Parcels, policy, permissions and evidence boundaries. See the [Agent Control integration proposal](../docs/AGENT-CONTROL-INTEGRATION.md).
