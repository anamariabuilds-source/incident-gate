"use client";

import { useEffect, useState } from "react";
import { FALLBACK_SUMMARY } from "@/lib/fallback-summary";
import type { EvidenceItem } from "@/types/incident";

type SummarySource = "loading" | "live" | "fallback";

export function IncidentSummary({ evidence }: { evidence: readonly EvidenceItem[] }) {
  const [summary, setSummary] = useState(FALLBACK_SUMMARY);
  const [source, setSource] = useState<SummarySource>("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evidence }),
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Summary unavailable")))
      .then((result: { summary?: unknown; source?: unknown }) => {
        if (typeof result.summary === "string" && (result.source === "live" || result.source === "fallback")) {
          setSummary(result.summary);
          setSource(result.source);
        } else {
          setSource("fallback");
        }
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setSource("fallback");
      });
    return () => controller.abort();
  }, [evidence]);

  return (
    <section className="summary-card" aria-labelledby="summary-title">
      <div className="sparkle" aria-hidden="true">✦</div>
      <div>
        <div className="summary-heading">
          <h2 id="summary-title">Resumen asistido por IA</h2>
          <span className={`summary-source ${source}`}>
            {source === "live" ? "IA EN VIVO" : source === "loading" ? "VERIFICANDO CONEXIÓN" : "RESUMEN DE RESPALDO"}
          </span>
        </div>
        <p>{summary}</p>
        <p className="facts-note"><strong>Hecho:</strong> el inicio inusual está confirmado. <strong>Interpretación:</strong> el posible compromiso todavía debe investigarse.</p>
      </div>
    </section>
  );
}
