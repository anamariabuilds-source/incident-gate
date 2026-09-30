import { NextResponse } from "next/server";
import { simulatedIncident } from "@/data/simulated-incident";
import { buildFallbackSummary } from "@/lib/fallback-summary";
import { matchesApprovedEvidence, requestOpenAISummary } from "@/lib/openai-summary";
import { parseEvidenceList } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud JSON inválida." }, { status: 400 });
  }

  const evidence = parseEvidenceList((body as Record<string, unknown> | null)?.evidence);
  if (!evidence) return NextResponse.json({ error: "La evidencia no cumple el formato permitido." }, { status: 400 });
  if (!matchesApprovedEvidence(evidence, simulatedIncident.evidence)) {
    return NextResponse.json({ error: "La evidencia no corresponde al incidente simulado aprobado." }, { status: 400 });
  }

  const fallback = buildFallbackSummary(evidence);
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return NextResponse.json({ summary: fallback, source: "fallback" });
  }

  const liveSummary = await requestOpenAISummary({ apiKey, model, evidence });
  return liveSummary
    ? NextResponse.json({ summary: liveSummary, source: "live" })
    : NextResponse.json({ summary: fallback, source: "fallback" });
}
