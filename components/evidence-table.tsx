import { StatusBadge } from "@/components/status-badge";
import type { EvidenceItem } from "@/types/incident";

export function EvidenceTable({ evidence }: { evidence: readonly EvidenceItem[] }) {
  return (
    <div className="evidence-table-wrap">
      <table className="evidence-table">
        <thead><tr><th>Elemento</th><th>Detalle</th><th>Estado</th></tr></thead>
        <tbody>
          {evidence.map((item) => (
            <tr key={item.id}>
              <th scope="row"><span className="evidence-symbol" aria-hidden="true">{item.state === "CONFIRMED" ? "⌖" : item.state === "UNKNOWN" ? "?" : "▱"}</span>{item.label}</th>
              <td>{item.detail}</td>
              <td><StatusBadge state={item.state} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
