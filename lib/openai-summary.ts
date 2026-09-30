import type { EvidenceItem } from "../types/incident";

type OpenAIContentItem = {
  type?: unknown;
  text?: unknown;
};

type OpenAIOutputItem = {
  type?: unknown;
  content?: unknown;
};

type OpenAIResponseBody = {
  status?: unknown;
  output?: unknown;
};

export const summaryInstructions = `Eres un asistente de triaje para un proveedor de TI generalista. Resume únicamente la evidencia estructurada de este incidente SIMULADO en español claro. Distingue hechos confirmados de información desconocida o no verificada. Identifica solo el contexto faltante que aparece en los datos. Nunca afirmes que la cuenta está comprometida; solo puede ser un posible compromiso. No inventes telemetría, autoridad, dependencias ni atribución. No recomiendes ni autorices acciones. No emitas conclusiones forenses. Devuelve un solo párrafo de máximo 90 palabras que incluya explícitamente la palabra “posible”.`;

export function extractResponseText(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const response = value as OpenAIResponseBody;
  if (response.status !== "completed" || !Array.isArray(response.output)) return null;

  const textParts: string[] = [];
  for (const outputItem of response.output as OpenAIOutputItem[]) {
    if (outputItem?.type !== "message" || !Array.isArray(outputItem.content)) continue;
    for (const contentItem of outputItem.content as OpenAIContentItem[]) {
      if (contentItem?.type === "output_text" && typeof contentItem.text === "string") {
        textParts.push(contentItem.text.trim());
      }
    }
  }

  const text = textParts.filter(Boolean).join("\n").trim();
  return text.length > 0 ? text : null;
}

export function isSafeBoundedSummary(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const summary = value.trim();
  if (summary.length < 20 || summary.length > 800) return false;
  if (!/posible/i.test(summary)) return false;

  const prohibitedClaims = [
    /compromiso\s+(?:está\s+)?confirmado/i,
    /cuenta\s+(?:está|fue|ha sido)\s+comprometida/i,
    /(?:puedes|puede|debes|debe)\s+revocar/i,
    /(?:acción|contención)\s+(?:está\s+)?autorizada/i,
  ];
  return !prohibitedClaims.some((pattern) => pattern.test(summary));
}

export function matchesApprovedEvidence(
  received: readonly EvidenceItem[],
  approved: readonly EvidenceItem[],
): boolean {
  if (received.length !== approved.length) return false;
  return approved.every((expected, index) => {
    const actual = received[index];
    return actual?.id === expected.id &&
      actual.label === expected.label &&
      actual.detail === expected.detail &&
      actual.state === expected.state;
  });
}

export async function requestOpenAISummary({
  apiKey,
  model,
  evidence,
  fetchImpl = fetch,
}: {
  apiKey: string;
  model: string;
  evidence: readonly EvidenceItem[];
  fetchImpl?: typeof fetch;
}): Promise<string | null> {
  try {
    const response = await fetchImpl("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        store: false,
        reasoning: { effort: "none" },
        instructions: summaryInstructions,
        input: JSON.stringify({ simulated_security_telemetry: true, evidence }),
        max_output_tokens: 220,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) return null;
    const text = extractResponseText(await response.json());
    return isSafeBoundedSummary(text) ? text.trim() : null;
  } catch {
    return null;
  }
}
