import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PacketActions } from "@/components/packet-actions";
import { SimulationLabel } from "@/components/simulation-label";
import { simulatedIncident } from "@/data/simulated-incident";
import { buildEscalationPacket, packetToText } from "@/lib/escalation-packet";
import { demoGateResult } from "@/lib/gate";

export default function EscalationPage() {
  const packet = buildEscalationPacket(simulatedIncident, demoGateResult);

  return (
    <AppShell activeStep={4}>
      <section className="escalation-page" aria-labelledby="packet-title">
        <div className="page-heading no-print">
          <div><p className="eyebrow">PASO 4 DE 4 · CONTEXTO PARA DECISIÓN ESPECIALISTA</p><h1 id="packet-title">Paquete listo para especialista</h1><p>Resumen estructurado para que un especialista revise el contexto Tier-1 sin repetir la recepción inicial.</p></div>
          <SimulationLabel />
        </div>

        <div className="packet-layout">
          <article className="packet-document" aria-label="Paquete de escalación">
            <div className="print-only print-heading"><strong>Incident Gate</strong><SimulationLabel /></div>
            <PacketSection icon="▤" title="Resumen del incidente">
              <p>{packet.incidentType} en Microsoft 365</p><p><strong>{packet.account}</strong></p><p>Detectado el {packet.detectedAt}</p>
            </PacketSection>
            <PacketSection icon="✓" iconTone="success" title="Evidencia confirmada">
              <ul>{packet.confirmedEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="packet-clarifier">Esto confirma una señal inusual, no confirma que la cuenta esté comprometida.</p>
            </PacketSection>
            <PacketSection icon="?" iconTone="unknown" title="Información desconocida o no verificada">
              <ul>{packet.incompleteInformation.map((item) => <li key={item}>{item}</li>)}</ul>
            </PacketSection>
            <PacketSection icon="⚙" title="Acción propuesta"><p>{packet.proposedAction}</p></PacketSection>
            <PacketSection icon="!" iconTone="danger" title="Razón por la que se bloqueó en Tier-1"><p>{packet.blockReason}</p></PacketSection>
            <PacketSection icon="?" title="Preguntas para el especialista"><ul>{packet.specialistQuestions.map((question) => <li key={question}>{question}</li>)}</ul></PacketSection>
            <footer className="packet-footer">Generado con datos inventados para demostración. Este documento no ejecuta acciones de contención.</footer>
          </article>

          <aside className="packet-sidebar no-print">
            <section className="next-steps"><h2>Siguientes pasos</h2><ol><li><span>1</span>Compartir con el especialista</li><li><span>2</span>Esperar confirmación</li><li><span>3</span>Seguir sus instrucciones</li><li><span>4</span>Documentar la decisión</li></ol></section>
            <PacketActions packetText={packetToText(packet)} />
            <section className="safe-share-note"><span aria-hidden="true">▣</span><div><strong>Paquete de demostración</strong><p>No contiene contraseñas ni información personal real.</p></div></section>
            <Link href="/evaluacion" className="secondary-action packet-back">← Volver a la evaluación</Link>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}

function PacketSection({ icon, iconTone = "default", title, children }: { icon: string; iconTone?: "default" | "success" | "unknown" | "danger"; title: string; children: React.ReactNode }) {
  return <section className="packet-section"><span className={`packet-icon ${iconTone}`} aria-hidden="true">{icon}</span><div><h2>{title}</h2>{children}</div></section>;
}
