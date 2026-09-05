import type { Signature, Dependency, ActionItem } from "./domain";

/**
 * Pure, framework-free governance rules. Kept separate from actions.ts so they
 * can be unit-tested without the Next.js server runtime.
 */

/** A meeting becomes "approved" only when it has signatures and all are approved. */
export function allSignaturesApproved(signatures: Signature[]): boolean {
  return signatures.length > 0 && signatures.every((s) => s.status === "approved");
}

/** Signature progress, e.g. for "۱ از ۲ امضا". */
export function signatureProgress(signatures: Signature[]): { signed: number; total: number } {
  return { signed: signatures.filter((s) => s.status === "approved").length, total: signatures.length };
}

/** Actions that block the given action (its "blocked by" set). */
export function blockedBy(actionId: string, dependencies: Dependency[]): string[] {
  return dependencies.filter((d) => d.blockedActionId === actionId).map((d) => d.blockingActionId);
}

/** Actions blocked by the given action (its "blocking" set). */
export function blocking(actionId: string, dependencies: Dependency[]): string[] {
  return dependencies.filter((d) => d.blockingActionId === actionId).map((d) => d.blockedActionId);
}

/** An action is open when it is neither done nor canceled. */
export function isOpenAction(action: ActionItem): boolean {
  return action.status !== "done" && action.status !== "canceled";
}
