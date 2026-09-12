# Use-case traceability

Every mapped job below is component representation and NOT_YET_QUALIFIED. [Machine-readable detail](traceability.json) includes capabilities, governance, evidence and suites.

| Published record | Canonical jobs | Integration | Suites |
|---|---|---|---|
| maintenance | maintenance-plan | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| clinical | none | UNSUPPORTED |  |
| code-research | repository-health-audit, investigate-regression, review-pull-request | REQUIRES_CONFIGURATION | AC-QUAL-CODING, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| bugfix | fix-failing-test | REQUIRES_CONFIGURATION | AC-QUAL-CODING, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| feature | small-feature, production-deployment, staging-deployment | REQUIRES_CONFIGURATION | AC-QUAL-CODING, AC-QUAL-FULL, AC-QUAL-OPERATIONS, AC-QUAL-REAL-WORLD |
| docs | documentation-consistency | REQUIRES_CONFIGURATION | AC-QUAL-CODING, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| debt | dependency-upgrade | REQUIRES_CONFIGURATION | AC-QUAL-CODING, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| service | customer-support-triage, diagnose-unavailable-service, restart-failed-service, connector-interruption | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-LONG-RUNNING, AC-QUAL-OPERATIONS, AC-QUAL-REAL-WORLD, AC-QUAL-RECOVERY |
| leave | schedule-proposal | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| assets | invoice-reconciliation | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| support | customer-support-triage | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| response | draft-response | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| contact-summary | inbox-triage | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| parallel-research | fan-out-research, topic-monitor, dependency-graph, partial-worker-failure | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-LONG-RUNNING, AC-QUAL-PARALLEL, AC-QUAL-REAL-WORLD |
| long-coding | checkpoint-resume, delayed-dependency, operator-pause-resume | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-LONG-RUNNING, AC-QUAL-MULTI-MODEL, AC-QUAL-REAL-WORLD, AC-QUAL-RECOVERY |
| home | home-entity-control | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD, AC-QUAL-REMOTE |
| inventory | discover-models | REQUIRES_CONFIGURATION | AC-QUAL-ESTATE, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| probes | hallucination-resistance | REQUIRES_CONFIGURATION | AC-QUAL-CORE, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| papers | source-comparison, contradictory-evidence, technical-research | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-GOVERNANCE, AC-QUAL-REAL-WORLD |
| contracts | structured-extraction, document-comparison | REQUIRES_CONFIGURATION | AC-QUAL-CORE, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| mail | inbox-triage, meeting-preparation | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| tariffs | invoice-reconciliation | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| sales | crm-record-analysis | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| reports | csv-analysis | REQUIRES_CONFIGURATION | AC-QUAL-CORE, AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| knowledge | document-collection-summary | REQUIRES_CONFIGURATION | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| safety | none | UNSUPPORTED |  |
| media | none | UNSUPPORTED |  |
| security-response | none | UNSUPPORTED |  |
| dataiku-tickets | customer-support-triage, draft-response | REQUIRES_CONNECTOR | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| dataiku-invoices | invoice-reconciliation | REQUIRES_CONNECTOR | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| dataiku-sales | none | UNSUPPORTED |  |
| dataiku-compliance | topic-monitor, document-comparison | REQUIRES_CONNECTOR | AC-QUAL-FULL |
| dataiku-supply | supply-chain-risk | REQUIRES_CONNECTOR | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
| dataiku-client | crm-record-analysis, meeting-preparation | REQUIRES_CONNECTOR | AC-QUAL-FULL, AC-QUAL-REAL-WORLD |
