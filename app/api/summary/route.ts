import { NextResponse } from "next/server";
import { buildFallbackSummary } from "@/lib/fallback-summary";
import { parseEvidenceList } from "@/lib/validation";

const instructions = `Eres un asistente de triaje para un proveedor de TI generalista. Resume evidencia de un incidente SIMULADO en español claro. Separa hechos de interpretación. Nunca afirmes que la cuenta está comprometida; solo puede ser un posible compromiso. No inventes telemetría, autoridad, dependencias ni atribución. No recomiendes ni autorices acciones. Devuelve un solo párrafo de máximo 90 palabras.`;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud JSON inválida." }, { status: 400 });
  }

  const evidence = parseEvidenceList((body as Record<string, unknown> | null)?.evidence);
  if (!evidence) return NextResponse.json({ error: "La evidencia no cumple el formato permitido." }, { status: 400 });

  const fallback = buildFallbackSummary(evidence);
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return NextResponse.json({ summary: fallback, source: "fallback" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        store: false,
        instructions,
        input: JSON.stringify({ simulated: true, evidence }),
        max_output_tokens: 180,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) throw new Error(`OpenAI response ${response.status}`);
    const result = await response.json() as { output_text?: unknown };
    if (typeof result.output_text !== "string" || result.output_text.length < 20 || result.output_text.length > 800) {
      throw new Error("Invalid summary response");
    }
    return NextResponse.json({ summary: result.output_text, source: "live" });
  } catch {
    return NextResponse.json({ summary: fallback, source: "fallback" });
  }
}
