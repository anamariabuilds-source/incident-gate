import type { EvidenceItem, GateResult, SimulatedIncident } from "../types/incident";

export type EscalationPacket = {
  incidentType: string;
  account: string;
  detectedAt: string;
  confirmedEvidence: readonly string[];
  incompleteInformation: readonly string[];
  proposedAction: string;
  blockReason: string;
  specialistQuestions: readonly string[];
};

export function buildEscalationPacket(
  incident: SimulatedIncident,
  gateResult: GateResult,
): EscalationPacket {
  const confirmedEvidence = incident.evidence
    .filter((item) => item.state === "CONFIRMED")
    .map((item) => item.label);
  const incompleteInformation = incident.evidence
    .filter((item) => item.state !== "CONFIRMED")
    .map(formatIncompleteItem);

  if (gateResult.failedConditions.includes("authorityConfirmed")) {
    incompleteInformation.push("Autoridad del operador para revocar sesiones — NO VERIFICADA");
  }

  return {
    incidentType: incident.incidentType,
    account: incident.account,
    detectedAt: incident.displayTime,
    confirmedEvidence,
    incompleteInformation,
    proposedAction: "Revocar sesiones activas del usuario",
    blockReason: "Los requisitos de Tier-1 no se cumplieron: no se entienden suficientemente las consecuencias para el negocio, falta evidencia necesaria y la autoridad del operador no está verificada.",
    specialistQuestions: [
      "¿Deben revocarse ahora las sesiones activas?",
      "¿Qué evidencia adicional se requiere?",
      "¿Qué dependencias del negocio deben revisarse?",
      "¿Qué acción de contención es apropiada?",
    ],
  };
}

function formatIncompleteItem(item: EvidenceItem): string {
  const state = item.state === "UNKNOWN" ? "DESCONOCIDO" : "NO VERIFICADO";
  return `${item.label} — ${state}`;
}

export function packetToText(packet: EscalationPacket): string {
  return [
    "INCIDENT GATE — PAQUETE DE ESCALACIÓN",
    "DATOS DE SEGURIDAD SIMULADOS",
    "",
    `Tipo de incidente: ${packet.incidentType}`,
    `Cuenta: ${packet.account}`,
    `Detectado: ${packet.detectedAt}`,
    "",
    "Evidencia confirmada:",
    ...packet.confirmedEvidence.map((item) => `- ${item}`),
    "",
    "Información desconocida o no verificada:",
    ...packet.incompleteInformation.map((item) => `- ${item}`),
    "",
    `Acción propuesta: ${packet.proposedAction}`,
    `Razón del bloqueo: ${packet.blockReason}`,
    "",
    "Preguntas para el especialista:",
    ...packet.specialistQuestions.map((question) => `- ${question}`),
  ].join("\n");
}
