import type { EvidenceState } from "@/types/incident";

const statusContent: Record<EvidenceState, { icon: string; label: string }> = {
  CONFIRMED: { icon: "✓", label: "CONFIRMADO" },
  UNKNOWN: { icon: "?", label: "DESCONOCIDO" },
  UNVERIFIED: { icon: "◷", label: "NO VERIFICADO" },
};

export function StatusBadge({ state }: { state: EvidenceState }) {
  const content = statusContent[state];
  return <span className={`status-badge ${state.toLowerCase()}`}><span aria-hidden="true">{content.icon}</span>{content.label}</span>;
}
