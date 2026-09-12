// Explicit projection of the inspected Agent Control discovery contract.
// Operator bindings are trusted configuration; discovered labels never grant capabilities.
export function projectDiscovery(scan, bindings, now = new Date()) {
  if (
    scan.schema !== "agent-control.environment-discovery/v1" ||
    !Array.isArray(scan.items)
  )
    throw Error("unsupported_discovery_schema");
  const eligible = (id) =>
    scan.items.some(
      (i) =>
        i.id === id &&
        i.health === "HEALTHY" &&
        ["QUALIFIED", "ACTIVE"].includes(i.lifecycle) &&
        ["QUALIFIED", "ACTIVE"].includes(i.operationalState) &&
        i.provenance?.some(
          (p) =>
            p.authority === "AUTHORITATIVE" &&
            Number.isFinite(Date.parse(p.observedAt)) &&
            now - Date.parse(p.observedAt) >= 0 &&
            now - Date.parse(p.observedAt) <= 300000,
        ),
    );
  const names = (group) =>
    Object.entries(bindings[group] ?? {})
      .filter(([, id]) => eligible(id))
      .map(([name]) => name);
  return {
    schema_version: "1.0.0",
    observed_at: scan.completedAt,
    max_age_seconds: 300,
    platform: bindings.platform ?? "unknown",
    capabilities: names("capabilities"),
    connectors: names("connectors"),
    credentials: names("credentials"),
    resources: (bindings.resources ?? []).map((r) => ({
      id: r.id,
      count: r.count,
      healthy: eligible(r.discovery_id),
    })),
    models: names("models"),
    configured_jobs: bindings.configured_jobs ?? [],
    grants: [],
    budget: { amount: 0, currency: "USD" },
    blocked: scan.status !== "COMPLETED",
  };
}
