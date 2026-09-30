import assert from "node:assert/strict";
import test from "node:test";
import { simulatedIncident } from "../data/simulated-incident.ts";
import { buildEscalationPacket, packetToText } from "../lib/escalation-packet.ts";
import { demoGateResult } from "../lib/gate.ts";

test("the specialist packet contains the approved Tier-1 context", () => {
  const packet = buildEscalationPacket(simulatedIncident, demoGateResult);
  assert.equal(packet.account, "empleado01@empresa-demo.mx");
  assert.deepEqual(packet.confirmedEvidence, ["Inicio de sesión inusual desde el extranjero"]);
  assert.equal(packet.incompleteInformation.length, 4);
  assert.equal(packet.specialistQuestions.length, 4);
  assert.match(packet.blockReason, /requisitos de Tier-1 no se cumplieron/i);
});

test("the copied packet preserves simulation and uncertainty labels", () => {
  const text = packetToText(buildEscalationPacket(simulatedIncident, demoGateResult));
  assert.match(text, /DATOS DE SEGURIDAD SIMULADOS/);
  assert.match(text, /NO VERIFICADA/);
  assert.doesNotMatch(text, /compromiso confirmado/i);
});
