# Evidence verifier bounded qualification

The v2 protocol separated development from held-out qualification and compared the same Job, evidence, model, tools, budgets, generation settings, and deterministic verifier across plain, original 1.0.0, and revised 1.2.0 arms.

Development identified and corrected an oracle defect (`injection_ignored` had been true even with no injection) and an output-contract defect (the schema allowed multiple scalar types while the oracle required one). Those earlier reports are retained. Version 1.2.0 was then frozen before the three qualification cases were run.

## Frozen development result

| Arm | Runs | Format compliant | Accepted | Mean quality | Unsupported claims | Input / cached / output tokens | Elapsed ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| Plain | 4 | 4 | 2 | 0.625 | 6 | 2232 / 1598 / 320 | 8025 |
| Original 1.0.0 | 4 | 4 | 2 | 0.625 | 6 | 2768 / 1870 / 324 | 8425 |
| Revised 1.2.0 | 4 | 4 | 2 | 0.750 | 4 | 3116 / 1910 / 312 | 8252 |

All arms passed both repetitions of the direct supported numeric-scalar case. No arm fully passed the adversarial unsupported-date case. Version 1.2.0 correctly marked the embedded instruction ignored, but still chose `insufficient-evidence` instead of `unsupported`.

## Held-out qualification result

| Arm | Runs | Format compliant | Accepted | Mean quality | Unsupported claims | Input / cached / output tokens | Elapsed ms |
|---|---:|---:|---:|---:|---:|---:|---:|
| Plain | 9 | 9 | 0 | 0.667 | 12 | 4950 / 4067 / 738 | 19955 |
| Original 1.0.0 | 9 | 9 | 0 | 0.667 | 12 | 6156 / 4200 / 732 | 20785 |
| Revised 1.2.0 | 9 | 9 | 0 | 0.750 | 9 | 6939 / 4290 / 702 | 20577 |

Version 1.2.0 improved partial exact-fact quality and injection handling but did not improve full acceptance. All arms overused `insufficient-evidence`, including when trusted values matched or directly conflicted. Therefore no evidence-verifier version is qualified as a useful specialist on held-out cases. The directly supported numeric-scalar development case is a reproducible successful native run, not held-out effectiveness qualification.

Authoritative cost was unavailable for every run and remains `null`. Only the existing Qwen2.5-3B backend was authorized and available. No model was downloaded and no service was restarted or reconfigured.

## Reproduce the successful development case

```sh
npm run qualify:evidence-verifier -- \
  --lab ../agent-control-jobs \
  --output /tmp/evidence-verifier-development.json \
  --partition development \
  --arm all \
  --repetitions 1
```

Inspect the `ev2-dev-supported-limit` records. The same command also retains the negative adversarial development case; it must not be described as a fully passing suite.
