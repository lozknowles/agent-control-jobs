# Agent templates

An agent template is a reusable role, portable instruction set, working method and output contract. It is not a Job, a run, a worker, a credential, a permission grant or a claim of expertise.

The first release contains:

- [Researcher](researcher/template.yaml)
- [Code reviewer](code-reviewer/template.yaml)
- [Evidence verifier](evidence-verifier/template.yaml)
- [Documentation writer](documentation-writer/template.yaml)
- [Model evaluator](model-evaluator/template.yaml)

Every template version has an immutable content digest. Agent Control binds that digest, the selected Job version, inputs and execution configuration into the governed run. Editing a template requires a new version and digest; historical evidence continues to identify the old content.

These definitions selectively adapt workflow ideas from [agency-agents](https://github.com/msitarzewski/agency-agents) revision `ad9264e309bd5e5422c04784372d7841b1e5d604`, used under its MIT licence, Copyright (c) 2025 AgentLand Contributors. The portable templates intentionally remove fictional expertise or persistent memory, predetermined finding quotas, mandatory revision counts and the assumption that screenshots prove every behaviour.
