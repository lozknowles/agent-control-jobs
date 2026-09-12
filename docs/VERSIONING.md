# Independent versions

Library 0.1.0, job specification 1.0.0, individual jobs 1.0.0, suites 1.0.0 and catalogue schema 1.0.0 are independent. Agent Control minimum_version is null until a consumer adapter is qualified against an explicit controller version. The inspected feature branch is not a supported minimum release claim.

Any change to a published job payload requires a job version bump, including prompt, fixture, validator and README changes. Catalogue SHA-256 binds every declared file plus the manifest. CI compares a pull request with its trusted base catalogue and rejects changed bytes under an existing ID/version. A renamed job needs retained provenance. Never retag an existing release.

Breaking schema changes increment major version. Compatible features increment minor; corrections increment patch. Suite membership or scoring changes require suite version updates. Generated catalogue data changes with library content; catalogue schema version only changes with the contract.
