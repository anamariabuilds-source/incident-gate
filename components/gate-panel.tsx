import type { GateInput, GateState } from "@/types/incident";

const gateRows: Array<{
  key: keyof GateInput;
  question: string;
  help: string;
}> = [
  { key: "actionBoundedAndReversible", question: "¿Se puede revertir técnicamente?", help: "¿Podemos deshacer esta acción si es necesario?" },
  { key: "businessConsequencesUnderstood", question: "¿Entendemos las consecuencias para el negocio?", help: "¿Sabemos qué sistemas dependen de esta cuenta?" },
  { key: "requiredEvidenceAvailable", question: "¿Tenemos la evidencia necesaria?", help: "¿Contamos con información suficiente para tomar esta acción?" },
  { key: "authorityConfirmed", question: "¿Tienes la autoridad para hacerlo?", help: "¿Está verificado que un proveedor de TI generalista realice esta acción?" },
];

const gateLabels: Record<GateState, string> = {
  YES: "SÍ",
  NO: "NO",
  UNKNOWN: "DESCONOCIDO",
  UNVERIFIED: "NO VERIFICADO",
};

export function GatePanel({ input }: { input: GateInput }) {
  return (
    <section className="gate-panel" aria-labelledby="gate-title">
      <header className="gate-header"><span className="gate-shield" aria-hidden="true">✦</span><div><h2 id="gate-title">Puerta de reversibilidad</h2><p>Antes de continuar, comprobamos si esta acción puede autorizarse dentro de Tier-1.</p></div></header>
      <div className="gate-rows">
        {gateRows.map((row) => {
          const state = input[row.key];
          return (
            <div className="gate-row" key={row.key}>
              <span className={`gate-icon ${state.toLowerCase()}`} aria-hidden="true">{state === "YES" ? "✓" : state === "UNVERIFIED" ? "?" : "×"}</span>
              <div><h3>{row.question}</h3><p>{row.help}</p></div>
              <span className={`gate-value ${state.toLowerCase()}`}>{gateLabels[state]}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
