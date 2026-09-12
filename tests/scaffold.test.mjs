import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ROOT, read, validateJob } from "../tools/library.mjs";
import { scaffold } from "../tools/scaffold.mjs";
test("a small contributor template creates a valid job without controller internals", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ac-starter-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(
    path.join(ROOT, "jobs/data/csv-analysis"),
    path.join(root, "jobs/data/csv-analysis"),
    { recursive: true },
  );
  fs.cpSync(path.join(ROOT, "spec"), path.join(root, "spec"), {
    recursive: true,
  });
  const result = scaffold(path.join(ROOT, "templates/simple-job.yaml"), root);
  const dir = path.join(root, result.created);
  assert.equal(
    validateJob({ dir, manifest: read(path.join(dir, "job.yaml")) }, root),
    true,
  );
  assert.throws(
    () => scaffold(path.join(ROOT, "templates/simple-job.yaml"), root),
    /already exists/,
  );
});
