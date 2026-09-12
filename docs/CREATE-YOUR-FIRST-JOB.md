# Create your first Agent Control job

Describe one useful action in a sentence. You do not need to design an agent, select a model or know Work Parcels.

Copy templates/simple-job.yaml to a scratch file. Change the objective, example input, expected facts and source. `permission: read-only` means no changes to the target; the starter allows a report in an isolated output directory. For other effects, choose a declared permission kind and describe the target carefully.

```sh
node tools/cli.mjs new templates/simple-job.yaml
```

This creates a normal job folder. Inspect its generated manifest, especially permissions and requirements. Add any connector, credential **reference**, resource or capability the real job needs. Keep live access unconfigured until it has been reviewed. The tool defaults to no connector, no credentials and zero monetary budget.

The expected JSON is a small acceptance example, not the worker's answer. Keep it outside the worker's context. Add a plausible wrong-result test, then include the new ID and expected outcome in the appropriate suite and AC-QUAL-FULL. Existing generic tests automatically exercise every job; there is no hard-coded catalogue size to update.

```sh
node tools/cli.mjs validate jobs/data/check-order-total
npm run catalogue
npm run check
```

Your pull request needs only the simple objective, provenance, declared authority, fixture and a meaningful check. Maintainers can help with schema and suite questions. For an existing objective, prefer a small variant JSON containing its example, assertions and additional requirements.
