import test from "node:test";
import assert from "node:assert/strict";
import { projectDiscovery } from "../tools/discovery.mjs";
const clock = new Date("2026-09-12T12:00:00Z");
const item = {
  id: "x",
  health: "HEALTHY",
  lifecycle: "QUALIFIED",
  operationalState: "QUALIFIED",
  provenance: [{ authority: "AUTHORITATIVE", observedAt: clock.toISOString() }],
};
const scan = () => ({
  schema: "agent-control.environment-discovery/v1",
  status: "COMPLETED",
  completedAt: clock.toISOString(),
  items: [structuredClone(item)],
});
test("qualified discovery projects explicit mappings without grants", () => {
  const e = projectDiscovery(
    scan(),
    { capabilities: { "host.inspect": "x" } },
    clock,
  );
  assert.deepEqual(e.capabilities, ["host.inspect"]);
  assert.deepEqual(e.grants, []);
  assert.equal(e.budget.amount, 0);
});
test("discovered, stale, configured-only and unhealthy items cannot establish readiness", () => {
  for (const mutation of [
    (i) => (i.lifecycle = "DISCOVERED"),
    (i) => (i.health = "UNKNOWN"),
    (i) => (i.provenance[0].authority = "CONFIGURED"),
    (i) => (i.provenance[0].observedAt = "2020-01-01"),
  ]) {
    const s = scan();
    mutation(s.items[0]);
    assert.deepEqual(
      projectDiscovery(s, { capabilities: { "host.inspect": "x" } }, clock)
        .capabilities,
      [],
    );
  }
});
