// Compare against an explicitly selected trusted prior catalogue. Does not fetch or execute jobs.
import fs from "node:fs";
import { catalogue, read } from "./library.mjs";
if (!process.argv[2]) throw Error("prior catalogue file required");
const previous = read(process.argv[2]);
const current = catalogue();
for (const old of previous.jobs) {
  const same = current.jobs.find(
    (j) => j.id === old.id && j.version === old.version,
  );
  if (same && same.sha256 !== old.sha256)
    throw Error(`immutable_version_changed: ${old.id}@${old.version}`);
}
console.log("existing identity/version digests preserved");
