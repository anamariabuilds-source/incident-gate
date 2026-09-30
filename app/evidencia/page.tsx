import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { EvidenceTable } from "@/components/evidence-table";
import { IncidentSummary } from "@/components/incident-summary";
import { SimulationLabel } from "@/components/simulation-label";
import { simulatedIncident } from "@/data/simulated-incident";

export default function EvidencePage() {
  return (
    <AppShell activeStep={2}>
      <section className="evidence-page" aria-labelledby="evidence-title">
        <div className="page-heading">
          <div><p className="eyebrow">PASO 2 DE 4 · REVISAR ANTES DE ACTUAR</p><h1 id="evidence-title">Evidencia del incidente</h1><p>Clasificamos cada elemento disponible según lo que realmente sabemos.</p></div>
          <SimulationLabel />
        </div>
        <div className="uncertainty-callout" role="note"><strong>CONFIRMADO no significa compromiso confirmado.</strong><span>Describe el estado de una evidencia específica, no una conclusión sobre la cuenta.</span></div>
        <EvidenceTable evidence={simulatedIncident.evidence} />
        <IncidentSummary evidence={simulatedIncident.evidence} />
        <div className="page-actions"><Link href="/" className="secondary-action">← Volver al reporte</Link><Link href="/evaluacion" className="primary-action compact">Evaluar acción propuesta <span aria-hidden="true">→</span></Link></div>
      </section>
    </AppShell>
  );
}
