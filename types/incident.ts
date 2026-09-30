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
