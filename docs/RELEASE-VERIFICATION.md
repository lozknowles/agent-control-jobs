# Release verification

Initial publication revision: `fdcd9726305d54f85f7a75b03f9866277e0ca834`.

Two independent fresh clones were tested on 2026-09-12: Windows and Linux. Both used only the published README bootstrap and command sequence. `npm ci --ignore-scripts`, `npm run check`, list, search, inspect, suite, provenance, compatibility, catalogue checking/regeneration and fixture verification all completed successfully. Both working trees remained clean after catalogue regeneration. Optional global `npm link` was not needed or tested. No undocumented dependency or workaround was used.

At that revision 74/74 automated tests passed on both hosts. [GitHub Actions run](https://github.com/lozknowles/agent-control-jobs/actions/runs/34717687459) also passed its Ubuntu and Windows jobs, including dependency auditing. These are library/tooling tests, not 74 live workload qualifications.

The follow-up release commit adds a contributor-scaffold regression test and removes hard-coded catalogue-size assertions, so contributors can add simple jobs without editing unrelated tests. It also records this verification. The release tag identifies the final commit; its associated CI run is the final automated verification authority. No published canonical job payload was changed by that follow-up.

Read-only control integration evidence is separately recorded in [the qualification receipt](../examples/qualification/control-integration.json). All canonical jobs remain NOT_YET_QUALIFIED as end-to-end agent workloads.
