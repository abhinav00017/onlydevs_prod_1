import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CLIENTS_DIR, loadClient, type ClientData } from "@/lib/load-client";

/** The real drgowthami data, validated. Render tests use it as their fixture. */
export function drgowthami(): ClientData {
  return loadClient("drgowthami");
}

/**
 * Copies clients/drgowthami/ to a temp folder, applies `mutate` to one JSON file,
 * and returns the temp clients dir. Lets a test break one field and check the message.
 */
export function brokenCopy(file: string, mutate: (json: Record<string, unknown>) => void): string {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "onlydevs-"));
  fs.cpSync(path.join(CLIENTS_DIR, "drgowthami"), path.join(tmp, "drgowthami"), { recursive: true });
  const p = path.join(tmp, "drgowthami", file);
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  mutate(json);
  fs.writeFileSync(p, JSON.stringify(json));
  return tmp;
}

export function problemsOf(fn: () => unknown): string[] {
  try {
    fn();
  } catch (err) {
    return (err as { problems?: string[] }).problems ?? [String(err)];
  }
  return [];
}
