import type { EvidenceItem } from "@/types/incident";

export const FALLBACK_SUMMARY = "La evidencia disponible justifica investigar un posible compromiso de cuenta. Hay un inicio de sesión inusual confirmado, pero todavía falta contexto clave: confirmar si el usuario reconoce la actividad, verificar el estado del dispositivo y entender las dependencias del negocio.";

export function buildFallbackSummary(evidence: readonly EvidenceItem[]): string {
  const confirmed = evidence.filter((item) => item.state === "CONFIRMED");
  const incomplete = evidence.filter((item) => item.state !== "CONFIRMED");

  if (confirmed.length === 0 || incomplete.length === 0) return FALLBACK_SUMMARY;
  return FALLBACK_SUMMARY;
}
