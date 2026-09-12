# Real-world use cases

Accessed 2026-09-12. See [methodology](METHODOLOGY.md), [source registry](sources.json), [Dataiku guide review](DATAIKU-GUIDE.md) and [coverage](COVERAGE.md). Original descriptions below are short paraphrases.

| Record | Source | Normalised workload | Category | Mapping |
|---|---|---|---|---|
| maintenance | [Dataiku p.14](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Plan maintenance from sensor and outage records | manufacturing | maintenance-plan |
| clinical | [Dataiku p.16](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Rank trial sites against eligibility evidence | life-sciences | UNSUPPORTED |
| code-research | [GitHub](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Inspect repository health and explain failing behaviour | software-engineering | repository-health-audit, investigate-regression, review-pull-request |
| bugfix | [GitHub](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Reproduce a defect, patch it, and execute regression tests | software-engineering | fix-failing-test |
| feature | [GitHub](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Implement a bounded feature with acceptance tests | software-engineering | small-feature, production-deployment, staging-deployment |
| docs | [GitHub](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Compare documented behaviour with code | software-engineering | documentation-consistency |
| debt | [GitHub](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Plan and verify dependency maintenance | software-engineering | dependency-upgrade |
| service | [Microsoft](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services) | Triage requests and route exceptions to service owners | it-operations | customer-support-triage, diagnose-unavailable-service, restart-failed-service, connector-interruption |
| leave | [Microsoft](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services) | Validate a leave request against policy and availability | business-administration | schedule-proposal |
| assets | [Microsoft](https://learn.microsoft.com/en-us/agents/adoption-patterns/pattern-workplace-it-services) | Reconcile asset demand and inventory before approval | business-administration | invoice-reconciliation |
| support | [AWS](https://aws.amazon.com/ai/generative-ai/use-cases/agent-assist/) | Classify a customer issue using policy and case history | customer-service | customer-support-triage |
| response | [AWS](https://aws.amazon.com/ai/generative-ai/use-cases/agent-assist/) | Draft a grounded support response and escalate uncertainty | communications | draft-response |
| contact-summary | [AWS](https://aws.amazon.com/ai/generative-ai/use-cases/agent-assist/) | Summarise decisions and unanswered customer questions | communications | inbox-triage |
| parallel-research | [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) | Delegate distinct questions and merge attributed evidence | multi-agent-orchestration | fan-out-research, topic-monitor, dependency-graph, partial-worker-failure |
| long-coding | [Anthropic](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Persist progress and resume a bounded task without duplication | long-running-autonomous-work | checkpoint-resume, delayed-dependency, operator-pause-resume |
| home | [Home Assistant](https://developers.home-assistant.io/docs/core/llm/) | Inspect device state and gate an entity change | iot-home-automation | home-entity-control |
| inventory | [Ollama](https://docs.ollama.com/api/tags) | Enumerate available models and immutable model identifiers | model-ai-operations | discover-models |
| probes | [NVIDIA / garak](https://github.com/NVIDIA/garak) | Test grounded answers and prompt-injection resistance | cybersecurity | hallucination-resistance |
| papers | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Compare research sources and retain evidence references | research | source-comparison, contradictory-evidence, technical-research |
| contracts | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Extract clauses with document locations | document-processing | structured-extraction, document-comparison |
| mail | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Recover decisions and outstanding actions from messages | communications | inbox-triage, meeting-preparation |
| tariffs | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Match extracted amounts to filings and flag mismatches | finance | invoice-reconciliation |
| sales | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Validate CRM record identity and surface exceptions | sales | crm-record-analysis |
| reports | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Analyse campaign measures and draft a sourced report | marketing | csv-analysis |
| knowledge | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Answer questions from current controlled documents | knowledge-work | document-collection-summary |
| safety | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Detect physical hazards from live video | physical-safety | UNSUPPORTED |
| media | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Generate and evaluate marketing video variations | creative-media | UNSUPPORTED |
| security-response | [Google Cloud](https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders) | Isolate compromised infrastructure with verified authority | cybersecurity | UNSUPPORTED |
| dataiku-tickets | [Dataiku p.12](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Retrieve similar resolved tickets, draft answers for approval, route difficult cases | it-operations | customer-support-triage, draft-response |
| dataiku-invoices | [Dataiku p.13](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Prioritise unpaid invoices using terms, relationships and payment history; prepare CRM updates | finance | invoice-reconciliation |
| dataiku-sales | [Dataiku p.15](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Optimise store pricing, inventory and promotions using demand and customer segments | sales | UNSUPPORTED |
| dataiku-compliance | [Dataiku p.17](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Monitor jurisdictions, compare policies, prioritise gaps and draft an implementation roadmap | compliance | topic-monitor, document-comparison |
| dataiku-supply | [Dataiku p.18](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Map disruptions to products, compare alternatives and simulate mitigations | supply-chain | supply-chain-risk |
| dataiku-client | [Dataiku p.19](https://pages.dataiku.com/the-ultimate-guide-to-ai-agent-use-cases) | Reconcile CRM and market changes, prioritise outreach and prepare context for meetings | financial-services | crm-record-analysis, meeting-preparation |
