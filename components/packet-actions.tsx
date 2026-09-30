"use client";

import { useState } from "react";

export function PacketActions({ packetText }: { packetText: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyPacket() {
    try {
      await navigator.clipboard.writeText(packetText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="packet-actions no-print">
      <button className="primary-button" type="button" onClick={() => window.print()}><span aria-hidden="true">⇩</span> Exportar paquete (PDF)</button>
      <button className="outline-button" type="button" onClick={copyPacket}><span aria-hidden="true">▣</span> {copyState === "copied" ? "Resumen copiado" : "Copiar resumen"}</button>
      <p className={`copy-feedback ${copyState}`} role="status">
        {copyState === "copied" ? "Paquete copiado al portapapeles." : copyState === "error" ? "No se pudo acceder al portapapeles. Intenta de nuevo desde una conexión segura." : "El PDF se guarda desde el diálogo de impresión del navegador."}
      </p>
    </div>
  );
}
