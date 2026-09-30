import { AppShell } from "@/components/app-shell";
import { SimulationLabel } from "@/components/simulation-label";
import { simulatedIncident } from "@/data/simulated-incident";

export default function IncidentIntakePage() {
  return (
    <AppShell activeStep={1}>
      <div className="page-placeholder">
        <SimulationLabel />
        <h1>{simulatedIncident.title}</h1>
        <p>La base visual y el modelo de incidente simulado están listos.</p>
      </div>
    </AppShell>
  );
}
