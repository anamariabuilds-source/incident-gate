import Link from "next/link";
import type { ReactNode } from "react";
import { FileIcon, GearIcon, ShieldIcon } from "@/components/icons";

const steps = [
  { number: "1.", label: "Reporte", href: "/" },
  { number: "2.", label: "Evidencia", href: "/evidencia" },
  { number: "3.", label: "Evaluación", href: "/evaluacion" },
  { number: "4.", label: "Escalación", href: "/escalacion" },
];

const sidebar = [
  { label: "Nuevo incidente", icon: FileIcon, active: true },
  { label: "Mis incidentes", icon: FileIcon },
  { label: "Recursos", icon: FileIcon },
  { label: "Configuración", icon: GearIcon },
];

export function AppShell({ activeStep, children }: { activeStep: number; children: ReactNode }) {
  return (
    <div className="app-frame">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Incident Gate — inicio">
          <ShieldIcon className="brand-icon" />
          <span><strong>Incident Gate</strong><small>Apoyo para TI generalistas en PyMEs</small></span>
        </Link>
        <nav className="step-nav" aria-label="Progreso del incidente">
          {steps.map((step, index) => (
            <Link key={step.label} href={step.href} className={activeStep === index + 1 ? "active" : ""} aria-current={activeStep === index + 1 ? "step" : undefined}>
              <span>{step.number}</span> {step.label}
            </Link>
          ))}
        </nav>
        <div className="operator">
          <span className="avatar">CR</span>
          <span><strong>Carlos Ramírez</strong><small>Proveedor de TI</small></span>
          <span aria-hidden="true">⋮</span>
        </div>
      </header>
      <div className="shell-body">
        <aside className="sidebar" aria-label="Navegación principal">
          {sidebar.map((item) => {
            const Icon = item.icon;
            return <div key={item.label} className={item.active ? "side-item active" : "side-item"} aria-disabled={!item.active}><Icon />{item.label}</div>;
          })}
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
