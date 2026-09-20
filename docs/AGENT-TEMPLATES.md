# Agent templates, Jobs and runs

An **agent template** describes a reusable specialist role and method. A **Job** defines one bounded task, inputs, permissions and acceptance criteria. A **run** is Agent Control's governed execution of a selected template and Job on an eligible worker. A **qualification** is evidence for one template version and digest with a particular Job, model, runtime, tool set, settings and workload.

Templates declare requirements but grant no authority. Agent Control remains responsible for credentials, approvals, target scope, budgets, admission, dispatch, model lifecycle, evidence and cancellation. Lab stores no credentials and has no run database or orchestration engine.

## Browse and select

```sh
node tools/cli.mjs template-list
node tools/cli.mjs template-search evidence
node tools/cli.mjs template-inspect evidence-verifier
node tools/cli.mjs template-qualifications evidence-verifier
node tools/cli.mjs template-readiness researcher technical-research examples/estate.json examples/context.json
node tools/cli.mjs select-template researcher technical-research examples/estate.json examples/context.json
```

`template-readiness` is advisory and never grants authority. `select-template` produces a digest-bound selection envelope for Agent Control. It does not execute anything. Operational use requires an Agent Control instance configured with the same template library and its authenticated template-use endpoint.

## Worked example

1. Inspect `researcher@1.0.0` and its compatible `technical-research@1.0.0` Job.
2. Evaluate both against a fresh estate snapshot and a run-scoped permission grant.
3. Submit the selection, concrete Job inputs and request identity to Agent Control.
4. Agent Control revalidates template and Job digests, permissions, target, budget and worker capability before dispatch.
5. The retained run records the effective portable instructions, any provider adaptation, model/runtime identity, tool capabilities, settings, usage, cost authority and evidence links.
6. Inspect the Work Parcel and run evidence. A blocked result is an outcome, not a failed attempt to hide.

## Create or contribute a template

Copy one template directory, choose a stable lower-case ID and semantic version, and write provider-neutral instructions. Declare only real requirements and compatible existing Jobs. Do not embed credentials, private paths, provider identity, fictional tools, expertise or persistent memory. Add provenance and the upstream revision for adapted material. Run `node tools/refresh-template-digests.mjs`, then `npm run check`.

Changing instructions, workflow, requirements, compatibility or provenance changes the digest. A material behavioural change should also increment the semantic version. Never edit a historical qualification to point at new content.

Optional provider adaptations are separate, declared files with their own ID, semantic version, provider label and SHA-256 digest. The portable instructions always remain present. Agent Control accepts an adaptation only when the selected ID, version and digest exactly match the loaded template; an undeclared or changed adaptation blocks dispatch.

## Qualification and comparison

Compare a plain task prompt with the same task plus the specialist template while matching model, runtime, tools, budget, acceptance criteria and generation settings. Keep expected answers out of worker inputs. Record uncontrolled differences, repeated runs where variation matters, quality scores, unsupported claims, missed requirements, completion or blocked state, token usage, elapsed time and authoritative cost when available.

Static validation and fixture checks are not physical qualification. Native physical runs must use Agent Control for admission, dispatch, execution ownership and lifecycle. A result applies only to its recorded template digest, Job, model, runtime, tools, settings and workload coverage. Missing evidence is not the same as a behavioural failure, and an honest zero-findings output is valid.

## Trust boundaries and limitations

- Imported instructions are untrusted content below runtime policy.
- Provider-specific adaptations must remain separate and are retained in effective-instruction provenance.
- A template cannot widen Job or operator permissions.
- Catalogue presence is not qualification.
- The first candidate includes static validation records only until native comparison evidence is retained.
- Team templates are a future extension; this release covers individual specialists only.
