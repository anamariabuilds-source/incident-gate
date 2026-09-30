import type { GateInput, GateResult } from "../types/incident";

export const demoGateInput: GateInput = {
  actionBoundedAndReversible: "YES",
  businessConsequencesUnderstood: "UNKNOWN",
  requiredEvidenceAvailable: "NO",
  authorityConfirmed: "UNVERIFIED",
};

export function evaluateReversibilityGate(input: GateInput): GateResult {
  const failedConditions = (Object.keys(input) as (keyof GateInput)[]).filter(
    (condition) => input[condition] !== "YES",
  );

  return {
    decision: failedConditions.length === 0 ? "MAY_PROCEED" : "HUMAN_ESCALATION_REQUIRED",
    failedConditions,
  };
}

export const demoGateResult = evaluateReversibilityGate(demoGateInput);
