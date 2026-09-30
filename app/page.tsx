import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SimulationLabel } from "@/components/simulation-label";
import { simulatedIncident } from "@/data/simulated-incident";

export default function IncidentIntakePage() {
  return (
    <AppShell activeStep={1}>
      <section className="intake-page" aria-labelledby="incident-title">
        <div className="simulation-row"><SimulationLabel /></div>
        <div className="alert-banner">
          <span className="warning-triangle" aria-hidden="true">!</span>
          <div>
            <p className="eyebrow">ALERTA DE SEGURIDAD · MICROSOFT 365</p>
            <h1 id="incident-title">{simulatedIncident.title}</h1>
            <p>Se detectó una actividad inusual en una cuenta de Microsoft 365.</p>
          </div>
          <time dateTime={simulatedIncident.occurredAt}><strong>8:07 AM</strong><span>14 de enero de 2026</span></time>
        </div>

        <div className="intake-grid">
          <article className="panel information-panel">
            <h2>Información inicial</h2>
            <dl className="incident-facts">
              <div><dt>Cuenta</dt><dd>{simulatedIncident.account}</dd></div>
              <div><dt>Tipo de alerta</dt><dd>{simulatedIncident.alertType} ({simulatedIncident.context})</dd></div>
              <div><dt>Hora del evento</dt><dd>8:07 AM (hora CDMX)</dd></div>
              <div><dt>Fuente</dt><dd>{simulatedIncident.source}</dd></div>
            </dl>
          </article>

          <article className="panel explainer-panel">
            <h2><span className="info-icon" aria-hidden="true">i</span> ¿Qué significa esto?</h2>
            <p>Puede ser un inicio de sesión válido o un posible compromiso. Primero debemos revisar la evidencia disponible.</p>
            <ul>
              <li>Revisar evidencia disponible</li>
              <li>Evaluar una sola acción propuesta</li>
              <li>Verificar si puedes realizarla</li>
              <li>Escalar cuando se necesite un especialista</li>
            </ul>
          </article>
        </div>

        <div className="semantic-note" role="note">
          <strong>Esta alerta no confirma un compromiso.</strong>
          <span>Una señal inusual es evidencia para investigar, no una conclusión forense.</span>
        </div>

        <Link className="primary-action" href="/evidencia">Comenzar revisión de Tier-1 <span aria-hidden="true">→</span></Link>
      </section>
    </AppShell>
  );
}
