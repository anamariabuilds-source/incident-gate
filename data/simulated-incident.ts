import type { SimulatedIncident } from "@/types/incident";

export const simulatedIncident = {
  id: "IG-DEMO-001",
  title: "Posible compromiso de cuenta",
  incidentType: "Posible compromiso de credenciales",
  context: "Microsoft 365",
  account: "empleado01@empresa-demo.mx",
  alertType: "Inicio de sesión inusual",
  occurredAt: "2026-01-14T08:07:00-06:00",
  displayTime: "14 de enero de 2026, 8:07 AM (hora CDMX)",
  source: "Microsoft 365 Security (simulado)",
  evidence: [
    {
      id: "foreign-login",
      label: "Inicio de sesión inusual desde el extranjero",
      detail: "Inicio de sesión desde Moscú, Rusia; IP simulada 185.•••.•••.24.",
      state: "CONFIRMED",
    },
    {
      id: "user-recognition",
      label: "El usuario reconoce el inicio de sesión",
      detail: "Aún no se ha confirmado si el usuario reconoce esta actividad.",
      state: "UNKNOWN",
    },
    {
      id: "device-security",
      label: "Estado de seguridad del dispositivo",
      detail: "No hay información reciente sobre el estado de seguridad del dispositivo.",
      state: "UNVERIFIED",
    },
    {
      id: "business-dependencies",
      label: "Dependencias críticas del negocio",
      detail: "No se sabe qué sistemas críticos dependen de esta cuenta.",
      state: "UNKNOWN",
    },
  ],
} as const satisfies SimulatedIncident;
