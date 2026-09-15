# Benchmarks

Agent Control Lab benchmarks qualify a specific, evidence-bound combination:

`device × accelerator × runtime × model × configuration`

A benchmark should retain enough authoritative data to identify the hardware, immutable model, runtime build, configuration, workload, invocations, telemetry, validation result and provenance. A screenshot or a single throughput number is not a benchmark record.

## First worked example

The [Quadro P5000 × Qwen3.8-27B report](../reports/p5000-qwen3.8-27b/report.md) compares two physical 32K configurations. Downloads are available as [HTML](../reports/p5000-qwen3.8-27b/report.html), [Markdown](../reports/p5000-qwen3.8-27b/report.md), [JSON](../reports/p5000-qwen3.8-27b/report.json) and [CSV](../reports/p5000-qwen3.8-27b/report.csv).

The example records both fixed and changed fields. It reports a configuration-level observation and does not attribute a compound result to one optimisation.

## Evidence and report generation

The retained Agent Control evidence is authoritative. The committed [source projection](../reports/p5000-qwen3.8-27b/source-data.json) is a bounded, privacy-safe subset that keeps benchmark identities, measurements, hashes and verification state while excluding raw prompts, outputs, internal hostnames and node IDs, machine paths, private addresses and credentials. Public hardware identity is an operator-reviewed device profile containing only the system class/model, processor, RAM, GPU/VRAM, operating-system version and accelerator-runtime version required to interpret the result.

To verify that the chart and all report formats match that source:

```sh
npm run benchmark:example -- --check
```

To refresh the source from the retained evidence and regenerate the outputs:

```sh
npm run benchmark:example:import -- /path/to/qualification-evidence
npm run benchmark:example
```

The importer fails closed unless the selected physical results and Work Parcels succeeded, each run has three successful invocations, independent verification passed, immutable model hashes match and the comparison's declared fixed fields agree. The generator rejects private paths, private-network addresses and common credential forms before creating public outputs.

The [report manifest](../reports/p5000-qwen3.8-27b/manifest.json) binds each generated artifact to the committed source projection by SHA-256.

## Contribution boundary

New benchmark definitions and report generators are welcome. Do not commit raw estate dumps, model files, credentials or unredacted provider output. A report must distinguish provider-reported facts, locally measured values, derived values, estimates and unavailable measurements.
