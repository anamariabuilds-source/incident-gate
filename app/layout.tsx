import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Gate",
  description: "Límite seguro de decisión Tier-1 para un incidente simulado de Microsoft 365.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
