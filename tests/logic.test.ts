import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allSignaturesApproved,
  signatureProgress,
  blockedBy,
  blocking,
  isOpenAction,
} from "../src/lib/logic";
import type { Signature, Dependency, ActionItem } from "../src/lib/domain";

function sig(status: Signature["status"]): Signature {
  return { id: "s", meetingId: "m", approverId: "a", approverName: "x", role: "team_lead", status, comment: "", signedAt: null, revision: 1 };
}

test("allSignaturesApproved: empty list is not approved", () => {
  assert.equal(allSignaturesApproved([]), false);
});

test("allSignaturesApproved: mixed statuses are not approved", () => {
  assert.equal(allSignaturesApproved([sig("approved"), sig("pending")]), false);
});

test("allSignaturesApproved: all approved is approved", () => {
  assert.equal(allSignaturesApproved([sig("approved"), sig("approved")]), true);
});

test("signatureProgress counts approved over total", () => {
  const p = signatureProgress([sig("approved"), sig("pending"), sig("changes_requested")]);
  assert.deepEqual(p, { signed: 1, total: 3 });
});

test("blockedBy / blocking are directional inverses", () => {
  const deps: Dependency[] = [
    { id: "d1", projectId: "p", blockingActionId: "A", blockedActionId: "B", note: "", createdAt: "" },
  ];
  assert.deepEqual(blockedBy("B", deps), ["A"]);
  assert.deepEqual(blocking("A", deps), ["B"]);
  assert.deepEqual(blockedBy("A", deps), []);
});

test("isOpenAction excludes done and canceled", () => {
  const base: ActionItem = {
    id: "a", projectId: "p", meetingId: "m", title: "t", description: "", ownerId: "o",
    deadline: null, status: "in_progress", priority: "low", relatedDecisionId: null,
    createdAt: "", updatedAt: "", completedAt: null,
  };
  assert.equal(isOpenAction({ ...base, status: "in_progress" }), true);
  assert.equal(isOpenAction({ ...base, status: "blocked" }), true);
  assert.equal(isOpenAction({ ...base, status: "done" }), false);
  assert.equal(isOpenAction({ ...base, status: "canceled" }), false);
});
