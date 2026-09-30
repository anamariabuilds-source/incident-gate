# Incident Gate — Build Decisions

## 2026-09-30 / Implementation session

### Foundation and data boundary

**DECISION**
Use four Next.js App Router routes inside one shared operational shell, with typed simulated incident data outside presentation components.

**WHY**
Direct routes preserve refresh behavior, mirror the four approved workflow states, and keep presentation separate from incident data and later gate logic.

**ALTERNATIVE REJECTED**
A single large client component with transient step state, because refreshes would lose workflow location and mix unrelated responsibilities.

**IMPACT**
The UI can stay close to the approved mockup while evidence, AI assistance, and deterministic decision logic remain independently testable.

### Security telemetry

**DECISION**  
Use only the Packet-approved invented Microsoft 365 / Defender-style telemetry and label it visibly as simulated.

**WHY**  
The approved working slice does not require a live Microsoft tenant, and no external security API should be added without a demonstrated assignment requirement.

**ALTERNATIVE REJECTED**  
Adding an unapproved external security service or assuming a free tier.

**IMPACT**  
No tenant credentials, real incident data, or security-vendor dependency is introduced.

### LLM boundary

**DECISION**  
Keep the deterministic fallback for reliability, while requiring a real server-side LLM API connection before the final deployment.

**WHY**  
The core decision boundary must survive API failure, but the final Dragon Stack must genuinely include an LLM.

**ALTERNATIVE REJECTED**  
Presenting fallback copy as live AI or allowing model output to control authorization.

**IMPACT**  
The final deployment will need a server-only API key; the gate result will remain outside the LLM boundary.

### Deterministic action boundary

**DECISION**
Implement the Reversibility Gate as a pure function that accepts only four allow-listed condition states and permits progress only when every state is `YES`.

**WHY**
`NO`, `UNKNOWN`, and `UNVERIFIED` must all reduce authority and produce human escalation.

**ALTERNATIVE REJECTED**
Passing AI prose, confidence, or recommendations into the authorization decision.

**IMPACT**
The approved demo result is stable, auditable, and testable even when the LLM is unavailable or produces unexpected text.

### Deployment 1

**DECISION**
Create the first production deployment immediately after Commit 3 and preserve its immutable identifier.

**WHY**
This records the approved core workflow through the Reversibility Gate before packet and usability corrections.

**ALTERNATIVE REJECTED**
Collapsing the core checkpoint into the final deployment.

**IMPACT**
Deployment `dpl_58Pp3dbbL7G7isKEspwLKMXvzh6L` is available at `https://incident-gate-6kysdimko-anamaria-builds.vercel.app`; the public production alias is `https://incident-gate.vercel.app`. The first CLI attempt failed because Vercel derived an invalid name from the local folder, then succeeded with the explicit project name `incident-gate`.

### Mechanical test bug

**EXPECTED**
The interface must enforce Reporte → Evidencia → Evaluación → Escalación and never expose a direct Alert → Action path.

**ACTUAL**
Every item in the top progress indicator was a link. From the initial report, Carlos could select “3. Evaluación” and reach the proposed action without reviewing evidence.

**REPRODUCTION STEPS**
Open the deployed root URL and select “3. Evaluación” in the top navigation.

**CAUSE**
The shared shell rendered all workflow steps as unrestricted Next.js links regardless of current progress.

**FIX**
Render future and current steps as non-interactive progress labels; expose links only for previously completed steps. Forward movement remains available only through each screen’s approved primary CTA.

**RETEST RESULT**
Passed. Eight automated tests, lint, type checking, and the production build succeeded. Preview deployment `dpl_HMdeGvF1WFU336CfMFVNfxqtmRbb` exposed no direct `/evaluacion` or `/escalacion` link from Reporte, rendered three future steps as locked, and retained the approved `/evidencia` CTA.

### Persona Test fix

**OBSERVED CONFUSION**
On the Initial Report screen, Carlos did not know whether “Comenzar revisión de Tier-1” meant evidence review only or also allowed changes to the Microsoft 365 account. He cautiously inferred that it meant a basic investigation.

**WHY IT MATTERS**
Requiring Carlos to infer the meaning of Tier-1 before his authority is established creates an authority-inflation risk. A less cautious generalist could interpret the label as permission to perform routine containment.

**SEVERITY**
Medium.

**SMALLEST FIX**
Add one clarification directly beneath the CTA: “Solo revisarás evidencia — esto no autoriza cambios en la cuenta.” No workflow, gate, or other interface behavior changes.

**OBSERVED OUTCOME**
Carlos did not take an unauthorized action. The later Reversibility Gate corrected the ambiguity before a consequential action was presented.

### Dragon Stack verification

**DECISION**
Use the server-only OpenAI Responses API with the Vercel-managed `OPENAI_API_KEY` and `OPENAI_MODEL`, parse raw `output` message content, and retain deterministic fallback on any API or semantic-validation failure.

**WHY**
The existing raw-fetch integration incorrectly expected the SDK-only `output_text` convenience property. The corrected boundary aggregates `output_text` content from raw response items, rejects incomplete or unsafe summaries, and never passes model output to the gate.

**SECURITY COMPONENT ASSESSMENT**
The approved Packet explicitly defines the security tooling/data layer as simulated Microsoft 365 / Defender-style telemetry. The structured incident JSON is therefore an honest simulated security-data component for this prototype, visibly labeled as simulated; it is not represented as a live Microsoft tenant or API integration.

**THIRD COMPONENT**
Structured incident JSON, allow-list validation, and the deterministic Reversibility / Authority Gate remain independent of the LLM and security-data presentation.

**ALTERNATIVE REJECTED**
Adding an unrelated external security API merely to claim an integration, connecting a real tenant, or using an SDK dependency when the existing server runtime can safely call the API.

**IMPACT**
The intended stack is: simulated Microsoft security telemetry → real server-side OpenAI assistance → deterministic gate → human escalation. The live LLM path must still be proven after authorized Production deployment; code and local fallback tests alone are not evidence that Production API access works.

### Deployment 2 verification

**DEPLOYMENT**
Production deployment `dpl_3gevNNg57YNxqXzRFLY7t9tN9QFg` at `https://incident-gate-haa91q8jk-anamaria-builds.vercel.app`, aliased to `https://incident-gate.vercel.app`.

**RUNTIME RESULT**
An HTTPS request containing only the approved simulated incident payload returned HTTP 200, `source: live`, and a non-empty bounded summary. The summary text and credentials were not printed or recorded.

**SAFETY RESULT**
The rendered Production UI labeled the summary `IA EN VIVO`, retained the visible simulated-security-data label and Persona Test clarification, and continued to return `SE REQUIERE ESCALACIÓN HUMANA` for the deterministic Gate. The LLM did not authorize a consequential action.

**CHECKS**
Fourteen automated tests, ESLint, TypeScript checking, and the Production build passed before deployment. The Production deployment reported Ready and the final rendered workflow checks passed.

### NEXT FIRST MOVE

Use the verified Production URL for the final BUILDCHAT submission; make no further product changes unless a genuine issue is discovered.
