export const evidenceStates = ["CONFIRMED", "UNVERIFIED", "UNKNOWN"] as const;

export type EvidenceState = (typeof evidenceStates)[number];

export type EvidenceItem = {
  id: string;
  label: string;
  detail: string;
  state: EvidenceState;
};

export type SimulatedIncident = {
  id: string;
  title: string;
  incidentType: string;
  context: "Microsoft 365";
  account: string;
  alertType: string;
  occurredAt: string;
  displayTime: string;
  source: string;
  evidence: readonly EvidenceItem[];
};

export const gateStates = ["YES", "NO", "UNKNOWN", "UNVERIFIED"] as const;
export type GateState = (typeof gateStates)[number];

export type GateInput = {
  requiredEvidenceAvailable: GateState;
  businessConsequencesUnderstood: GateState;
  authorityConfirmed: GateState;
  actionBoundedAndReversible: GateState;
};

export type GateResult = {
  decision: "MAY_PROCEED" | "HUMAN_ESCALATION_REQUIRED";
  failedConditions: readonly (keyof GateInput)[];
};
