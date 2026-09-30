import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GatePanel } from "@/components/gate-panel";
import { SimulationLabel } from "@/components/simulation-label";
import { demoGateInput, demoGateResult } from "@/lib/gate";

export default function EvaluationPage() {
  return (
    <AppShell activeStep={3}>
      <section className="evaluation-page" aria-labelledby="evaluation-title">
        <div className="page-heading">
          <div><p className="eyebrow">PASO 3 DE 4 · LÍMITE DE AUTORIDAD</p><h1 id="evaluation-title">Acción propuesta</h1><p>La acción se evalúa contra condiciones explícitas; verla aquí no significa que esté autorizada.</p></div>
          <SimulationLabel />
        </div>

        <article className="proposed-action">
          <span className="user-action-icon" aria-hidden="true">●</span>
          <div><p className="eyebrow">ACCIÓN PARA EVALUAR</p><h2>Revocar sesiones activas del usuario</h2><p>Cerraría las sesiones activas de Microsoft 365 para esta cuenta. El prototipo no ejecuta esta acción.</p></div>
          <span className="not-authorized-chip">NO AUTORIZADA AÚN</span>
        </article>

        <GatePanel input={demoGateInput} />

        {demoGateResult.decision === "HUMAN_ESCALATION_REQUIRED" && (
          <section className="escalation-result" role="alert" aria-labelledby="escalation-required-title">
            <span className="warning-triangle" aria-hidden="true">!</span>
            <div><p className="eyebrow">RESULTADO DETERMINÍSTICO · NO ES UNA DECISIÓN DE IA</p><h2 id="escalation-required-title">SE REQUIERE ESCALACIÓN HUMANA</h2><p>Esta acción no está autorizada a través de Tier-1 porque no se entienden suficientemente sus consecuencias para el negocio, falta evidencia necesaria y la autoridad de Carlos no está verificada.</p></div>
          </section>
        )}

        <div className="authority-note"><strong>La asistencia de IA no amplía la autoridad de Carlos.</strong><span>La puerta usa únicamente las cuatro condiciones visibles y no acepta instrucciones del resumen de IA.</span></div>
        <div className="page-actions"><Link href="/evidencia" className="secondary-action">← Volver a evidencia</Link><Link href="/escalacion" className="primary-action compact">Preparar escalación <span aria-hidden="true">→</span></Link></div>
      </section>
    </AppShell>
  );
}
