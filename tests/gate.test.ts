import assert from "node:assert/strict";
import test from "node:test";
import { demoGateInput, evaluateReversibilityGate } from "../lib/gate.ts";

test("the approved demo always requires human escalation", () => {
  const result = evaluateReversibilityGate(demoGateInput);
  assert.equal(result.decision, "HUMAN_ESCALATION_REQUIRED");
  assert.deepEqual(result.failedConditions, [
    "businessConsequencesUnderstood",
    "requiredEvidenceAvailable",
    "authorityConfirmed",
  ]);
});

test("a bounded Tier-1 action may proceed only when every condition is YES", () => {
  const result = evaluateReversibilityGate({
    requiredEvidenceAvailable: "YES",
    businessConsequencesUnderstood: "YES",
    authorityConfirmed: "YES",
    actionBoundedAndReversible: "YES",
  });
  assert.equal(result.decision, "MAY_PROCEED");
  assert.deepEqual(result.failedConditions, []);
});

for (const blockingState of ["NO", "UNKNOWN", "UNVERIFIED"] as const) {
  test(`${blockingState} blocks a required gate condition`, () => {
    const result = evaluateReversibilityGate({
      requiredEvidenceAvailable: blockingState,
      businessConsequencesUnderstood: "YES",
      authorityConfirmed: "YES",
      actionBoundedAndReversible: "YES",
    });
    assert.equal(result.decision, "HUMAN_ESCALATION_REQUIRED");
  });
}

test("explanatory AI text is not an input accepted by the gate", () => {
  const allowedKeys = Object.keys(demoGateInput).sort();
  assert.deepEqual(allowedKeys, [
    "actionBoundedAndReversible",
    "authorityConfirmed",
    "businessConsequencesUnderstood",
    "requiredEvidenceAvailable",
  ]);
});
