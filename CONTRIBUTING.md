# Contribute a small, useful job

You do not need to know Agent Control internals. Start with one sentence describing useful work. Declare what data and access it needs, and provide a small example with a checkable expected result.

1. Follow [Create Your First Job](docs/CREATE-YOUR-FIRST-JOB.md).
2. Preserve source provenance and distinguish published examples from your own requirements.
3. Use synthetic data. Declare every effect and approval boundary; no credentials or personal records.
4. Provide a meaningful negative test as well as a correct result. A validator must reject a plausible wrong answer, missing evidence and an unauthorised action.
5. Run `npm run catalogue` and `npm run check`. Keep generated output in the pull request.
6. Explain the objective, origin, risk, expected outcome and validation. Keep prompts short. Add a variant when the objective is already represented.

Maintainers assess quality, safety and usefulness beyond YAML parsing. A community contribution does not need a connector or a live qualification result to be reviewed, but it must label missing integration honestly. Published jobs are immutable by ID/version; bump the job version for any payload change. Job schemas and controller adapters are maintainer responsibilities.
