import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSeed } from "../src/lib/seed";

const db = buildSeed();
const ids = <T extends { id: string }>(arr: T[]) => new Set(arr.map((x) => x.id));

test("seed has the expected top-level collections populated", () => {
  assert.ok(db.people.length >= 5);
  assert.ok(db.projects.length >= 3);
  assert.ok(db.meetings.length >= 3);
  assert.ok(db.decisions.length >= 3);
  assert.ok(db.actions.length >= 3);
});

test("every meeting references an existing project", () => {
  const projectIds = ids(db.projects);
  for (const m of db.meetings) assert.ok(projectIds.has(m.projectId), `meeting ${m.id} → ${m.projectId}`);
});

test("every decision references an existing meeting and project", () => {
  const meetingIds = ids(db.meetings);
  const projectIds = ids(db.projects);
  for (const d of db.decisions) {
    assert.ok(meetingIds.has(d.meetingId), `decision ${d.id} meeting`);
    assert.ok(projectIds.has(d.projectId), `decision ${d.id} project`);
  }
});

test("every action references an existing owner, meeting, and (optional) decision", () => {
  const peopleIds = ids(db.people);
  const meetingIds = ids(db.meetings);
  const decisionIds = ids(db.decisions);
  for (const a of db.actions) {
    assert.ok(peopleIds.has(a.ownerId), `action ${a.id} owner`);
    assert.ok(meetingIds.has(a.meetingId), `action ${a.id} meeting`);
    if (a.relatedDecisionId) assert.ok(decisionIds.has(a.relatedDecisionId), `action ${a.id} decision`);
  }
});

test("every dependency references two existing, distinct actions", () => {
  const actionIds = ids(db.actions);
  for (const d of db.dependencies) {
    assert.ok(actionIds.has(d.blockingActionId), `dep ${d.id} blocking`);
    assert.ok(actionIds.has(d.blockedActionId), `dep ${d.id} blocked`);
    assert.notEqual(d.blockingActionId, d.blockedActionId, `dep ${d.id} self-block`);
  }
});

test("every signature references an existing meeting", () => {
  const meetingIds = ids(db.meetings);
  for (const s of db.signatures) assert.ok(meetingIds.has(s.meetingId), `sig ${s.id}`);
});

test("closed projects retain a closed date and final approval", () => {
  const closed = db.projects.filter((p) => p.lifecycle === "closed");
  assert.ok(closed.length >= 1, "expected at least one closed project version");
  for (const p of closed) {
    assert.ok(p.closedDate, `${p.id} closedDate`);
    const approval = db.projectApprovals.find((a) => a.projectId === p.id);
    assert.ok(approval && approval.status === "approved", `${p.id} CEO approval`);
  }
});

test("project versioning: a new version is a distinct record referencing its predecessor", () => {
  const v2 = db.projects.find((p) => p.versionNumber === 2);
  assert.ok(v2, "expected a version 2 project");
  assert.ok(v2!.previousVersionId, "v2 links to previous version");
  const v1 = db.projects.find((p) => p.id === v2!.previousVersionId);
  assert.ok(v1 && v1.id !== v2!.id, "v1 is a separate record");
});

test("activities reference existing projects", () => {
  const projectIds = ids(db.projects);
  for (const a of db.activities) assert.ok(projectIds.has(a.projectId), `activity ${a.id}`);
});
