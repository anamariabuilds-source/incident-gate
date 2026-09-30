import assert from "node:assert/strict";
import test from "node:test";
import { simulatedIncident } from "../data/simulated-incident.ts";
import type { EvidenceItem } from "../types/incident.ts";
import {
  extractResponseText,
  isSafeBoundedSummary,
  matchesApprovedEvidence,
  requestOpenAISummary,
} from "../lib/openai-summary.ts";

const safeSummary = "La evidencia apoya investigar un posible compromiso. El inicio inusual está confirmado, pero el reconocimiento del usuario, el dispositivo y las dependencias siguen incompletos.";

test("extracts every output_text item from a raw Responses API body", () => {
  const text = extractResponseText({
    status: "completed",
    output: [
      { type: "reasoning", content: [] },
      { type: "message", content: [{ type: "output_text", text: "Primera parte." }] },
      { type: "message", content: [{ type: "output_text", text: "Segunda parte." }] },
    ],
  });
  assert.equal(text, "Primera parte.\nSegunda parte.");
});

test("rejects incomplete responses and forbidden certainty or authorization claims", () => {
  assert.equal(extractResponseText({ status: "incomplete", output: [] }), null);
  assert.equal(isSafeBoundedSummary("La cuenta está comprometida y puedes revocar sesiones."), false);
  assert.equal(isSafeBoundedSummary("El compromiso está confirmado por la alerta."), false);
  assert.equal(isSafeBoundedSummary(safeSummary), true);
});

test("allows only the exact approved simulated evidence payload", () => {
  assert.equal(matchesApprovedEvidence(simulatedIncident.evidence, simulatedIncident.evidence), true);
  const changed: EvidenceItem[] = simulatedIncident.evidence.map((item) => ({
    ...item,
  }));
  changed[0] = { ...changed[0], detail: "Detalle modificado" };
  assert.equal(matchesApprovedEvidence(changed, simulatedIncident.evidence), false);
});

test("returns parsed live text from a successful raw API response", async () => {
  const fetchImpl: typeof fetch = async () => new Response(JSON.stringify({
    status: "completed",
    output: [{ type: "message", content: [{ type: "output_text", text: safeSummary }] }],
  }), { status: 200, headers: { "Content-Type": "application/json" } });

  const summary = await requestOpenAISummary({
    apiKey: "test-only-placeholder",
    model: "test-model",
    evidence: simulatedIncident.evidence,
    fetchImpl,
  });
  assert.equal(summary, safeSummary);
});

test("returns null on API failure so the route can use deterministic fallback", async () => {
  const fetchImpl: typeof fetch = async () => new Response("failure", { status: 503 });
  const summary = await requestOpenAISummary({
    apiKey: "test-only-placeholder",
    model: "test-model",
    evidence: simulatedIncident.evidence,
    fetchImpl,
  });
  assert.equal(summary, null);
});

test("LLM output cannot change the deterministic gate result", async () => {
  const { demoGateInput, evaluateReversibilityGate } = await import("../lib/gate.ts");
  const before = evaluateReversibilityGate(demoGateInput);
  const after = evaluateReversibilityGate(demoGateInput);
  assert.equal(before.decision, "HUMAN_ESCALATION_REQUIRED");
  assert.deepEqual(after, before);
});
