import { evidenceStates, type EvidenceItem, type EvidenceState } from "@/types/incident";

export function isEvidenceState(value: unknown): value is EvidenceState {
  return typeof value === "string" && evidenceStates.includes(value as EvidenceState);
}

export function isEvidenceItem(value: unknown): value is EvidenceItem {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" && candidate.id.length > 0 && candidate.id.length <= 80 &&
    typeof candidate.label === "string" && candidate.label.length > 0 && candidate.label.length <= 180 &&
    typeof candidate.detail === "string" && candidate.detail.length > 0 && candidate.detail.length <= 500 &&
    isEvidenceState(candidate.state)
  );
}

export function parseEvidenceList(value: unknown): EvidenceItem[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 12 || !value.every(isEvidenceItem)) return null;
  return value;
}
