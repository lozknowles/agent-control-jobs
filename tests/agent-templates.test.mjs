import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {ROOT, agentTemplates, getAgentTemplate, getJob, templateDigest, templateReadiness, templateSelection, validateAgentTemplate} from "../tools/library.mjs";

test("versioned agent templates validate and bind exact portable content", () => {
  const templates = agentTemplates();
  assert.deepEqual(templates.map((item) => `${item.manifest.id}@${item.manifest.version}`), ["code-reviewer@1.0.0", "documentation-writer@1.0.0", "evidence-verifier@1.0.0", "evidence-verifier@1.1.0", "model-evaluator@1.0.0", "researcher@1.0.0"]);
  for (const template of templates) {
    assert.equal(validateAgentTemplate(template), true);
    assert.equal(templateDigest(template), template.manifest.content_digest);
    assert.equal(template.manifest.requirements.memory.mode === "run-scoped" || template.manifest.requirements.memory.mode === "none", true);
  }
});

test("template lookup selects an exact version or the latest version", () => {
  assert.equal(getAgentTemplate("evidence-verifier@1.0.0").manifest.version, "1.0.0");
  assert.equal(getAgentTemplate("evidence-verifier").manifest.version, "1.1.0");
});

test("template digest rejects edited content without a versioned manifest update", (t) => {
  const source = getAgentTemplate("researcher"), root = fs.mkdtempSync(path.join(os.tmpdir(), "ac-template-"));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  fs.cpSync(source.dir, root, {recursive: true});
  const copy = {...source, dir: root, manifestPath: path.join(root, "template.yaml")};
  fs.appendFileSync(path.join(root, "instructions.md"), "\nchanged\n");
  assert.notEqual(templateDigest(copy), source.manifest.content_digest);
});

test("readiness composes template and Job requirements without granting authority", () => {
  const estate = JSON.parse(fs.readFileSync(path.join(ROOT, "examples/estate.json"), "utf8"));
  const context = JSON.parse(fs.readFileSync(path.join(ROOT, "examples/context.json"), "utf8"));
  const result = templateReadiness(getAgentTemplate("researcher"), getJob("technical-research"), estate, context, new Date(estate.observed_at));
  assert.equal(result.authority_granted, false);
  assert.equal(result.template_digest, getAgentTemplate("researcher").manifest.content_digest);
  const selection = templateSelection(getAgentTemplate("researcher"), getJob("technical-research"), estate, context, new Date(estate.observed_at));
  assert.equal(selection.execution, "SUBMIT_TO_AGENT_CONTROL");
  assert.equal(selection.template.digest, result.template_digest);
});

test("template CLI browse, inspect and qualification commands remain machine-readable", () => {
  for (const args of [["template-list"], ["template-search", "evidence"], ["template-inspect", "researcher"], ["template-qualifications", "researcher"]]) {
    const result = spawnSync(process.execPath, [path.join(ROOT, "tools/cli.mjs"), ...args], {encoding: "utf8"});
    assert.equal(result.status, 0, result.stderr);
    assert.ok(JSON.parse(result.stdout));
  }
});
